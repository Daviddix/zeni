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

async function createTransactionFromText(req, res){
  try{
    const {uid} = req.user 
    const {userText} = req.body 

    //send text to AI agent 
    //AI agent parses text and returns structured output
    //OR
    //output is put in DB by AI agent via tool calling 
  }
  catch(err){

  }
}

module.exports = {getAllTransactionsMadeByUser, createTransactionFromText}