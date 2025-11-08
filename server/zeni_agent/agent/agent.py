import firebase_admin
from firebase_admin import credentials, firestore
from google.adk.agents import Agent, LlmAgent, SequentialAgent
import os
from datetime import datetime, date 

AGENT_DIR = os.path.dirname(os.path.abspath(__file__))

# The credential file name
CRED_FILE_NAME = "firebase-cred.json"

# Construct the path relative to the agent.py file's location (AGENT_DIR)
# This path works inside the Cloud Run container because the entire zeni_agent folder was uploaded.
CREDENTIALS_PATH = os.path.join(AGENT_DIR, CRED_FILE_NAME)

# --- 1. FIRESTORE INITIALIZATION ---
# NOTE: This code assumes the ADK framework is running in an environment 
# where it can access the credentials file path specified in the environment variables 
# or the local fallback path.
try:
    cred_path = CREDENTIALS_PATH
    # Check if the Firebase app has already been initialized (prevents errors on ADK reloads)
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    db = firestore.client()
except ValueError:
    # If initialization fails (e.g., during ADK test harness reloads)
    db = firestore.client()
# ----------------------------------


# --- NEW HELPER FUNCTION: GOAL TRACKING LOGIC ---

def check_and_update_related_goals(expense_data: dict) -> str:
    """
    Finds and updates related financial goals after a new expense has been saved.
    
    This function now implements semantic checking by matching the expense's 'category' 
    against the goal's 'expense_tag' field, which was set by an LLM.
    """
    user_id = expense_data['userId']
    category = expense_data['category']
    amount = expense_data['amount']
    
    # 🎯 FIX: Query goals based on user ID and matching the expense's category 
    # against the goal's 'expense_tag' field.
    goals_query = db.collection("goals").where("userId", "==", user_id).where("expense_tag", "==", category).stream()
    
    updated_goals_count = 0
    
    for goal_doc in goals_query:
        try:
            goal_ref = goal_doc.reference
            goal = goal_doc.to_dict()
            
            current_spent = goal.get('total_spent', 0)
            goal_amount = goal.get('goal_amount', 0)
            
            new_spent = current_spent + amount
            
            # Calculate percentage completed
            # This logic assumes the goal is to spend up to goal_amount (e.g., spending cap)
            if goal_amount > 0:
                new_progress_completed = (new_spent / goal_amount) * 100
                
                # --- NEW CALCULATIONS ---
                new_progress_remaining = 100 - new_progress_completed
                new_total_remaining = goal_amount - new_spent
                
                # Ensure values don't go below zero for clean display
                if new_progress_remaining < 0:
                    new_progress_remaining = 0
                if new_total_remaining < 0:
                    new_total_remaining = 0
                # --- END NEW CALCULATIONS ---
                
            else:
                new_progress_completed = 0
                new_progress_remaining = 100
                new_total_remaining = goal_amount
            
            # Update the goal document fields
            goal_ref.update({
                "total_spent": new_spent,
                "progress_completed": new_progress_completed,
                "progress_remaining": new_progress_remaining, # ADDED
                "total_remaining": new_total_remaining,       # ADDED
            })
            updated_goals_count += 1
            
        except Exception as e:
            # Log the specific goal update error without failing the main expense save
            print(f"Goal Update Error for goal {goal_doc.id}: {e}")
            
    return f"Goal checker: {updated_goals_count} goal(s) updated."


# --- 2. FIRESTORE TOOL FUNCTIONS (UPDATED) ---

def save_expense_to_firestore(amount: float, name: str, date_str: str, category: str, userId: str) -> dict:
    """
    Saves a structured expense record to the 'expenses' collection in Firestore 
    AND triggers goal tracking.
    """
    expense_doc = {
        "amount": amount,
        "name": name,
        "date": firestore.SERVER_TIMESTAMP,
        "category": category,
        "timestamp": firestore.SERVER_TIMESTAMP,
        "userId": userId
    }
    
    try:
        # 1. Save the expense
        doc_ref = db.collection("expenses").add(expense_doc)[1]
        
        # 2. Check and update related goals (NEW STEP)
        goal_update_message = check_and_update_related_goals(expense_doc)
        
        return {
            "status": "success",
            "expense_id": doc_ref.id,
            "message": f"Expense of {amount:.2f} logged successfully. {goal_update_message}"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"DATABASE ERROR: Failed to save expense/update goals. Reason: {e}"
        }


