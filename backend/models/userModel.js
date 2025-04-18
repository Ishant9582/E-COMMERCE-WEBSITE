const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: null }, // Role field with default null
});

// Hash password before saving
  // This is a Mongoose middleware that runs before a document is saved to the database.
// The 'pre' method is used to define a pre-save hook for the 'save' operation.
userSchema.pre('save', async function (next) {
 // Check if the 'password' field has been modified.
  // If it hasn't been modified, skip the rest of the middleware and proceed to the next middleware or save operation.
  if (!this.isModified('password')) return next();
  // If the 'password' field has been modified, hash the password using bcrypt.
  // The 'bcrypt.hash' function takes the plain text password and a salt round (10 in this case) to generate a secure hash.
  this.password = await bcrypt.hash(this.password, 10);
   // Call the 'next' function to indicate that the middleware is done and the save operation can proceed.
  next();
});

module.exports = mongoose.model('User', userSchema);
