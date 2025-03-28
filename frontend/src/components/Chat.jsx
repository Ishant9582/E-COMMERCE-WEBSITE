import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";

const socket = io("http://localhost:3000");

const Chat = () => {
  const user = useSelector((state) => state.auth.user);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/messages")
      .then((res) => {
        setMessages(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        setMessages([]);
      });

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || !user?.username) return;

    try {
      const newMessage = { username: user.username, message };

      const res = await axios.post(
        "http://localhost:3000/api/messages",
        newMessage,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      socket.emit("sendMessage", res.data);
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const editMessage = async (id, newText) => {
    try {
      console.log(id) ;
      console.log(newText) ;
      await axios.put(
        `http://localhost:3000/api/messages/${id}`,
        { username: user.username, message: newText },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, message: newText } : msg))
      );
    } catch (err) {
      console.error("Error editing message:", err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/messages/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto bg-gray-100 shadow-lg rounded-lg p-4 h-[80vh]">
      <div className="text-xl font-semibold text-center text-white bg-blue-500 py-2 rounded-lg">
        Chat Room
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-white rounded-lg mt-2">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.username === user.username ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg text-white max-w-xs break-words ${
                  msg.username === user.username ? "bg-blue-500" : "bg-gray-400"
                }`}
              >
                <b>{msg.username}:</b> {msg.message}
                {msg.username === user.username && (
                  <div className="flex justify-end space-x-2 mt-1">
                    <button
                      onClick={() => {
                        const newText = prompt("New Message", msg.message);
                        if (newText) editMessage(msg._id, newText);
                      }}
                      className="text-sm text-white bg-green-500 px-2 py-1 rounded hover:bg-green-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="text-sm text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex mt-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
