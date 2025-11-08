const { db } = require("../config/firebase");
const { getDateRange } = require("../libs/date");

const AI_AGENT_URL = process.env.AI_AGENT_URL || "http://localhost:8000";
const AGENT_APP_NAME = 'agent'; // Use the directory name or app name ADK uses

async function getUsersTransactions(req, res) {
    // Assuming the user's ID is retrieved from the authenticated request
    const { uid } = req.user; 

    try {
        console.log(`Fetching expenses for user ID: ${uid}`);

        // 2. Query the 'expenses' collection
        // This query filters documents where the 'userId' field matches the authenticated user's uid.
        const snapshot = await db.collection('expenses')
            .where('userId', '==', uid) // <-- CRITICAL: Filter by the user's ID
            .orderBy('timestamp', 'desc') // Optionally sort by time, newest first
            .get();

        if (snapshot.empty) {
            return res.status(200).json({ 
                success: true, 
                message: "No expenses found for this user.", 
                expenses: [] 
            });
        }

        // 3. Map the documents to a list of JavaScript objects
        const expenses = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                amount: data.amount,
                name: data.name,
                category: data.category,
                // Convert Firestore Timestamp/Date object back to ISO string or number
                date: data.date ? data.date.toDate().getTime() : null, 
            };
        });

        // 4. Return the list of expenses
        return res.status(200).json({
            success: true,
            expenses: expenses
        });

    } catch (err) {
        console.error('Error fetching user expenses:', err);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve expenses.",
            error: err.message
        });
    }
}

async function createAISessionForUser(req, res){
  try{
    const {uid} = req.user 
    const now = new Date();
    const sessionId = `session-${uid}-${now.getTime()}`

    console.log("Creating session for user:", uid);

    const sessionPayload = {
      state: {
      }
    }

    const rawFetchSession = await fetch(`${AI_AGENT_URL}/apps/${AGENT_APP_NAME}/users/${uid}/sessions/${sessionId}`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sessionPayload)
    });


    const sessionData = await rawFetchSession.json();

    if(!rawFetchSession.ok){
      console.log("AI Agent Session Creation Failed:", sessionData);
      return res.status(500).json({
        success: false,
        message: "AI agent session creation failed"
      })
    }


    console.log("AI Agent Session Data:", sessionData);

    return res.status(200).json({
      success: true,
      sessionId : sessionData.id
    });
    
  }catch(err){
    console.log("Error in createSessionForUser:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create session for user",
      error: err.message || "Unknown error"
    })
  }
}

async function createTransactionFromText(req, res){
  try{
    const {uid} = req.user 
    const {userText, sessionId} = req.body 

    if(!userText){
      return res.status(400).json({
        success: false,
        message: "userText is required"
      })
    }

    const fullText = `${userText} from user with the userId of ${uid}`

    const payload = {
        app_name: AGENT_APP_NAME,
        user_id: uid,
        session_id: sessionId,
        new_message: {
            role: "user",
            parts: [{ text: fullText }]
        }
    };

    console.log("Sending payload to AI Agent:", payload);

    const rawFetch = await fetch(`${AI_AGENT_URL}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const agentResponse = await rawFetch.json();

    if(!rawFetch.ok){
      console.log("AI Agent Request Failed:", agentResponse);
      return res.status(500).json({
        success: false,
        message: "AI agent request failed"
      })
    }


    console.log("AI Agent Response:", agentResponse);

    return res.status(200).json({
      agentResponse
    });
  }
  catch(err){
    console.log("Error in createTransactionFromText:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create transaction from text",
      error: err.message
    })

  }
}

async function createTransactionFromImage(req, res){
  try{
    const {uid} = req.user 
    const {userText, sessionId, imageData} = req.body 

    if(!userText){
      return res.status(400).json({
        success: false,
        message: "userText is required"
      })
    }

    const fullText = `${userText || "No description"} from user with the userId of ${uid}`

    const payload = {
        app_name: AGENT_APP_NAME,
        streaming : false,
        user_id: uid,
        session_id: sessionId,
        new_message: {
            role: "user",
            parts: [{ text: fullText }, {
              inlineData : {
                mimeType: "image/png",
                data: imageData.base,
                displayName : imageData.name
              }
            }]
        }
    };

    console.log("Sending payload to AI Agent:", payload);

    const rawFetch = await fetch(`${AI_AGENT_URL}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const agentResponse = await rawFetch.json();

    if(!rawFetch.ok){
      console.log("AI Agent Request Failed:", agentResponse);
      return res.status(500).json({
        success: false,
        message: "AI agent request failed"
      })
    }


    console.log("AI Agent Response:", agentResponse);

    return res.status(200).json({
      agentResponse
    });
  }
  catch(err){
    console.log("Error in createTransactionFromImage:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create transaction from image",
      error: err.message
    })

  }
}

