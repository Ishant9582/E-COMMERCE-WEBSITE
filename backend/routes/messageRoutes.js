const {
    loadMessages,
    sendMessage,
    updateMessage,
    deleteMessage,
  } = require('../controllers/messageController');
  
  const messageRoutes = (io) => {
    io.on('connection', async (socket) => {
      console.log(`User connected: ${socket.id}`);
  
      await loadMessages(socket);
  
      socket.on('send_message', (data) => sendMessage(io, data));
      socket.on('update_message', (data) => updateMessage(io, data));
      socket.on('delete_message', (id) => deleteMessage(io, id));
  
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  };
  
  module.exports = messageRoutes;
  