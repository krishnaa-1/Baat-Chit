import React, { useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import AddChat from "./AddChat";

const ChatList = ({ chats, selectedChat, onChatSelect, activeTab, setActiveTab, setChatsData , socket}) => {
  const [isAddChatVisible, setIsAddChatVisible] = useState(false);
//  console.log(chats)
  return (
    <div className="w-1/3 border-r bg-gray-100 relative">
      {/* Header */}
      <div className="p-4 bg-white flex justify-between items-center border-b">
        <h2 className="text-xl font-bold">Chats</h2>
        <div className="flex gap-4">
          <button onClick={() => setIsAddChatVisible(true)}>
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
      <div className="overflow-y-auto">
        {chats.length > 0 ? (
          <ul>
            {chats.map((chat) => (
              <li
                key={chat.id}
                className={`p-4 cursor-pointer border-b hover:bg-gray-200 ${
                  selectedChat === chat.id ? "bg-gray-300" : ""
                }`}
                onClick={() => onChatSelect(chat.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">{chat.name}</div>
                  <div className="text-sm text-gray-500">{chat.time}</div>
                </div>
                <div className="text-sm text-gray-600">{chat.lastMessage}</div>
              </li>
            ))}
          </ul>
        ) : (
            <div className="flex items-center justify-center h-[calc(100vh-120px)] text-gray-500">
            Add Someone to start your <span className="font-semibold ml-1">Baat cheet</span>!
          </div>
          
        )}
      </div>

      {/* AddChat Component */}
      {isAddChatVisible && <AddChat socket={socket} setChatsData={setChatsData} onClose={() => setIsAddChatVisible(false)} />}
    </div>
  );
};

export default ChatList;
