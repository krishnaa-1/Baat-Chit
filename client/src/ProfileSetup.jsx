import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import process from "process";


const ProfileSetup = () => {
  const [image, setImage] = useState(null);
  const [userName, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      userName,
      bio,
      image,
    });
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/user/${params.userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bio,
        image: "dummy",
      }),
    });
    const data = await response.json();
    if (response.ok) {
      navigate(`/home/${params.username}/${params.userId}`);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-900 via-black to-purple-900 relative overflow-hidden">
      {/* Sparkling Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-pulse bg-gradient-to-r from-purple-700 to-pink-500 opacity-30 w-72 h-72 rounded-full blur-3xl absolute -top-16 -left-16"></div>
        <div className="animate-pulse bg-gradient-to-r from-pink-500 to-purple-700 opacity-30 w-96 h-96 rounded-full blur-3xl absolute top-32 right-16"></div>
      </div>

      <div className="w-full max-w-md bg-gradient-to-br from-purple-700 via-purple-800 to-black shadow-2xl rounded-2xl p-8 z-10">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-purple-300">
          Setup Your Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-900 border-4 border-purple-400">
              {image ? (
                <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
              ) : (
                <div className="flex justify-center items-center w-full h-full text-purple-500">
                  No Image
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="block text-sm text-purple-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
              onChange={handleImageChange}
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-purple-300 font-medium mb-1" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border border-purple-500 rounded-lg bg-purple-900 text-purple-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-purple-300 font-medium mb-1" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              className="w-full px-4 py-2 border border-purple-500 rounded-lg bg-purple-900 text-purple-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Write something about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-400 transition duration-200 shadow-md"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