def add_new_goal_to_firestore(userId: str, goal_name: str, goal_amount : float, goal_description: str, expense_tag: str) -> dict:
    """
    Saves a new financial goal to the 'goals' collection in Firestore.
    
    🎯 UPDATED: Now accepts 'expense_tag' for semantic matching.
    """
    try:
        goal_doc = {
            "userId": userId,
            "name" : goal_name,
            "goal_amount": goal_amount,
            "goal_description": goal_description,
            "expense_tag": expense_tag,  # 🎯 NEW FIELD FOR SEMANTIC MATCHING
            "progress_completed": 0,
            "progress_remaining": 100,
            "total_remaining": goal_amount,
            "total_spent": 0,
            "created_at": firestore.SERVER_TIMESTAMP
        }
        
        doc_ref = db.collection("goals").add(goal_doc)[1]
        
        return {
            "status": "success",
            "goal_id": doc_ref.id,
            "message": f"New goal '{goal_name}' for {goal_amount} added successfully."
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"DATABASE ERROR: Failed to add goal. Reason: {e}"
        }


def get_user_expenses_from_firestore(userId: str) -> dict:
    """
    Retrieves all expenses for a specific user from the 'expenses' collection.
    """
    try:
        expenses_ref = db.collection("expenses").where("userId", "==", userId).stream()
        
        expenses_list = []
        for doc in expenses_ref:
            expense_data = doc.to_dict()
            expense_data['expense_id'] = doc.id
            
            # Convert Firestore Timestamp object to ISO string for easy reading by LLM
            if 'timestamp' in expense_data and hasattr(expense_data['timestamp'], 'isoformat'):
                expense_data['timestamp'] = expense_data['timestamp'].isoformat() 
            
            expenses_list.append(expense_data)
        
        return {
            "status": "success",
            "count": len(expenses_list),
            "data": expenses_list,
            "message": f"Successfully retrieved {len(expenses_list)} expenses for user {userId}."
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"DATABASE ERROR: Failed to retrieve expenses. Reason: {e}"
        }


def get_single_goal_from_firestore(userId: str, goalId: str) -> dict:
    """
    Retrieves a single financial goal for a specific user based on the goal ID.
    """
    try:
        goal_doc_ref = db.collection("goals").document(goalId)
        goal_doc = goal_doc_ref.get()
        
        if not goal_doc.exists:
            return {
                "status": "error",
                "message": f"Goal with ID {goalId} not found."
            }
        
        goal_data = goal_doc.to_dict()
        
        # Check if the retrieved goal belongs to the correct user for security/data integrity
        if goal_data.get('userId') != userId:
            return {
                "status": "error",
                "message": f"Authorization Error: Goal {goalId} does not belong to user {userId}."
            }

        goal_data['goal_id'] = goal_doc.id
        
        # Convert Firestore Timestamp object to ISO string
        if 'created_at' in goal_data and hasattr(goal_data['created_at'], 'isoformat'):
            goal_data['created_at'] = goal_data['created_at'].isoformat() 
        
        return {
            "status": "success",
            "data": goal_data,
            "message": f"Successfully retrieved goal {goalId}."
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"DATABASE ERROR: Failed to retrieve goal. Reason: {e}"
        }
# ----------------------------------


# --- 3. SPECIALIZED AGENT DEFINITIONS ---

# 3.1. Expense Logging Agent
expense_agent = Agent(
    name="data_structuring_agent",
    model='gemini-2.5-flash',
    description="This agent is a specialist in **logging a new expense**. It handles all tasks related to recognizing an amount, item, and category, and saving it to the database.",
    instruction="""
        You are a professional expense logger. Your SOLE function is to analyze the user's text,
        extract the 'amount', 'name', 'category', the current 'date' (in YYYY-MM-DD format), 
        and the **'userId'**.
        
        The 'category' MUST be chosen from one of these fixed values: [food, transport, clothing, fun, health, work, misc., housing, utilities, financial, personal, pets].
        You MUST call the 'save_expense_to_firestore' tool with the extracted, structured data. 
        After the tool executes, relay the tool's return message back to the user without any commentary.
    """,
    tools=[save_expense_to_firestore]
)

# 3.2. Goal Setting Agent (UPDATED)
goal_agent = Agent(
    name="budget_goal_agent",
    model='gemini-2.5-flash',
    description="This agent is a specialist in **setting or adding a new financial goal or budget**.",
    instruction="""
        You are a professional goal logger. Your SOLE function is to analyze the user's text,
        extract the 'goal_name', 'goal_amount', 'goal_description', 'userId', and crucially, 
        the single most relevant expense category (which you must name 'expense_tag') from these fixed values: 
        [food, transport, clothing, fun, health, work, misc., housing, utilities, financial, personal, pets].
        
        You MUST call the 'add_new_goal_to_firestore' tool with the extracted, structured data. 
        After the tool executes, relay the tool's return message back to the user without any commentary.
    """,
    tools=[add_new_goal_to_firestore]
)


