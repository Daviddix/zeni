import firebase_admin
from firebase_admin import credentials, firestore
from google.adk.agents import Agent
import datetime
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


root_agent = Agent(
    name="data_structuring_agent",
    model='gemini-2.5-flash',
    description="An agent that takes plain text input for an expense and transforms it into an object.",
    instruction="""
        You are a professional expense logger. Your SOLE function is to analyze the user's text,
        extract the 'amount', 'name', 'category', and current 'date' (in YYYY-MM-DD format). 
        
        The 'category' MUST be chosen from one of these fixed values: [food, transport, clothing, fun, health, productivity, misc.].
        
        You MUST call the 'save_expense_to_firestore' tool with the extracted, structured data. 
        After the tool executes, relay the tool's return message back to the user without any commentary.
    """,
    tools=[save_expense_to_firestore]
)