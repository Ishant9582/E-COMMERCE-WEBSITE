const express = require("express");
const multer = require("multer");
const cors = require("cors"); // Allow frontend requests
const path = require("path");

const app = express();
app.use(cors()); // Enable CORS

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });
module.exports = upload;


