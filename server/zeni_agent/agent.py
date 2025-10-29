import firebase_admin
from firebase_admin import credentials, firestore
from google.adk.agents import Agent
from google.adk.tools import FunctionTool
from typing import TypedDict, Literal, Any
import datetime

# --- 1. FIREBASE INITIALIZATION ---
# NOTE: Replace "firebase-key.json" with the actual path to your downloaded file.
try:
    # Initialize Firebase using the Service Account key
    cred = credentials.Certificate("C:\\Users\\hp\\Documents\\Zeni\\server\\firebase-cred.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except ValueError:
    # This handles reloads by the ADK framework during development
    db = firestore.client()
# ----------------------------------


# --- 2. STRUCTURED JSON SCHEMA ---
class ExpenseData(TypedDict):
    """
    The structured data schema the LLM must adhere to when calling the tool.
    This defines the expected JSON output from the agent's reasoning process.
    """
    amount: float
    # Use Literal to give the LLM a fixed set of categories, improving accuracy
    category: Literal["Food", "Travel", "Groceries", "Entertainment", "Other"] 
    description: str
    date: str  # Format: YYYY-MM-DD
# ----------------------------------


# --- 3. FIRESTORE TOOL FUNCTION ---
def save_expense_to_firestore(amount: float, name: str, date: str, category: str) -> str:
    """
    Saves a structured expense record to the 'expenses' collection in Firestore.
    
    Args:
        amount (float): The monetary value of the expense.
        name (str): The specific item or service purchased (e.g., "bread").
        date (str): The date of the expense in YYYY-MM-DD format.
        category (str): The category, chosen from [food, transport, clothing, fun, health, productivity, misc.].
    """
    try:
        expense_datetime = datetime.datetime.strptime(date, '%Y-%m-%d') 
        
        expense_doc = {
            "amount": amount,
            "name": name,
            "date": expense_datetime, # <-- Pass the full datetime object here
            "category": category,
            "timestamp": firestore.SERVER_TIMESTAMP,
        }
        
        db.collection("expenses").add(expense_doc)
        
        return f"SUCCESS: Recorded {category} expense of ${amount:.2f} for {name} to Firestore."
    
    except Exception as e:
        return f"DATABASE ERROR: Failed to save expense. Reason: {e}"


# --- 5. ADK AGENT DEFINITION ---
root_agent = Agent(
    name="ExpenseTrackerAgent",
    model='gemini-2.5-flash',
    description="An agent that takes plain text input for an expense and transforms it into an object.",
    instruction="""
        You are a professional expense logger. Your SOLE function is to analyze the user's text,
        extract the 'amount', 'name', 'category', and current 'date' (in YYYY-MM-DD format). 
        
        The 'category' MUST be chosen from one of these fixed values: [food, transport, clothing, fun, health, productivity, misc.].
        
        You MUST call the 'save_expense_to_firestore' tool with the extracted, structured data. 
        After the tool executes, relay the tool's return message back to the user without any commentary.
    """,
    # Pass the FunctionTool instance to the agent
    tools=[save_expense_to_firestore] 
)