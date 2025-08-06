// import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
// import Product from "../Model/product_model.js";

// const router = express.Router();

// // GET: Get products with filtering and pagination
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const { category, shipped, page = 1, limit = 10 } = req.query;
//     const query = {};

//     if (category) query.category = new RegExp(`^${category}$`, 'i');
//     if (shipped !== undefined) query.shipped = shipped === 'true';

//     const total = await Product.countDocuments(query);
//     const products = await Product.find(query)
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     res.json({
//       total,
//       page: Number(page),
//       limit: Number(limit),
//       products,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // POST: Add a new product
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { name, category, shipped } = req.body;
//     const newProduct = new Product({ name, category, shipped });
//     await newProduct.save();
//     res.status(201).json(newProduct);
//   } catch (err) {
//     res.status(400).json({ error: "Invalid data" });
//   }
// });

// // PUT: Update product by ID
// router.put("/:id", authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json(updatedProduct);
//   } catch (err) {
//     res.status(400).json({ error: "Invalid update" });
//   }
// });

// // DELETE: Delete product by ID
// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Product.findByIdAndDelete(id);

//     if (!deleted) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json({ message: "Product deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // export default router;
// import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
// import Product from "../Model/product_model.js";

// const router = express.Router();

// // GET: Get products created by the logged-in user
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const { category, shipped, page = 1, limit = 10 } = req.query;
//     const userId = req.user._id; // Or req.userId depending on your middleware
//     console.log("Creating product for user:", userId); // ✅ Log user ID
//     const query = { createdBy: req.user._id }; // 👈 only user's products



//     if (category) query.category = new RegExp(`^${category}$`, "i");
//     if (shipped !== undefined) query.shipped = shipped === "true";

//     const total = await Product.countDocuments(query);
//     const products = await Product.find(query)
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     res.json({
//       total,
//       page: Number(page),
//       limit: Number(limit),
//       products,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });


// // POST: Add a new product
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { name, category, shipped } = req.body;

//     // Check if required fields are present
//     if (!name || !category || typeof shipped !== "boolean") {
//       return res.status(400).json({ error: "Missing or invalid fields" });
//     }
//     console.log("user id : ",req.user)

//     // ✅ Attach user from authMiddleware
//     const newProduct = new Product({
//       name,
//       category,
//       shipped,
//       user: req.user._id, // 🔥 Make sure this is set
//     });

//     await newProduct.save();

//     res.status(201).json(newProduct);
//   } catch (err) {
//     console.error("Error creating product:", err);
//     res.status(400).json({ error: "Invalid data or missing fields" });
//   }
// });


// // PUT: Update a product owned by the user
// router.put("/:id", authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updatedProduct = await Product.findOneAndUpdate(
//       { _id: id, createdBy: req.user._id }, // 👈 ensure ownership
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json(updatedProduct);
//   } catch (err) {
//     res.status(400).json({ error: "Invalid update" });
//   }
// });

// // DELETE: Remove a product owned by the user
// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleted = await Product.findOneAndDelete({
//       _id: id,
//       createdBy: req.user._id, // 👈 ensure ownership
//     });

//     if (!deleted) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json({ message: "Product deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Product from "../Model/product_model.js";

const router = express.Router();

// ✅ GET: Get products created by the logged-in user
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const { category, shipped, page = 1, limit = 10 } = req.query;
//     const userId = req.user.userID; // ⬅️ Use userID from token

//     const query = { createdBy: userId }; // ⬅️ match createdBy

//     if (category) query.category = new RegExp(`^${category}$`, "i");
//     if (shipped !== undefined) query.shipped = shipped === "true";

//     const total = await Product.countDocuments(query);
//     const products = await Product.find(query)
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     res.json({
//       total,
//       page: Number(page),
//       limit: Number(limit),
//       products,
//     });
//   } catch (err) {
//     console.error("GET error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const { category, shipped, page = 1, limit = 10 } = req.query;
//     const userId = req.user.userID; // ✅ Consistent with token payload

//     console.log("Fetching products for user:", userId);

//     const query = { createdBy: userId };

//     if (category) query.category = new RegExp(`^${category}$`, "i");
//     if (shipped !== undefined) query.shipped = shipped === "true";

//     const total = await Product.countDocuments(query);

//     const products = await Product.find(query)
//       .sort({ createdAt: -1 }) // ✅ Optional: latest first
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     res.json({
//       total,
//       page: Number(page),
//       limit: Number(limit),
//       products,
//     });
//   } catch (err) {
//     console.error("GET /products error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { category, shipped } = req.query;
    const userId = req.user.userID;

    console.log("Fetching products for user:", userId);

    const query = { createdBy: userId };

    if (category) query.category = new RegExp(`^${category}$`, "i");
    if (shipped !== undefined) query.shipped = shipped === "true";

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json({ products });
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// ✅ POST: Add a new product
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, category, shipped } = req.body;

    if (!name || !category || typeof shipped !== "boolean") {
      return res.status(400).json({ error: "Missing or invalid fields" });
    }

    const newProduct = new Product({
      name,
      category,
      shipped,
      createdBy: req.user.userID, // ✅ Correct field
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(400).json({ error: "Invalid data or missing fields" });
  }
});

// ✅ PUT: Update a product (only if owned by user)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, createdBy: req.user.userID }, // ✅ ownership check
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("Update error:", err);
    res.status(400).json({ error: "Invalid update" });
  }
});

// ✅ DELETE: Remove a product (only if owned by user)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findOneAndDelete({
      _id: id,
      createdBy: req.user.userID, // ✅ ownership check
    });

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