# --- 4. EXPENSE ANALYSIS PIPELINE (OVERALL SPENDING) ---

# Step 4.1: Agent 1 - Fetch the Raw Expense Data and Save to State
data_fetcher_agent = LlmAgent(
    name="DataFetcher",
    model="gemini-2.5-flash",
    instruction="""
        Use the 'get_user_expenses_from_firestore' tool to retrieve all expenses for the given userId. 
        Do not process or summarize the data. The subsequent agent will handle the analysis.
    """,
    tools=[get_user_expenses_from_firestore],
    output_key="raw_expense_data" # Saves the tool's successful return dict to the shared state
)

# Step 4.2: Agent 2 - Process the Data from State (The Analyst)
data_processor_agent = LlmAgent(
    name="DataProcessor",
    model="gemini-2.5-flash",
  instruction="""
        You are a **Friendly and Insightful Financial Coach**. Your tone is warm, personal, and encouraging, focusing on collaboration and positive habit building, not judgment. You understand that the user asked for this analysis to gain control of their finances.

        Your task is to analyze the raw JSON expense data found in the shared session state under the key 'raw_expense_data'. Treat the user as a partner in their financial journey.

        **Start the entire response with a single, positive opening sentence** that acknowledges the user's proactive step (e.g., "Great job reaching out for a financial check-up! I've analyzed your data, and here's what we found.").

        Provide a detailed, easy-to-read personal financial check-up in three conversational sections:

        ### 1. Your Money Snapshot
        - Present the core facts in a **friendly narrative** (e.g., "Over the past month, we logged [Total Expenditures] across [Expense Count] entries.").
        - **Crucially, identify and clearly highlight** the **top two areas** where the user is spending the most money and the specific amount spent in each. Frame this as "Where your budget is doing the most work."

        ### 2. Coach's Observation (Key Insights)
        - Gently point out the **largest single expense** and categorize it as 'unusual' or 'expected'. Ask a simple, non-judgmental question about it to encourage reflection (e.g., "Was this a one-off purchase, or does it signal a new recurring habit?").
        - Based on overall spending patterns, give a high-level verdict: "Your spending looks generally balanced," or "We might have a small leak in the [Category] area." Avoid clinical jargon.

        ### 3. Next Steps: Building a Stronger Plan
        - Offer **one primary, specific, and actionable tip** for saving money next month, directly targeting the most active spending area (e.g., "Since Food is the highest, try meal prepping twice a week to save $XX.").
        - Offer **one encouraging suggestion** focused on reinforcing positive financial behavior (e.g., logging frequency or planning for a big goal).

        The final output must be personal, use "we" or "you," and be structured with friendly Markdown headings.
    """
)

analysis_pipeline = SequentialAgent(
    name="SequentialAnalysisPipeline",
    description="Orchestrates the two-step process: fetching all expense data, then processing/summarizing it.",
    sub_agents=[data_fetcher_agent, data_processor_agent]
)


# --- 5. SINGLE GOAL ANALYSIS PIPELINE ---

# Step 5.1: Agent 1 - Fetch the Single Goal and Save to State 
goal_fetcher_agent = LlmAgent(
    name="GoalFetcher",
    model="gemini-2.5-flash",
    # FIX: Ensure no conversational wrapper is saved to the state, only the raw tool result.
    instruction="""
        Your SOLE purpose is to call the 'get_single_goal_from_firestore' tool with the extracted 
        **goalId** and **userId** from the user's input. 
        DO NOT provide any conversational response, summary, or confirmation. 
        The only output must be the result of the function call.
    """,
    tools=[get_single_goal_from_firestore],
    output_key="single_goal_data" # Saves the tool's successful return dict to shared state
)

