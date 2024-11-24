import React, { useEffect } from "react";
import { LoginBg } from "../assets/video"; // vid path 
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../config/firebase.config";
import { useNavigate } from "react-router-dom";
import { validateUser } from "../api"; //  validateUser 
import { actionType } from "../Context/reducer";
import { useStateValue } from "../Context/StateProvider";

const Login = ({ setAuth }) => {
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const [, dispatch] = useStateValue();

  // Function to handle Google login
  const loginWithGoogle = async () => {
    try {
      const userCred = await signInWithPopup(firebaseAuth, provider);
  
      if (userCred) {
        setAuth(true);
        window.localStorage.setItem("auth", "true");
  
        // After signing in, retrieve the ID token
        firebaseAuth.onAuthStateChanged(async (userCred) => {
          if (userCred) {
            const token = await userCred.getIdToken();
  
            // Store the token in local storage for future use
            window.localStorage.setItem("authToken", token);
  
            // Validate the token with the backend
            const data = await validateUser(token);
  
            // Update global state with the user's data
            dispatch({
              type: actionType.SET_USER,
              user: data,
            });
  
            // Redirect to the home page after successful login
            navigate("/", { replace: true });
          } else {
            setAuth(false);
            dispatch({
              type: actionType.SET_USER,
              user: null,
            });
            navigate("/login");
          }
        });
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("Failed to login with Google. Please try again.");
    }
  };
  

  // Check if the user is already logged in
  useEffect(() => {
    if (window.localStorage.getItem("auth") === "true") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {/* Background video */}
      <video
        src={LoginBg}
        type="video/mp4"
        autoPlay
        muted
        loop
        className="absolute w-full h-full object-cover"
      />

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60"></div>

      {/* Login form container */}
      <div className="relative w-full max-w-md p-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg">
        <h2 className="text-3xl text-center font-semibold text-white mb-6">
          Welcome to MusicStream!
        </h2>
        <p className="text-lg text-center text-white mb-8">
          Discover, stream, and enjoy tons  of songs from your favorite artists. Sign in now to start your musical journey.
        </p>

        {/* Visual email and password input fields 
        <div className="mb-4">
          <input
            type="text"
            placeholder="Email"
            className="w-full px-4 py-2 mb-4 rounded-md bg-white bg-opacity-50 text-gray-800 placeholder-gray-600"
            disabled
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md bg-white bg-opacity-50 text-gray-800 placeholder-gray-600"
            disabled
          />
        </div>

        {/* Google sign-in button */}
        <div
          onClick={loginWithGoogle}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white text-gray-700 cursor-pointer hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FcGoogle className="text-2xl" />
          <p className="text-lg font-medium">Sign in with Google</p>
        </div>

        {/* Terms and privacy policy */}
        <p className="text-sm text-center text-white mt-6">
          By signing in, you agree to our{" "}
          <button className="underline" onClick={() => alert("Terms of Service")}>
            Terms
          </button>{" "}
          and{" "}
          <button className="underline" onClick={() => alert("Privacy Policy")}>
            Privacy Policy
          </button>.
        </p>
      </div>
    </div>
  );
};

export default Login;
