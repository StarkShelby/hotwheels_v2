const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const User = require("./models/user"); // Import User model
const Car = require("./models/carSchema"); // Import Car model
const MongoStore = require("connect-mongo");
require("dotenv").config(); // Load environment variables

const app = express();

// ✅ Middleware
app.use(express.json()); // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// ✅ Configure CORS for Deployment

// ✅ Allow both local & deployed frontend
const allowedOrigins = [
  "http://127.0.0.1:5500", // Localhost for testing
  "https://your-hotwheels-site.vercel.app", // Deployed frontend
];

app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Change to frontend URL
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "http://127.0.0.1:5500"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ✅ Session Setup with MongoDB Atlas
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // Using MongoDB Atlas
      collectionName: "sessions",
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1-day session
  })
);

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/debug-session", (req, res) => {
  console.log("Session Data:", req.session);
  res.json(req.session);
});

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      collection: [],
      wishlist: [],
    });

    await newUser.save();
    req.session.user = newUser; // Save user in session

    res.json({ message: "Signup successful!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Login Attempt: ", email, password); // Debug log

    const user = await User.findOne({ email });
    console.log("🛠 Found User:", user); // Debug log

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Password Match:", isMatch); // Debug log

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    req.session.user = user;
    res.json({ message: "Login successful!", user });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Logout Route
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully!" });
  });
});

// ✅ Check if user is logged in
app.get("/user-data", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    const user = await User.findById(req.session.user._id).populate(
      "collection wishlist"
    );
    res.json({ collection: user.collection, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Add Car to Collection
app.post("/add-to-collection/:id", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const carId = req.params.id;
    if (!user.collection.includes(carId)) {
      user.collection.push(carId);
      await user.save();
    }

    res.json({
      message: "Car added to collection!",
      collection: user.collection,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Add Car to Wishlist
app.post("/add-to-wishlist/:id", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const carId = req.params.id;
    if (!user.wishlist.includes(carId)) {
      user.wishlist.push(carId);
      await user.save();
    }

    res.json({ message: "Car added to wishlist!", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get User's Collection
app.get("/collection", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    const user = await User.findById(req.session.user._id).populate(
      "collection"
    ); // Populate the `collection` field with car data
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ collection: user.collection });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Serve Homepage (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Serve Static Files (Cars Data)
app.get("/cars", (req, res) => {
  res.sendFile(path.join(__dirname, "data/cars.json"));
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
