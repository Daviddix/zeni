// middlewares/verifySession.js
const { auth } = require("../config/firebase");

async function verifySession(req, res, next) {
  try {
    const sessionCookie = req.cookies.session || "";
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    req.user = decodedClaims;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = verifySession;
