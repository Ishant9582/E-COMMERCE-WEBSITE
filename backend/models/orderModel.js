const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { 
    type: String, 
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
  },
});

module.exports = mongoose.model('Order', orderSchema);
