
import User from "../Model/user_model.js";
import generateTokenandSetCookie from "../utils/jsonwebtoken.js";
import bcrypt from "bcryptjs";

// SIGNUP Controller
export const signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Check if user or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Set JWT cookie
    generateTokenandSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// LOGIN Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Set JWT cookie
    generateTokenandSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// LOGOUT Controller
// export const logout = (req, res) => {
//   try {
//     res.cookie("jwt", "", {
//       maxAge: 0,
//       httpOnly: true,
//       sameSite: "strict",
//     });
//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     console.error("Error in logout:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// Logout Controller
export const logout = (req, res) => {
  try {
    // Clear the token cookie by setting it to an empty string and expiry to past
    res.cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
