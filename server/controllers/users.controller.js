const {auth, db} = require("../config/firebase");
const timeBeforeItExpires = 10 * 60 * 1000; // 10 minutes in milliseconds
const { uploadImageToCloudinaryAndReturnUrl } = require("../utils/users.utils");


async function signUserUp(req, res) {
  try {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "Email and password are required"});
    }

    const emailIsTaken = await db.collection("users").where("email", "==", email).limit(1).get();

    if(!emailIsTaken.empty){
        return res.status(409).json({message: "Email is already taken"});
    }

    const newUser = await auth.createUser({
        email,
        password
    })

    await db.collection('users').doc(newUser.uid).set({
      email,
      createdAt: new Date().toISOString(),
      uid: newUser.uid,
    });

    res.cookie("uid", newUser.uid, {
      httpOnly: true,
      maxAge: timeBeforeItExpires,
      path: "/",
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Lax for local dev
    });

    res.status(201).json({ 
      success: true,
      message: 'User created successfully', 
      uid: newUser.uid,
      email
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ 
        success: false,
        message: 'The email address is already in use by another account.' 
      });
    }
    if (error.code === 'auth/invalid-password') {
      return res.status(400).json({ 
        success: false,
        message: 'Password should be at least 6 characters.' 
      });
    }
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email address.' 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Error creating user', 
      error: error.message 
    });
  }
}

async function finishOnboardingProcess(req, res) {
  try {
    const { fullname, image } = req.body;
    const { uid } = req.cookies;

    console.log(req.cookies)

    if (!uid) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No UID provided in cookies'
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
    const { uid } = req.cookies;

    if (!uid) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No UID provided in cookies'
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

module.exports = {
  signUserUp,
  finishOnboardingProcess,
  updateUserCurrency
};