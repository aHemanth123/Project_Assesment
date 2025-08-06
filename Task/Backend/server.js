import express from "express";
import dotenv from "dotenv";
import connectToMongoDB from "./db/connect_to_mongodb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from 'path';

// Route imports
import authRoutes from "./Routes/authroutes.js";
import productRoutes from "./Routes/products.js"; // ✅ Make sure this path and filename are correct

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // ✅ No space after URL
  credentials: true,
}));

const PORT = process.env.PORT || 5000;

const __dirname=path.resolve();
app.use(express.json()); // To parse JSON request bodies
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes); // ✅ This now works



console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV==="production"){
  console.log("proffff")
  console.log(__dirname)
  app.use(express.static(path.join(__dirname,"../vite-project/dist")));
   app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../vite-project", "dist", "index.html"));
  });
}


app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on Port ${PORT}`);
});