# Step 5.2: Agent 2 - Read the State and Provide Advice
goal_advisor_agent = LlmAgent(
    name="GoalAdvisor",
    model="gemini-2.5-flash",
    instruction="""
        You are a **Proactive Financial Risk Manager and Supportive Coach**. Your tone is focused on helping the user stay under budget, emphasizing awareness and prevention rather than celebration.

        Your task is to analyze the single financial goal found in the shared session state under the key 'single_goal_data'. The relevant goal object is located within the 'data' field of the state value.

        **Start the entire response with a single, direct sentence** that sets the appropriate tone (e.g., "Let's review the risk level for your [Goal Name] budget." or "I've checked in on your [Goal Name] spending cap.").

        Your analysis MUST be structured in two sections:

        ### 1. Risk Status Check
        - Analyze the data using the goal's status: **0% is excellent, 100% or more is critical/overspent.**
        - Provide a detailed, one-paragraph summary of the user's progress. **DO NOT use bullet points in this section.**
        - **Integrate the core stats (name, target amount, amount spent, and percentage completed)** into a supportive narrative.
        - **If progress is low (e.g., < 50%):** Acknowledge the great control and low risk.
        - **If progress is high (e.g., > 80%):** Issue a **gentle but firm warning** about the immediate spending pressure and high risk of exceeding the cap.
        - **If progress is 100% or more:** State clearly and empathetically that the cap has been exceeded and quantify the overage.

        ### 2. Immediate Action Plan
        - Offer **one primary, specific, and tactical tip** tailored to the current risk level:
            - **Low Risk:** Suggest a small, reinforcing habit (e.g., "Keep it up! Maybe allocate 10% of the remaining budget to another goal?").
            - **High Risk:** Suggest an **immediate behavioral adjustment** for the rest of the period (e.g., "For the next week, freeze all spending in this category to reset your total.").
            - **Overspent (≥ 100%):** Focus on a **recovery action**, suggesting a specific, actionable way to cut spending in another area to compensate.

        Present your final output clearly using conversational Markdown headings and a tone that is professional but deeply invested in the user's success.
    """
)

single_goal_analysis_pipeline = SequentialAgent(
    name="SingleGoalAnalysisPipeline",
    description="Orchestrates the two-step process: fetching a single goal by ID, then providing analysis and advice.",
    sub_agents=[goal_fetcher_agent, goal_advisor_agent]
)


# --- 6. CATEGORY ANALYSIS PIPELINE (NEW FEATURE) ---

# Step 6.1: Agent 1 - Fetch Data (Reuses DataFetcher logic)
category_data_fetcher = LlmAgent(
    name="CategoryDataFetcher",
    model="gemini-2.5-flash",
    instruction="""
        Your sole task is to call the 'get_user_expenses_from_firestore' tool to retrieve all expenses for the user. 
        DO NOT provide any response or analysis.
    """,
    tools=[get_user_expenses_from_firestore],
    output_key="raw_category_data" # New key to keep pipeline state separate
)

# Step 6.2: Agent 2 - Analyze Category Spending
category_spending_advisor = LlmAgent(
    name="CategorySpendingAdvisor",
    model="gemini-2.5-flash",
    instruction="""
        You are a **friendly and specialized Spending Coach**. Your job is to help the user understand their habits in a specific category.
        
        1. **Identify the Target:** Determine the specific spending category (e.g., 'food', 'transport') from the original user's question.
        2. **Analyze Data:** Use the expense data in 'raw_category_data' to calculate the total spent in that specific category and its percentage share of the user's *overall* spending.
        
        Your final response must have two sections:
        
        ### 1. Your Spending Verdict
        - Start by clearly stating the target category.
        - Give a clear judgment (Under, Normal, or Overspending) by comparing the percentage share to typical, reasoned benchmarks.
        - Present the total spent in that category and its percentage of the total budget in a friendly narrative.
        
        ### 2. Quick Action Plan
        - Offer **one single, highly practical and encouraging tip** to help the user optimize or save money in that specific category next month.
        
        Use an encouraging, friendly tone and clear Markdown.
    """
)

category_analysis_pipeline = SequentialAgent(
    name="CategoryAnalysisPipeline",
    description="Handles detailed analysis for a single expense category based on the user's query.",
    sub_agents=[category_data_fetcher, category_spending_advisor]
)


# --- 7. ROOT COORDINATOR AGENT (FINAL) ---

root_agent = LlmAgent(
    name="agents_coordinator",
    model="gemini-2.0-flash",
    instruction="""
        You are the main Agent Coordinator and task delegator. 
        Your ONLY job is to route the user's request to the correct specialist agent based on their description.
        Delegate logging expenses to 'data_structuring_agent', setting a NEW goal to 'budget_goal_agent', 
        requesting overall expense analysis to 'SequentialAnalysisPipeline', 
        requesting specific, single goal analysis to 'SingleGoalAnalysisPipeline', and 
        **any query asking about spending habits, trends, or overspending in a specific category** (like food or transport) to 'CategoryAnalysisPipeline'.
        Do NOT answer the queries yourself.
    """,
    description="Agent coordinator and task delegator.",
    sub_agents=[  # Assign all specialists (including pipelines) as children
        expense_agent,
        goal_agent,
        analysis_pipeline,
        single_goal_analysis_pipeline,
        category_analysis_pipeline
    ]
)