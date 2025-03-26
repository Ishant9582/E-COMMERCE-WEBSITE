import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const Chat = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessage, setEditedMessage] = useState('');

  // Load existing messages and listen for new ones
  useEffect(() => {
    socket.on('load_messages', (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('message_updated', ({ id, newMessage }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, message: newMessage } : msg))
      );
    });

    socket.on('message_deleted', (id) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    });

    return () => {
      socket.off('load_messages');
      socket.off('receive_message');
      socket.off('message_updated');
      socket.off('message_deleted');
    };
  }, []);

  // Send a new message
  const sendMessage = () => {
    if (message && username) {
      const messageData = {
        username,
        message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('send_message', messageData);
      setMessage('');
    }
  };

  // Start editing a message
  const startEditing = (id, currentMessage) => {
    setEditingMessageId(id);
    setEditedMessage(currentMessage);
  };

  // Save edited message
  const saveEditedMessage = (id) => {
    if (editedMessage.trim()) {
      socket.emit('update_message', { id, newMessage: editedMessage });
      setEditingMessageId(null);
      setEditedMessage('');
    }
  };

  // Delete a message
  const deleteMessage = (id) => {
    socket.emit('delete_message', id);
  };
  console.log(messages) ;
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">💬 Real-Time Chat App</h1>

      {/* Username Input */}
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 border rounded mb-4 w-64"
      />

      {/* Message Input */}
      <div className="flex">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 border rounded-l w-64"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-500 text-white rounded-r"
        >
          Send
        </button>
      </div>

      {/* Chat Messages */}
      <div className="mt-6 w-80 h-64 bg-white border rounded overflow-y-auto p-2">
        {messages.map((msg) => (
          <div key={msg._id} className="mb-2 flex justify-between items-center">
            {editingMessageId === msg._id ? (
              <>
                <input
                  type="text"
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  className="border p-1 rounded mr-2"
                />
                <button
                  onClick={() => saveEditedMessage(msg.id)}
                  className="bg-green-500 text-white px-2 rounded"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <div>
                  {/* {console.log(msg)}
                  {console.log(msg._id)} */}
                  <strong>{msg.username}</strong> [{msg.time}]: {msg.message}
                </div>
                {msg.username === username && (
                  <div className="ml-2">
                    <button
                      onClick={() => startEditing(msg._id, msg.message)}
                      className="text-yellow-500 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
