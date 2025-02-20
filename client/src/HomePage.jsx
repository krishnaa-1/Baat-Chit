import React, { useState, useEffect } from "react";
import { User, MessageSquare, LogOut } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import ChatList from "./ChatList";
import ChatConversation from "./ChatConversation";

const ChatApp = () => {
  const [chatsData, setChatsData] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatName, setSelectedChatName] = useState(null);
  const[recipientId, setRecipientId] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const { userId } = useParams();
  const { logout } = useAuth0();

  useEffect(() => {
    // Fetch chats data from the API
    const fetchChats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/chat/chatroom/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Chat data fetched from the server:", data);

        const chats = data.map((chat) => ({
          id: chat._id,
          name: chat.members.map((member) => member.username).join(", "),
          recipientId: chat.members[0]?._id || null, // Handle case where members array might be empty
          lastMessage: chat.lastMessage?.message || "No messages yet", // Fallback if lastMessage is missing
          time: new Date(chat.createdAt).toLocaleString("en-GB", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true, // Optional: Change to false for 24-hour format
          }),
        }));

        setChatsData(chats);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchChats();
  }, [userId]);

  useEffect(() => {
    // Emit join chat event when selectedChat changes
    if (selectedChat) {
      const chat = chatsData.find((chat) => chat.id === selectedChat);
      const recipientId = chat?.recipientId;
      console.log("RecipientId:", recipientId);
      setRecipientId(recipientId);
      setSelectedChatName(chat?.name || null);
    } else {
      setSelectedChatName(null);
    }

  }, [selectedChat, chatsData, userId]);

  const handleLogout = () => {
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
        <button onClick={handleLogout}>
          <LogOut className="w-8 h-8 text-white hover:text-blue-500" />
        </button>
      </div>

      {/* Left Sidebar */}
      <ChatList
        chats={chatsData}
        selectedChat={selectedChat}
        onChatSelect={setSelectedChat}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setChatsData={setChatsData}
      />

      {/* Right Panel */}
      <ChatConversation
        selectedChatName={selectedChatName}
        selectedChat={selectedChat}
        recipientId={recipientId}
      />
    </div>
  );
};

export default ChatApp;
