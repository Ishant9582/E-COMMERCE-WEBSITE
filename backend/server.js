const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Routes
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const messageRoutes = require('./routes/messageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
//This middleware is used to parse incoming JSON payloads. That means if a client sends JSON data in a request (usually in a POST or PUT request),
//  Express will automatically parse it and make it available on req.body.
app.use(express.urlencoded({ extended: true }));
//This middleware is used to parse incoming requests with URL-encoded payloads. This is commonly used when forms are submitted in HTML.
//  It will parse the data and make it available on req.body.
// here it is used for parsing incoming requests with URL-encoded payloads
app.use("/uploads", express.static("uploads"));
//This sets up a static file server. It tells Express: "If someone requests a file under /uploads, serve it from the local uploads folder."


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }) 
    // These options are used to configure the connection to MongoDB.
  // useNewUrlParser: This ensures that the new MongoDB connection string parser is used.
  // useUnifiedTopology: This enables the new unified topology layer in the MongoDB driver, which provides better server discovery and monitoring.
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/', paymentRoutes);

// Socket.io Setup for Real-time Chat
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', (messageData) => {
    io.emit('receiveMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Socket.io Setup for Real-time Order Updates
// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
