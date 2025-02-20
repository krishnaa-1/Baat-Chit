import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const ChatConversation = ({ selectedChatName, selectedChat, recipientId }) => {
  const params = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = React.useRef(null); // Ref to store the socket connection
  const messagesEndRef = useRef(null); // Ref to scroll to the latest message

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!selectedChat || !recipientId) return; // Ensure both are available

    console.log("Selected chat:", selectedChat);
    console.log("RecipientId:", recipientId);

    // Initialize socket connection
    socket.current = io(import.meta.env.VITE_REACT_APP_API_URL);

    // Join the selected chat room
    socket.current.emit("join chat", {
      senderId: params.userId,
      recipientId: recipientId,
    });
    console.log("join chat event emitted", {
      senderId: params.userId,
      recipientId: recipientId,
    });

    socket.current.on("receive message", (newMessage) => {
      console.log("Received message:", newMessage);
      const formattedMessage = {
        text: newMessage.message,
        sender: newMessage.sender.username,
        time: new Date(newMessage.createdAt).toLocaleString("en-GB", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };

      setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    });

    return () => {
      socket.current.disconnect(); // Cleanup
    };
  }, [selectedChat, recipientId]); // Re-run when recipientId or selectedChat changes

  useEffect(() => {
    // Fetch messages for the selected chat
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/chat/chatroom/messages/${selectedChat}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const formattedMessages = data.messages.map((message) => ({
          text: message.message,
          sender: message.sender.username,
          time: new Date(message.createdAt).toLocaleString("en-GB", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (selectedChat) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom(); // Scroll to the latest message when messages are updated
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    console.log("selectedChat:", selectedChat);

    const messageData = {
      senderId: params.userId,
      message: newMessage,
      chatRoomId: selectedChat,
    };

    // Emit the message via socket
    socket.current.emit("send message", messageData);

    // Optimistically update the UI
    const newMessageObj = {
      text: newMessage,
      sender: params.username,
      time: new Date().toLocaleString("en-GB", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    };

    setMessages((prevMessages) => [...prevMessages, newMessageObj]);
    setNewMessage(""); // Clear the input field
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex-1 bg-white">
      {messages ? (
        <div className="h-full flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-gray-100">
            <div className="text-lg font-bold">{selectedChatName}</div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.sender === params.username ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.sender === params.username
                      ? "bg-green-200 text-black"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {message.text}
                </div>
                <div className="text-xs text-gray-500 mt-1">{message.time}</div>
              </div>
            ))}
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-gray-100">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown} // Handle Enter key press
              />
              <button
                className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
};

export default ChatConversation;
