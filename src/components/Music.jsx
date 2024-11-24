import React, { useEffect, useState } from "react";
import { getAllSongs } from "../api";
import { actionType } from "../Context/reducer";
import { useStateValue } from "../Context/StateProvider";
import Header from "./Header";
import { AiOutlineClear } from "react-icons/ai";
import { motion } from "framer-motion";

const Music = () => {
  const [songFilter, setSongFilter] = useState(""); // State for holding the search input
  const [filteredSongs, setFilteredSongs] = useState([]); // State for holding filtered song results
  const [recentlyPlayed, setRecentlyPlayed] = useState([]); // State for recently played songs
  const [{ allSongs, isSongPlaying, song }, dispatch] = useStateValue(); // Accessing global state

  // Fetch all songs if not already available
  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.data,
        });
      });
    } else {
      setFilteredSongs(allSongs || []); // If allSongs is already available, initialize filteredSongs
    }
  }, [allSongs, dispatch]);

  // Prefix Matching Search Algorithm - Search and filter songs based on user input
  useEffect(() => {
    if (songFilter.trim()) {
      const lowercasedFilter = songFilter.toLowerCase(); // Convert search input to lowercase for case-insensitive comparison
      
      // Filter songs where artist, language, or song name starts with the search input
      const filtered = allSongs?.filter(
        (data) =>
          data.artist.toLowerCase().startsWith(lowercasedFilter) ||  // Check if artist's name starts with the search input
          data.language.toLowerCase().startsWith(lowercasedFilter) || // Check if language starts with the search input
          data.name.toLowerCase().startsWith(lowercasedFilter) // Check if song name starts with the search input
      );
      
      setFilteredSongs(filtered || []); // Update the filteredSongs state with the results
    } else {
      setFilteredSongs(allSongs || []); // If search input is empty, reset to show all songs
    }
  }, [songFilter, allSongs]); // This effect depends on changes to songFilter and allSongs

  // Add selected song to context and update recently played list
  const addSongToContext = (index) => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_SONG_PLAYING,
        isSongPlaying: true, // Set the song as playing if no song is currently playing
      });
    }

    if (song !== index) {
      dispatch({
        type: actionType.SET_SONG,
        song: index, // Update the current song in context
      });

      // Update Recently Played Songs - store only the last 2 songs
      setRecentlyPlayed((prev) => {
        const updatedList = [allSongs[index], ...prev]; // Add the newly played song to the top
        return updatedList.length > 2 ? updatedList.slice(0, 2) : updatedList; // Keep only the last 2 songs
      });
    }
  };

  return (
    <div className="w-full h-auto flex flex-col items-center bg-primary px-4">
      <Header />

      <div className="w-full flex justify-center items-center gap-4 mt-4">
        <input
          type="text"
          placeholder="Search here"
          className="w-52 px-4 py-2 border border-gray-300 rounded-md text-base"
          value={songFilter} // Value of the search input
          onChange={(e) => setSongFilter(e.target.value)} // Update the songFilter state on input change
        />
        {songFilter && (
          <AiOutlineClear
            onClick={() => {
              setSongFilter(""); // Clear the search input when the clear icon is clicked
              setFilteredSongs(allSongs || []); // Reset the filtered songs to show all songs
            }}
            className="text-3xl text-textColor cursor-pointer"
          />
        )}
      </div>

      {/* Recently Played Songs */}
      <div className="w-full my-4 text-center">
        <h2 className="text-2xl font-semibold text-headingColor">Recently Played</h2>
      </div>
      <div className="w-full flex flex-col items-center gap-4 p-4 mt-6">
        {recentlyPlayed.length > 0 ? (
          recentlyPlayed.map((data, index) => (
            <motion.div
              key={data._id}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-full max-w-2xl p-4 flex items-center gap-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
              onClick={() => addSongToContext(allSongs.indexOf(data))}
            >
              <img
                src={data.imageURL}
                alt="song cover"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex flex-col flex-grow">
                <p className="text-lg font-semibold text-headingColor">{data.name}</p>
                <p className="text-sm text-gray-500">{data.artist}</p>
              </div>
              <button className="bg-green-500 text-white px-3 py-1 rounded-md">Play</button>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No recent songs played</p>
        )}
      </div>

      <div className="w-full my-4 text-center">
        <h2 className="text-2xl font-semibold text-headingColor">All Songs</h2>
      </div>

      <div className="w-full flex flex-col items-center gap-4 p-4 mt-6">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((data, index) => (
            <motion.div
              key={data._id}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-full max-w-2xl p-4 flex items-center gap-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
              onClick={() => addSongToContext(index)}
            >
              <img
                src={data.imageURL}
                alt="song cover"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex flex-col flex-grow">
                <p className="text-lg font-semibold text-headingColor">{data.name}</p>
                <p className="text-sm text-gray-500">{data.artist}</p>
              </div>
              <button className="bg-green-500 text-white px-3 py-1 rounded-md">Play</button>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No songs available</p>
        )}
      </div>
    </div>
  );
};

export default Music;
