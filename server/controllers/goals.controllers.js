const { db } = require("../config/firebase");
const AI_AGENT_URL = process.env.AI_AGENT_URL || "http://localhost:8000";
const AGENT_APP_NAME = 'agent'; // Use the directory name or app name ADK uses

async function getAllGoalsByUser(req, res) {
  try{
      const { uid } = req.user;
        if(!uid){   
            return res.status(400).json({ message: "User ID (uid) is required" });
        }

        const goalsRef = db.collection("goals").where("userId", "==", uid);
        const snapshot = await goalsRef.get();
        if (snapshot.empty) {
            return res.status(200).json({ goals: [] });
    }

        const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ goals });
    }catch(err){
        console.error("Error fetching goals:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
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

async function addGoalToFirestore(req, res){
  try{
    const {uid} = req.user 
    const {userText, sessionId} = req.body 

    if(!userText){
      return res.status(400).json({
        success: false,
        message: "userText is required"
      })
    }

    const fullText = ` user with the userId of ${uid} has described a goal for you : ${userText}`

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
    console.log("Error in addGoalToFirestore:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create goal from text",
      error: err.message
    })

  }
}

async function getAnalysisForGoal(req, res){
  try{
    const {uid} = req.user 
    const {userText, sessionId} = req.body 

    if(!userText){
      return res.status(400).json({
        success: false,
        message: "userText is required"
      })
    }

    const fullText = `analyze the goal with the id of ${userText} and return an analysis for it from user with the userId of ${uid}. This should be passed to the single_goal_analysis_pipeline`

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
    console.log("Error in analyze user goal:", err);
    res.status(500).json({
      success: false,
      message: "Failed to analyze user goal",
      error: err.message
    })

  }
}

async function deleteGoal(req, res){
  try{
    const {goalId} = req.params;

    if(!goalId){
      return res.status(400).json({
        success: false,
        message: "goalId is required"
      })
    }

    // Delete the goal from Firestore
    const goalRef = db.collection("goals").doc(goalId);
    await goalRef.delete();

    return res.status(200).json({
      success: true,
      message: "Goal deleted successfully"
    });
  }catch(err){
    console.log("Error in deleteGoal:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete goal",
      error: err.message
    });
  }
}


module.exports = {
    getAllGoalsByUser,
    addGoalToFirestore,
    createAISessionForUser,
    getAnalysisForGoal,
    deleteGoal
};