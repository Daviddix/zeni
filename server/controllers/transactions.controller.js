const AI_AGENT_URL = process.env.AI_AGENT_URL || "http://localhost:8000";
const AGENT_APP_NAME = 'zeni_agent'; // Use the directory name or app name ADK uses

async function getAllTransactionsMadeByUser(req, res) {
  try {
    const { uid } = req.user; // from verifySession middleware

    //get the particular user based on uid then get all the transactions made by that user. The transactions are stored as an array in a field called 'transactions' inside each user document.
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();
    const transactions = userData.transactions || [];

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (err) {
    console.error("Error getting user info:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user info",
      error: err.message,
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

module.exports = {getAllTransactionsMadeByUser, createTransactionFromText, createAISessionForUser}