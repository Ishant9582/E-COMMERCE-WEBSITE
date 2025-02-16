const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body) ;
  if (!username || !password) return res.status(400).json({ message: 'All fields are required' });

  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    const user = await User.create({ username, password });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie("auth",token,{
      httpOnly:true,
      sameSite:true,
      maxAge: 24*60*59*1000,
    }).status(200).json({ token , user});

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



exports.logoutUser = async (req, res) => {
  res.clearCookie('auth');
  res.status(200).json({ message: 'Logout successfully' });
}