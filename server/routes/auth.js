const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password validity
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h", // Use environment variable if available
    });

    // Return token and user info
    res.status(200).json({
      token,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err); // Log error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("username"); // Exclude the password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }else{
      user.bio = req.body.bio;
      user.image = req.body.image;
      await user.save();
      res.status(200).json({ message: "User updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }


})



// Verify JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

router.post("/google-login", async (req, res) => {
  try {
    const { email, username , auth0Id } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not found
      user = new User({
        email,
        username,
        auth0Id,
        isSocial: true,
      });

      await user.save();
    }

    res.status(200).json({ message: "User logged in successfully." , user: {
      id: user._id,
      username: user.username,
      email: user.email,
    } });
  } catch (error) {
    console.error("Error handling Google login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// Protected Route Example
router.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "You have access to this protected route." });
});

module.exports = router;
