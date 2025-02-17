const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  auth0Id: { type: String, unique: true, sparse: true }, // Optional for Auth0 users
  isSocial: { type: Boolean, default: false }, // True for social logins
  createdAt: { type: Date, default: Date.now },
  image : {type : String},
  bio : {type : String},
});

// Hash password before saving for local users
UserSchema.pre("save", async function (next) {
  if (this.isSocial || !this.isModified("password")) return next(); // Skip for social users
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords during login
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    throw new Error("This user does not have a password.");
  }
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
