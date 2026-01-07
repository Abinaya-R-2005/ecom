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


// -------------------- CONFIG --------------------
const ADMIN_EMAIL = "admin@gmail.com";

// -------------------- MongoDB --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// -------------------- USER SCHEMA --------------------
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model("User", userSchema);

// -------------------- CATEGORY SCHEMA --------------------
const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true }
});

const Category = mongoose.model("Category", categorySchema);

// -------------------- PRODUCT SCHEMA --------------------
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  description: String,
  image: String
});

const Product = mongoose.model("Product", productSchema);

// -------------------- ORDER SCHEMA --------------------
const orderSchema = new mongoose.Schema({
  productName: String,
  productId: String,
  quantity: Number,
  price: Number,
  userEmail: String,
  userName: String,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

// -------------------- CART SCHEMA --------------------
const cartSchema = new mongoose.Schema({
  userEmail: String,
  productId: Number,
  name: String,
  price: Number,
  unitPrice: Number,
  img: String,
  qty: { type: Number, default: 1 }
});


const Cart = mongoose.model("Cart", cartSchema);

// -------------------- REVIEW SCHEMA --------------------
const reviewSchema = new mongoose.Schema({
  productId: Number,
  userEmail: String,
  userName: String,
  rating: { type: Number, required: true },
  comment: String,
  images: [String],
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", reviewSchema);



// -------------------- IMAGE UPLOAD CONFIG --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


// ==================== AUTH ====================

// ---------- SIGNUP ----------
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Email must end with @gmail.com" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- LOGIN ----------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 👑 Admin check by email only
    const isAdmin = email === ADMIN_EMAIL;

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/create-admin", async (req, res) => {
  try {
    const email = "admin@gmail.com";
    const password = "admin123";

    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: "Admin",
      email,
      password: hashedPassword
    });

    res.json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== ADMIN APIs ====================

// ---------- ADD CATEGORY ----------
app.post("/admin/category", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const category = await Category.create({ name });
    res.json({ message: "Category added", category });
  } catch (error) {
    res.status(500).json({ message: "Failed to add category" });
  }
});

// ---------- GET CATEGORIES ----------
app.get("/categories", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// ---------- ADD PRODUCT ----------
app.post("/admin/product", upload.single("image"), async (req, res) => {
  try {
    const { email, name, category, price, description } = req.body;

    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const product = await Product.create({
      name,
      category,
      price,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.json({ message: "Product added", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add product" });
  }
});


// ---------- GET PRODUCTS ----------
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ==================== ORDERS ====================

// ---------- PLACE ORDER ----------
app.post("/orders", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.json({ message: "Order placed", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order" });
  }
});

// ---------- ADMIN SALES FILTER ----------
app.get("/admin/sales", async (req, res) => {
  try {
    const { email, startDate, endDate } = req.query;

    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(filter);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sales" });
  }
});

// ==================== CART ====================

// ---------- GET CART ----------
app.get("/cart/:email", async (req, res) => {
  try {
    const cartItems = await Cart.find({ userEmail: req.params.email });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// ---------- ADD/UPDATE CART ITEM ----------
app.post("/cart", async (req, res) => {
  try {
    const { userEmail, productId, name, price, img, qty } = req.body;

    let cartItem = await Cart.findOne({ userEmail, productId });

    if (cartItem) {
      cartItem.qty += (qty || 1);
      cartItem.price = cartItem.unitPrice * cartItem.qty; // Update total price
      await cartItem.save();
    } else {
      // price in request is the unit price initially
      cartItem = await Cart.create({
        userEmail,
        productId,
        name,
        unitPrice: price,
        price: price * (qty || 1),
        img,
        qty: qty || 1
      });
    }

    res.json({ message: "Cart updated", cartItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart" });
  }
});


// ---------- UPDATE QTY ----------
app.post("/cart/update-qty", async (req, res) => {
  try {
    const { userEmail, productId, qty } = req.body;
    if (qty < 1) {
      await Cart.findOneAndDelete({ userEmail, productId });
      return res.json({ message: "Item removed from cart" });
    }

    let cartItem = await Cart.findOne({ userEmail, productId });
    if (!cartItem) return res.status(404).json({ message: "Item not found" });

    cartItem.qty = qty;
    cartItem.price = cartItem.unitPrice * qty; // Recalculate total price
    await cartItem.save();

    res.json({ message: "Quantity updated", cartItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity" });
  }
});


// ---------- REMOVE FROM CART ----------
app.delete("/cart/:email/:productId", async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userEmail: req.params.email, productId: req.params.productId });
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item" });
  }
});

// ---------- CLEAR CART ----------
app.delete("/cart/:email", async (req, res) => {
  try {
    await Cart.deleteMany({ userEmail: req.params.email });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

// ==================== REVIEWS ====================

// ---------- GET REVIEWS ----------
app.get("/reviews/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// ---------- SUBMIT REVIEW ----------
app.post("/reviews", upload.array("images", 5), async (req, res) => {
  try {
    const { productId, userEmail, userName, rating, comment } = req.body;

    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const review = await Review.create({
      productId: Number(productId),
      userEmail,
      userName,
      rating: Number(rating),
      comment,
      images: imageUrls
    });

    res.json({ message: "Review submitted", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

app.put("/admin/category/:id", async (req, res) => {
  const { email, name } = req.body;
  if (email !== ADMIN_EMAIL) return res.status(403).json({ message: "No access" });

  await Category.findByIdAndUpdate(req.params.id, { name });
  res.json({ message: "Updated" });
});

// DELETE CATEGORY
app.delete("/admin/category/:id", async (req, res) => {
  const { email } = req.body;
  if (email !== ADMIN_EMAIL) return res.status(403).json({ message: "No access" });

  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ==================== SERVER ====================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
