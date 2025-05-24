import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";

const socket = io("http://localhost:3000");

// Emoji object
const EMOJIS = {
  smile: "😊",
  heart: "❤️",
  thumbsUp: "👍",
  laugh: "😂",
  wink: "😉",
  cry: "😢",
  clap: "👏",
  fire: "🔥",
  star: "⭐",
  party: "🥳",
};

const Chat = () => {
  const user = useSelector((state) => state.auth.user);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showMenuId, setShowMenuId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/messages")
      .then((res) => setMessages(Array.isArray(res.data) ? res.data : []))
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
      const newMessage = {
        username: user.username,
        message,
        createdAt: new Date().toISOString(),
      };
      const res = await axios.post("http://localhost:3000/api/messages", newMessage, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      socket.emit("sendMessage", {
        ...res.data,
        createdAt: res.data.createdAt || newMessage.createdAt,
      });
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const editMessage = async (id, newText) => {
    try {
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
      setShowMenuId(null);
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
      setShowMenuId(null);
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const formatTime = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    return isNaN(date.getTime()) ? "" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Insert emoji at cursor position
  const handleEmojiClick = (emoji) => {
    const input = document.getElementById("chat-input");
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const newMessage =
      message.substring(0, start) + emoji + message.substring(end, message.length);
    setMessage(newMessage);
    setShowEmojiPicker(false);
    setTimeout(() => {
      input.focus();
      input.selectionStart = input.selectionEnd = start + emoji.length;
    }, 0);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="flex flex-col w-full max-w-3xl h-[75vh] bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header (Fixed) */}
        <div className="bg-blue-600 text-white text-xl font-semibold p-4 flex items-center justify-between sticky top-0 z-10">
          <span>💬 Chat Room</span>
          <span className="text-sm font-normal opacity-80">Logged in as: {user?.username}</span>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-blue-300 bg-white">
          {messages.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">No messages yet. Start the conversation! 😊</p>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.username === user.username;
              return (
                <div key={msg._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  {isOwn && (
                    <div className="relative">
                      <button
                        onClick={() => setShowMenuId(showMenuId === msg._id ? null : msg._id)}
                        className="text-gray-400 hover:text-gray-600 mr-2 focus:outline-none"
                      >
                        ⋮
                      </button>
                      {showMenuId === msg._id && (
                        <div className="absolute right-6 top-0 bg-white border rounded-md shadow-md z-20 w-28">
                          <button
                            onClick={() => {
                              const newText = prompt("Edit message:", msg.message);
                              if (newText) editMessage(msg._id, newText);
                            }}
                            className="block w-full text-left px-3 py-2 hover:bg-green-100"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deleteMessage(msg._id)}
                            className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-100"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-xl max-w-xs break-words shadow-md ${
                      isOwn ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <div className="text-sm font-semibold mb-1">{msg.username}</div>
                    <div className="text-base">{msg.message}</div>
                    <div className="text-xs text-gray-300 mt-1 text-right">
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input Area */}
        <div className="p-3 border-t bg-white flex gap-2 items-center relative">
          {/* Emoji Picker Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-2xl px-2 focus:outline-none"
            title="Pick emoji"
          >
            😊
          </button>
          {/* Emoji Picker Popup */}
          {showEmojiPicker && (
            <div className="absolute bottom-14 left-2 bg-white border rounded-xl shadow-lg p-2 flex flex-wrap gap-2 z-30">
              {Object.entries(EMOJIS).map(([key, emoji]) => (
                <button
                  key={key}
                  type="button"
                  className="text-2xl hover:bg-blue-100 rounded p-1"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          <input
            id="chat-input"
            type="text"
            placeholder="Type your message... 😊"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="off"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full transition font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
