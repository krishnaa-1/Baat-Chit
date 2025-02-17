import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import process from "process";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    // console.log(import.meta.env.VITE_REACT_APP_API_URL)
    e.preventDefault();
    const authURL = isLogin
      ? `${import.meta.env.VITE_REACT_APP_API_URL}/auth/login`
      : `${import.meta.env.VITE_REACT_APP_API_URL}/auth/register`;
    const response = await fetch(authURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        ...(isLogin ? {} : { username }),
      }),
    });
    const data = await response.json();
    if (response.ok) {
      if (isLogin) {
        navigate(`/home/profile/${data.user.username}/${data.user.id}`);
      } else {
        setIsLogin(true);
      }
    } else {
      alert(data.message);
    }
  };

  const handleSignup = async () => {
    try {
      await loginWithRedirect({
        connection: "google-oauth2",
        screen_hint: "signup",
      });
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  const saveGoogleUser = async () => {
    try {
      const userInfo = {
        email: user?.email,
        username: user?.name,
        auth0Id: user?.sub,
      };
      // console.log(import.meta.env.VITE_REACT_APP_API_URL)

      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/home/profile/${data.user.username}/${data.user.id}`);
      } else {
        const errorData = await response.json();
        console.error("Error saving Google user:", errorData.message);
      }
    } catch (error) {
      console.error("Error saving Google user:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      saveGoogleUser();
    }
  }, [isAuthenticated]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-900 via-black to-purple-900 relative overflow-hidden">
      {/* Sparkling Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-pulse bg-gradient-to-r from-purple-700 to-pink-500 opacity-30 w-72 h-72 rounded-full blur-3xl absolute -top-16 -left-16"></div>
        <div className="animate-pulse bg-gradient-to-r from-pink-500 to-purple-700 opacity-30 w-96 h-96 rounded-full blur-3xl absolute top-32 right-16"></div>
      </div>

      <div className="w-full max-w-md bg-gradient-to-br from-purple-700 via-purple-800 to-black shadow-2xl rounded-2xl p-8 z-10">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-purple-300">
          {isLogin ? "Welcome Back to Baatcheet!" : "Join Baatcheet!"}
        </h1>
        <p className="text-center text-purple-400 mb-6">
          {isLogin
            ? "Login to connect with your friends."
            : "Sign up and start chatting!"}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label
                htmlFor="username"
                className="block text-purple-300 font-medium mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 border border-purple-500 rounded-lg bg-purple-900 text-purple-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-purple-300 font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-purple-500 rounded-lg bg-purple-900 text-purple-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-purple-300 font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-purple-500 rounded-lg bg-purple-900 text-purple-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-400 transition duration-200 shadow-md"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-purple-400">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              onClick={toggleAuthMode}
              className="text-purple-300 font-semibold hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
          <button
            onClick={handleSignup}
            className="mt-4 w-full py-2 px-4 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-600 transition duration-200"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
