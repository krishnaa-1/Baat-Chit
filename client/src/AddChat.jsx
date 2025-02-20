import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AddChat = ({ onClose, setChatsData }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/users`
        );
        const data = await response.json();
        setUsers(data); // Assuming `data` is an array of users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    // Filter users based on search term (case-insensitive match)
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUserClick = async (user) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/chat/joinChat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: params.userId,
            recipientId: user._id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log(`Joined chatroom: ${data.chatRoom._id}`);
        setChatsData((prevChats) => [
          ...prevChats,
          { id: data.chatRoom._id, name: user.username },
        ]);
        onClose();

        // Navigate to the new route with refresh
        const username = params.username;
        navigate(`/home/${username}/${params.userId}`, { replace: true });
        window.location.reload(); // Force a refresh
      } else {
        console.error("Failed to join chatroom:", data.message);
      }
    } catch (error) {
      console.error("Error joining chatroom:", error);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white flex flex-col p-4 shadow-lg z-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Add Chat</h2>
        <button onClick={onClose} className="text-gray-600 text-lg">
          ✖
        </button>
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 border rounded-lg mb-4"
      />
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length > 0 ? (
          <ul className="border rounded-lg bg-gray-50 shadow-md">
            {filteredUsers.map((user) => (
              <li
                key={user._id}
                onClick={() => handleUserClick(user)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {user.username}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            {searchTerm ? "No users found." : "Search for people to chat with."}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddChat;
