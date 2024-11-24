import React, { useEffect } from "react";
import Header from "./Header";
import { useStateValue } from "../Context/StateProvider";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// Import actionType from your reducer
import { actionType } from "../Context/reducer";  // <-- This is where the error was, adding this import

const UserProfile = () => {
  const [{ user }, dispatch] = useStateValue(); // Access user details from the context
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User Profile Data: ", user); // Log user data to check its structure
  }, [user]);

  const logout = () => {
    const firebaseAuth = getAuth(app);
    firebaseAuth
      .signOut()
      .then(() => {
        // Clear the user auth status from localStorage
        window.localStorage.setItem("auth", "false");

        // Reset the music player state (turn off the player and reset song)
        dispatch({
          type: actionType.SET_SONG_PLAYING,
          isSongPlaying: false,  // Turn off music player
        });
        dispatch({
          type: actionType.SET_SONG,
          song: null,  // Reset the current song
        });
      })
      .catch((e) => console.log(e));

    // Navigate to login page after sign out
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-gray-100 p-6">
      <Header />
      <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <img
          src={user?.user?.imageURL || "https://via.placeholder.com/150"}
          alt="User Avatar"
          className="w-24 h-24 object-cover rounded-full border-4 border-primary mb-6"
        />
        <h2 className="text-3xl font-semibold text-headingColor mb-3">
          {user?.user?.name || "User Name"}
        </h2>
        <p className="text-lg text-textColor mb-3">
          {user?.user?.email || "user@example.com"}
        </p>
        <div className="bg-gray-50 p-4 rounded-md w-full">
          <p className="text-lg text-headingColor mb-2 font-medium">
            Role: <span className="font-normal">{user?.user?.role || "Not assigned"}</span>
          </p>
          <p className="text-lg text-headingColor mb-2 font-medium">
            Account Created:{" "}
            <span className="font-normal">
              {user?.user?.createdAt ? new Date(user.user.createdAt).toLocaleDateString() : "Date not available"}
            </span>
          </p>
        </div>
        
        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="mt-6 px-6 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition duration-300 ease-in-out"
          onClick={logout}
        >
          Sign Out
        </motion.button>
      </div>
    </div>
  );
};

export default UserProfile;
