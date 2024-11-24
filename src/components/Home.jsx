import React, { useEffect, useState } from "react";
import { getAllSongs } from "../api";
import { actionType } from "../Context/reducer";
import { useStateValue } from "../Context/StateProvider";
import Filter from "./Filter";
import Header from "./Header";
import SearchBar from "./SearchBar";
import { FaPlay } from "react-icons/fa"; // Importing the play icon from react-icons
import { motion } from "framer-motion";

const Home = () => {
  const [
    {
      searchTerm,
      isSongPlaying,
      song,
      allSongs,
      artistFilter,
      filterTerm,
      albumFilter,
      languageFilter,
    },
    dispatch,
  ] = useStateValue();

  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getAllSongs();
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.data,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setLoading(false);
      }
    };

    if (!allSongs) {
      fetchSongs();
    } else {
      setLoading(false);
    }
  }, [allSongs, dispatch]);

  useEffect(() => {
    if (allSongs && Array.isArray(allSongs)) {
      let filtered = allSongs;

      if (searchTerm) {
        filtered = filtered.filter(
          (data) =>
            data.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
            data.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
            data.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (artistFilter) {
        filtered = filtered.filter((data) => data.artist === artistFilter);
      }

      if (filterTerm) {
        filtered = filtered.filter((data) => data.category.toLowerCase() === filterTerm);
      }

      if (albumFilter) {
        filtered = filtered.filter((data) => data.album === albumFilter);
      }

      if (languageFilter) {
        filtered = filtered.filter((data) => data.language === languageFilter);
      }

      setFilteredSongs(filtered);
    } else {
      setFilteredSongs([]); // Fallback to empty array if no songs are available
    }
  }, [searchTerm, artistFilter, filterTerm, albumFilter, languageFilter, allSongs]);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      <SearchBar />

      {searchTerm && (
        <p className="my-4 text-base text-textColor">
          Searched for :
          <span className="text-xl text-cartBg font-semibold">
            {searchTerm}
          </span>
        </p>
      )}

      <Filter setFilteredSongs={setFilteredSongs} />

      <div className="w-full h-auto flex items-center justify-evenly gap-4 flex-wrap p-4">
        <HomeSongContainer
          musics={Array.isArray(filteredSongs) && filteredSongs.length > 0
            ? filteredSongs
            : Array.isArray(allSongs) && allSongs.length > 0
            ? allSongs
            : []}
        />
      </div>
    </div>
  );
};

export const HomeSongContainer = ({ musics }) => {
  const [{ isSongPlaying, song }, dispatch] = useStateValue();

  const addSongToContext = (index) => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_SONG_PLAYING,
        isSongPlaying: true,
      });
    }
    if (song !== index) {
      dispatch({
        type: actionType.SET_SONG,
        song: index,
      });
    }
  };

  return (
    <>
      {Array.isArray(musics) && musics.length > 0 ? (
        musics.map((data, index) => (
          <motion.div
            key={data._id}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center group"
            onClick={() => addSongToContext(index)}
          >
            <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden group">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={data.imageURL}
                alt=""
                className="w-full h-full rounded-lg object-cover"
              />
              {/* Play button appears when hovering over the image */}
              <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent song click action when pressing play button
                    addSongToContext(index);
                  }}
                  className="bg-green-500 text-white p-4 rounded-full shadow-md hover:bg-green-600"
                >
                  <FaPlay size={24} />
                </button>
              </div>
            </div>
            <p className="text-base text-headingColor font-semibold my-2">
              {data.name.length > 25 ? `${data.name.slice(0, 25)}...` : data.name}
              <span className="block text-sm text-gray-400 my-1">
                {data.artist}
              </span>
            </p>
          </motion.div>
        ))
      ) : (
        <p className="text-gray-500">No songs available</p>
      )}
    </>
  );
};

export default Home;
