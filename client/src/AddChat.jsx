import React, { useEffect, useState } from "react";

const AddChat = ({ onClose, setChatsData }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/users`);
      const data = await response.json();
      setUsers(data); // Assuming `data` is an array of users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    // Filter users based on search term (case-insensitive match)
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUserClick = (user) => {
    // Send the username and ID to setChatsData
    setChatsData((prevChats) => [...prevChats, { id: user._id, name: user.username }]);
    onClose(); // Close the AddChat modal
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
        {searchTerm && filteredUsers.length > 0 ? (
          <ul className="border rounded-lg bg-gray-50 shadow-md">
            {filteredUsers.map((user) => (
              <li
                key={user._id} // Assuming each user has a unique `id` field
                onClick={() => handleUserClick(user)} // Add click handler
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
