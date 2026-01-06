const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- MongoDB --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// -------------------- User Schema --------------------
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model("User", userSchema);

// -------------------- Order Schema --------------------
const orderSchema = new mongoose.Schema({
  productName: String,
  productId: Number,
  size: String,
  quantity: Number,
  price: Number,
  userEmail: String,
  userName: String,
  timestamp: { type: Date, default: Date.now }
});

const Cart = mongoose.model("Cart", orderSchema, "cart");


// -------------------- SIGNUP --------------------
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔐 Validations
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

// -------------------- LOGIN --------------------
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

    // ✅ NO JWT
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- ORDERS --------------------
app.post("/orders", async (req, res) => {
  try {
    const { productName, productId, size, quantity, price, userEmail, userName } = req.body;

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    const newOrder = await Cart.create({
      productName,
      productId,
      size,
      quantity,
      price,
      userEmail,
      userName
    });

    res.json({ message: "Order placed successfully", order: newOrder });

  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
});



// -------------------- SERVER --------------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
