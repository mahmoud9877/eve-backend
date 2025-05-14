import { v4 as uuidv4 } from "uuid";

export const assignGuestSession = (req, res, next) => {
  // Check if the session ID exists in cookies
  let sessionId = req.cookies.sessionId;

  // If not, generate a new session ID for the guest user
  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expires in 30 days
    });
  }

  req.sessionId = sessionId;
  next();
};
