// server.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= CONFIG ================= */
const ADMIN_EMAIL = "admin@gmail.com";

/* ================= MONGODB ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ================= SCHEMAS ================= */

// USER
const addressSchema = new mongoose.Schema({
  label: String,
  address: String,
  isDefault: Boolean
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  addresses: [addressSchema]
});
const User = mongoose.model("User", userSchema);

// CATEGORY
const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true }
});
const Category = mongoose.model("Category", categorySchema);

// PRODUCT
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  description: String,
  image: String,
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 }
});
const Product = mongoose.model("Product", productSchema);

// ORDER
const orderSchema = new mongoose.Schema({
  productName: String,
  productId: String,
  quantity: Number,
  price: Number,
  userEmail: String,
  userName: String,
  status: { type: String, default: "Ordered" },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);

// CART
const cartSchema = new mongoose.Schema({
  userEmail: String,
  productId: String,
  name: String,
  unitPrice: Number,
  price: Number,
  img: String,
  qty: { type: Number, default: 1 }
});
const Cart = mongoose.model("Cart", cartSchema);

// WISHLIST
const wishlistSchema = new mongoose.Schema({
  userEmail: String,
  productId: String,
  name: String,
  price: Number,
  image: String
});
const Wishlist = mongoose.model("Wishlist", wishlistSchema);

// REVIEW
const reviewSchema = new mongoose.Schema({
  productId: String,
  userEmail: String,
  userName: String,
  rating: Number,
  comment: String,
  images: [String],
  createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.model("Review", reviewSchema);

/* ================= IMAGE UPLOAD ================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

/* ================= AUTH ================= */

// SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed });
  res.json({ message: "Signup successful" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid login" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid login" });

  res.json({
    user: {
      name: user.name,
      email: user.email,
      isAdmin: email === ADMIN_EMAIL
    }
  });
});

/* ================= USER PROFILE ================= */
app.get("/user/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email }).select("-password");
  res.json(user);
});

/* ================= ADMIN APIs ================= */

// ADMIN – CATEGORY
app.post("/admin/category", async (req, res) => {
  if (req.body.email !== ADMIN_EMAIL) return res.sendStatus(403);
  const category = await Category.create({ name: req.body.name });
  res.json(category);
});

app.get("/admin/categories", async (req, res) => {
  res.json(await Category.find());
});

app.put("/admin/category/:id", async (req, res) => {
  if (req.body.email !== ADMIN_EMAIL) return res.sendStatus(403);
  await Category.findByIdAndUpdate(req.params.id, { name: req.body.name });
  res.json({ message: "Updated" });
});

app.delete("/admin/category/:id", async (req, res) => {
  if (req.body.email !== ADMIN_EMAIL) return res.sendStatus(403);
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ADMIN – PRODUCT
app.post("/admin/product", upload.single("image"), async (req, res) => {
  if (req.body.email !== ADMIN_EMAIL) return res.sendStatus(403);

  const product = await Product.create({
    ...req.body,
    image: req.file ? `/uploads/${req.file.filename}` : ""
  });

  res.json(product);
});

app.delete("/admin/product/:id", async (req, res) => {
  if (req.body.email !== ADMIN_EMAIL) return res.sendStatus(403);
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

// ADMIN – ORDERS
app.get("/admin/orders", async (req, res) => {
  if (req.query.email !== ADMIN_EMAIL) return res.sendStatus(403);
  res.json(await Order.find().sort({ createdAt: -1 }));
});

app.put("/admin/orders/:id", async (req, res) => {
  if (req.body.email !== ADMIN_EMAIL) return res.sendStatus(403);
  await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.json({ message: "Status updated" });
});

// ADMIN – SALES
app.get("/admin/sales", async (req, res) => {
  if (req.query.email !== ADMIN_EMAIL) return res.sendStatus(403);
  res.json(await Order.find());
});

/* ================= USER APIs ================= */

// PRODUCTS
app.get("/products", async (req, res) => res.json(await Product.find()));
app.get("/products/:id", async (req, res) => res.json(await Product.findById(req.params.id)));

// ORDERS
app.post("/orders", async (req, res) => {
  const order = await Order.create(req.body);
  res.json(order);
});
app.get("/orders/:email", async (req, res) =>
  res.json(await Order.find({ userEmail: req.params.email }))
);

// CART
app.get("/cart/:email", async (req, res) =>
  res.json(await Cart.find({ userEmail: req.params.email }))
);
app.post("/cart", async (req, res) => {
  const item = await Cart.create(req.body);
  res.json(item);
});

// WISHLIST
app.get("/wishlist/:email", async (req, res) =>
  res.json(await Wishlist.find({ userEmail: req.params.email }))
);
app.post("/wishlist", async (req, res) =>
  res.json(await Wishlist.create(req.body))
);
app.delete("/wishlist/:email/:productId", async (req, res) => {
  await Wishlist.findOneAndDelete(req.params);
  res.json({ message: "Removed" });
});

// REVIEWS
app.post("/reviews", upload.none(), async (req, res) => {
  try {
    const { productId, userEmail, userName, rating, comment } = req.body;

    // 1. Create Review
    const review = await Review.create({
      productId,
      userEmail,
      userName,
      rating: Number(rating),
      comment
    });

    // 2. Update Product Stats
    const product = await Product.findById(productId);
    if (product) {
      const currentRating = product.averageRating || 0;
      const currentCount = product.ratingCount || 0;

      const newCount = currentCount + 1;
      const newAvg = ((currentRating * currentCount) + Number(rating)) / newCount;

      product.ratingCount = newCount;
      product.averageRating = newAvg;
      await product.save();
    }

    res.json(review);
  } catch (err) {
    console.error("Review Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ---------- CHANGE PASSWORD ----------
app.put("/change-password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


/* ================= SERVER ================= */
app.listen(5000, () => console.log("Server running on port 5000"));