async function getTotalExpensesByPeriod(req, res) {
    const { uid } = req.user; 
    const { period } = req.params; // Expects 'today', 'week', or 'month'

    try {
        // getDateRange returns JavaScript Date objects in UTC, suitable for Firestore range queries.
                const { start, end } = getDateRange(period);
        // For debugging; mask user ID in production logs
        console.log(`Calculating total ${period} expenses for user ID: ${uid ? uid.substring(0, 4) + '****' : 'unknown'}`);
                console.log(`Calculating total ${period} expenses for user ID: ${uid}`);

        // 1. Query Firestore for the date range
        const snapshot = await db.collection('expenses')
            .where('userId', '==', uid) // Filter 1: By the user's ID
            .orderBy('date', 'desc')    // Order by 'date' first for range filters
            .where('date', '>=', start)  // Filter 2: Start of the range
            .where('date', '<=', end)    // Filter 3: End of the range
            .get();

        // 2. Aggregate the results
        let totalExpense = 0;
        
        if (!snapshot.empty) {
            // Iterate over all found documents and sum the 'amount' field
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                // Ensure 'amount' is treated as a number for aggregation
                if (typeof data.amount === 'number') {
                    totalExpense += data.amount;
                } else if (typeof data.amount === 'string') {
                    // Attempt to parse if stored as a string (not recommended, but safe)
                    totalExpense += parseFloat(data.amount) || 0;
                }
            });
        }

        // 3. Return the total sum
        return res.status(200).json({
            success: true,
            period: period,
            // Format the total to two decimal places and ensure it's a number (not string)
            total: parseFloat(totalExpense.toFixed(2)) 
        });

    } catch (err) {
        console.error(`Error calculating total ${period} expenses:`, err);
        return res.status(500).json({
            success: false,
            message: `Failed to calculate total ${period} expenses.`,
            error: err.message
        });
    }
}

async function getAnalysisForTransactions(req, res){
  try{
    const {uid} = req.user 
    const {userText, sessionId} = req.body 

    if(!userText){
      return res.status(400).json({
        success: false,
        message: "userText is required"
      })
    }

    const fullText = `analyze the transactions for user with the userId of ${uid} and provide insights. Here is the input: ${userText}`

    const payload = {
        app_name: AGENT_APP_NAME,
        user_id: uid,
        session_id: sessionId,
        new_message: {
            role: "user",
            parts: [{ text: fullText }]
        }
    };

    console.log("Sending payload to AI Agent:", payload);

    const rawFetch = await fetch(`${AI_AGENT_URL}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const agentResponse = await rawFetch.json();

    if(!rawFetch.ok){
      console.log("AI Agent Request Failed:", agentResponse);
      return res.status(500).json({
        success: false,
        message: "AI agent request failed"
      })
    }

    console.log("AI Agent Response:", agentResponse);

    return res.status(200).json({
      agentResponse
    });
  }
  catch(err){
    console.log("Error in analyze user transactions:", err);
    res.status(500).json({
      success: false,
      message: "Failed to analyze user transactions",
      error: err.message
    })

  }
}

module.exports = {getUsersTransactions, createTransactionFromText, createAISessionForUser, getTotalExpensesByPeriod, getAnalysisForTransactions, createTransactionFromImage}