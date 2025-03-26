const Message = require('../models/message');

const loadMessages = async (socket) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    socket.emit('load_messages', messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
  }
};

const sendMessage = async (io, data) => {
  try {
    const newMessage = new Message({
      username: data.username,
      message: data.message,
    });

    const savedMessage = await newMessage.save();
    io.emit('receive_message', savedMessage); // Broadcast to all clients
  } catch (err) {
    console.error('Error saving message:', err);
  }
};

const updateMessage = async (io, data) => {
  const { id, newMessage } = data;
  try {
    const updatedMsg = await Message.findByIdAndUpdate(
      id,
      { message: newMessage },
      { new: true }
    );

    if (updatedMsg) {
      io.emit('message_updated', updatedMsg);
    } else {
      console.log('Message not found for update');
    }
  } catch (err) {
    console.error('Error updating message:', err);
  }
};

const deleteMessage = async (io, id) => {
  try {
    const deletedMsg = await Message.findByIdAndDelete(id);
    if (deletedMsg) {
      io.emit('message_deleted', id);
    } else {
      console.log('Message not found for deletion');
    }
  } catch (err) {
    console.error('Error deleting message:', err);
  }
};

module.exports = { loadMessages, sendMessage, updateMessage, deleteMessage };
