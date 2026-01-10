const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  // 1. Check karna: Kya Header me "Bearer" token hai?
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Token nikalna (Bearer hatake sirf code lena)
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify karna (Kya ye token asli hai?)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. User dhoondna (Password ko chod ke baki data lena)
      req.user = await User.findById(decoded.id).select("-password");

      // 5. Sab sahi hai, aage jane do
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // 6. Agar token hi nahi tha
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };