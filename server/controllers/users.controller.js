const {db} = require("../config/firebase");
const { uploadImageToCloudinaryAndReturnUrl } = require("../utils/users.utils");

async function finishOnboardingProcess(req, res) {
  try {
    const { fullname, image } = req.body;
    const { uid } = req.user;

    if (!uid) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No UID provided in user object'
      });
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const imageUrl = await uploadImageToCloudinaryAndReturnUrl(image);

    await userRef.update({
      fullname,
      image: imageUrl
    });

    res.status(200).json({
      success: true,
      message: 'Onboarding process completed successfully'
    });

  } catch (error) {
    console.error('Error finishing onboarding process:', error);
    res.status(500).json({
      success: false,
      message: 'Error finishing onboarding process',
      error: error.message
    });
  }
}

async function updateUserCurrency(req, res){
  try{
    const { currency } = req.body;
    const { uid } = req.user;

    if (!uid) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No UID provided in user object'
      });
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await userRef.update({
      currency
    });

    res.status(200).json({
      success: true,
      message: 'User currency updated successfully'
    });

  } catch(err){
    console.error('Error updating user currency:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating user currency',
      error: err.message
    });
  }
}

async function getUserInfo(req, res) {
  try {
    const { uid } = req.user; // from verifySession middleware

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();

    res.status(200).json({
      success: true,
      user: userData,
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

async function logUserOut(req, res){
  try{
    
  }
  catch(err){

  }
}


module.exports = {
  finishOnboardingProcess,
  updateUserCurrency,
  getUserInfo
};