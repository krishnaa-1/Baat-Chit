import React, { useState } from "react";
import { Plus, MoreVertical, User, MessageSquare, LogOut } from "lucide-react"; // Added LogOut icon
import { useAuth0 } from "@auth0/auth0-react";
import process from "process";


const chatsData = [
  { id: 1, name: "John Doe", lastMessage: "Hey, how are you?", time: "12:30 PM" },
  { id: 2, name: "Jane Smith", lastMessage: "Let's meet tomorrow.", time: "11:15 AM" },
  { id: 3, name: "Alice", lastMessage: "Can you send the file?", time: "Yesterday" },
  { id: 4, name: "Bob", lastMessage: "Sure, no problem!", time: "Yesterday" },
];

const messagesData = {
  1: [
    { sender: "John Doe", text: "Hey, how are you?", time: "12:29 PM" },
    { sender: "You", text: "I'm good! How about you?", time: "12:30 PM" },
  ],
  2: [
    { sender: "Jane Smith", text: "Let's meet tomorrow.", time: "11:15 AM" },
  ],
  3: [
    { sender: "Alice", text: "Can you send the file?", time: "Yesterday" },
    { sender: "You", text: "Sure, I'll send it now.", time: "Yesterday" },
  ],
  4: [
    { sender: "Bob", text: "Sure, no problem!", time: "Yesterday" },
  ],
};

const ChatApp = () => {
  const [selectedChat, setSelectedChat] = useState(null); // Selected chat for messages
  const [activeTab, setActiveTab] = useState("All"); // Active filter tab
  const{logout} = useAuth0();
  // Handle chat selection
  const handleChatClick = (chatId) => {
    setSelectedChat(chatId);
  };

  // Handle logout
  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing cookies, redirecting to login page, etc.)
    console.log("Logging out...");
    logout();
  };

  return (
    <div className="flex h-screen">
      {/* Extreme Left Panel (Icons) */}
      <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-8">
        <button>
          <User className="w-8 h-8 text-white hover:text-blue-500" />
        </button>
        <button>
          <MessageSquare className="w-8 h-8 text-white hover:text-blue-500" />
        </button>
        {/* Logout Button */}
        <button onClick={handleLogout}>
          <LogOut className="w-8 h-8 text-white hover:text-blue-500" />
        </button>
      </div>

      {/* Left Sidebar (Chats List) */}
      <div className="w-1/3 border-r bg-gray-100">
        {/* Header */}
        <div className="p-4 bg-white flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Chats</h2>
          <div className="flex gap-4">
            <button>
              <Plus className="w-6 h-6 text-gray-600" />
            </button>
            <button>
              <MoreVertical className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs for All, Unread, Groups */}
        <div className="flex justify-around bg-white border-b">
          {["All", "Unread", "Groups"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm ${
                activeTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Chat List */}
        <ul className="overflow-y-auto">
          {chatsData.map((chat) => (
            <li
              key={chat.id}
              className={`p-4 cursor-pointer border-b hover:bg-gray-200 ${
                selectedChat === chat.id ? "bg-gray-300" : ""
              }`}
              onClick={() => handleChatClick(chat.id)}
            >
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">{chat.name}</div>
                <div className="text-sm text-gray-500">{chat.time}</div>
              </div>
              <div className="text-sm text-gray-600">{chat.lastMessage}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel (Chat Conversation) */}
      <div className="flex-1 bg-white">
        {selectedChat ? (
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b bg-gray-100">
              <div className="text-lg font-bold">
                {chatsData.find((chat) => chat.id === selectedChat)?.name}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messagesData[selectedChat]?.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.sender === "You" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.sender === "You"
                        ? "bg-green-200 text-black"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {message.text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{message.time}</div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-gray-100">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none"
                />
                <button className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
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
    </div>
  );
};

export default ChatApp;
