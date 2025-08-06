// import jwt from 'jsonwebtoken';

// const authMiddleware = (req, res, next) => {
//   const token = req.headers["authorization"];
//   if (!token) return res.status(401).json({ message: "Token missing" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     req.user = decoded; // Attach user info to request
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// export default authMiddleware;

// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   console.log("in middleware.............")
//   const token = req.cookies.jwt;

//   if (!token) {
//     console.log("tokem missing....")
//     return res.status(401).json({ message: "Token missing from cookies" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     console.log("Decoded JWT payload:", decoded); // 👈 This line prints the decoded token
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// export default authMiddleware;
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
 console.log("in middleware.............");
  console.log("Cookies:", req.cookies); // Check what cookies you received
 const token = req.cookies.token;  // ✅ Read from cookie, not header

  if (!token) {
      console.log("in middleware.............")

    return res.status(401).json({ message: "Token missing" });
  }
 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Attach user info to request
    console.log("Decoded JWT:", decoded,req.user); // ✅ Print decoded data
    console.log("authj success")
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
