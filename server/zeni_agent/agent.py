import firebase_admin
from firebase_admin import credentials, firestore
from google.adk.agents import Agent, LlmAgent
import os


try:
    # Initialize Firebase using the Service Account key
    cred_path = os.environ.get("FIREBASE_CREDENTIALS_PATH", "C:\\Users\\hp\\Documents\\Zeni\\server\\firebase-cred.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except ValueError:
    # This handles reloads by the ADK framework during development
    db = firestore.client()
# ----------------------------------


def save_expense_to_firestore(amount: float, name: str, date: str, category: str, userId: str) -> dict:
    """
    Saves a structured expense record to the 'expenses' collection in Firestore.
    
    Args:
        amount (float): The monetary value of the expense.
        name (str): The specific item or service purchased (e.g., "bread").
        date (str): The date of the expense in YYYY-MM-DD format.
        category (str): The category, chosen from [food, transport, clothing, fun, health, productivity, misc.].
        userId (str): The ID of the user making the expense.
    """
    try:
        # Parse date and make it timezone-aware (UTC) for Firestore compatibility
        
        expense_doc = {
            "amount": amount,
            "name": name,
            # Firestore Python SDK will convert this to a Firestore timestamp
            "date": firestore.SERVER_TIMESTAMP,
            "category": category,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "userId": userId
        }
        
        doc_ref = db.collection("expenses").add(expense_doc)[1]
        
        return {
            "status": "success",
            "expense_id": doc_ref.id,
            "message": f"Expense of ${amount:.2f} saved successfully."
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"DATABASE ERROR: Failed to save expense. Reason: {e}"
        }


def add_new_goal_to_firestore(userId: str, goal_name: str, goal_amount : float) -> dict:
    """
    Saves a new financial goal to the 'goals' collection in Firestore.
    
    Args:
        userId (str): The ID of the user setting the goal.
        goal_text (str): The text description of the financial goal.
    """
    try:
        goal_doc = {
            "userId": userId,
            "name" : goal_name,
            "goal_amount": goal_amount,
            "progress_completed" : 0,
            "progress_remaining" : 100,
            "total_spent": 0,
            "total_remaining" : goal_amount,
            "created_at": firestore.SERVER_TIMESTAMP
        }
        
        doc_ref = db.collection("goals").add(goal_doc)[1]
        
        return {
            "status": "success",
            "goal_id": doc_ref.id,
            "message": "New goal added successfully."
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"DATABASE ERROR: Failed to add goal. Reason: {e}"
        }

expense_agent = Agent(
    name="data_structuring_agent",
    model='gemini-2.5-flash',
    # 🎯 FIX: Clearly state the agent's external function for the Coordinator to read
    description="This agent is a specialist in **logging a new expense**. It handles all tasks related to recognizing an amount, item, and category, and saving it to the database.",
    instruction="""
        You are a professional expense logger. Your SOLE function is to analyze the user's text,
        extract the 'amount', 'name', 'category', and current 'date' (in YYYY-MM-DD format). 
        ... (rest of the instruction)
    """,
    tools=[save_expense_to_firestore]
)

# Updated Goal Agent Definition
goal_agent = Agent(
    name="budget_goal_agent",
    model='gemini-2.5-flash',
    # 🎯 FIX: Clearly state the agent's external function for the Coordinator to read
    description="This agent is a specialist in **setting or adding a new financial goal or budget**. It handles extracting the goal name and target amount, and saving it to the database.",
    instruction="""
        You are a professional goal logger. Your SOLE function is to analyze the user's text,
        extract the 'goal_name', 'goal_amount' and 'userId'
        ... (rest of the instruction)
    """,
    tools=[add_new_goal_to_firestore]
)
root_agent = LlmAgent(
    name="agents_coordinator",
    model="gemini-2.0-flash",
    # 🎯 Refined Instruction: Be explicit about the delegation process
    instruction="""
        You are the main Agent Coordinator and task delegator. 
        Your ONLY job is to route the user's request to the correct sub-agent.
        Analyze the request: if it is about logging a cost, delegate to 'data_structuring_agent'.
        If it is about setting a financial target, delegate to 'budget_goal_agent'.
        Do NOT attempt to answer or structure the data yourself.
    """,
    description="Agent coordinator and task delegator.",
    sub_agents=[
        expense_agent,
        goal_agent
    ]
)