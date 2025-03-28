const express = require("express");
const Message = require("../models/message.js");

const router = express.Router();

// Fetch all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send a message (Now expects `username` from request body)
router.post("/", async (req, res) => {
  try {
    const { username, message } = req.body;
    if (!username || !message) {
      return res.status(400).json({ message: "Username and message are required" });
    }

    const newMessage = new Message({ username, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit a message
router.put("/:id", async (req, res) => {
  try {
    const { username, message } = req.body;
    if (!username || !message) {
      return res.status(400).json({ message: "Username and message are required" });
    }

    const existingMessage = await Message.findById(req.params.id);
    if (!existingMessage) return res.status(404).json({ message: "Message not found" });

    // Check if the username matches the original sender (Simple check without authentication)
    if (existingMessage.username !== username) {
      return res.status(403).json({ message: "Not authorized to edit this message" });
    }

    existingMessage.message = message;
    await existingMessage.save();
    res.json(existingMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a message
// router.delete("/:id", async (req, res) => {
//   try {
//     const { username } = req.body; // Require username to validate ownership
//     console.log(username);
//     if (!username) return res.status(400).json({ message: "Username is required" });

//     const message = await Message.findById(req.params.id);
//     if (!message) return res.status(404).json({ message: "Message not found" });

//     if (message.username !== username) {
//       return res.status(403).json({ message: "Not authorized to delete this message" });
//     }

//     await message.deleteOne();
//     res.json({ message: "Message deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// Delete a message
router.delete("/:id", async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    console.log(message);

    if (!message) return res.status(404).json({ message: "Message not found" });

    // Directly delete the message without checking anything
    await message.deleteOne();
    
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
