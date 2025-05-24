const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { 
    type: String, // Store as formatted string
    default: () => {
      const now = new Date();
      const pad = n => n < 10 ? '0' + n : n;
      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1);
      const day = pad(now.getDate());
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } // Format: YYYY-MM-DD HH:mm:ss
  }
});

module.exports = mongoose.model('Message', messageSchema);
