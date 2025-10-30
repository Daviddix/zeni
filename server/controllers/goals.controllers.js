const { db } = require("../config/firebase");

async function getAllGoalsByUser(req, res) {
  try{
      const { uid } = req.user;
        if(!uid){   
            return res.status(400).json({ message: "User ID (uid) is required" });
        }

        const goalsRef = db.collection("goals").where("uid", "==", uid);
        const snapshot = await goalsRef.get();
        if (snapshot.empty) {
            return res.status(200).json({ goals : [] });
        }

        const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ goals });
    }catch(err){
        console.error("Error fetching goals:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }

}

module.exports = {
    getAllGoalsByUser
};