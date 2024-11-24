
const [loading, setLoading] = useState(true);

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

useEffect(() => {
  if (!allSongs) {
    fetchSongs();
  } else {
    setLoading(false);
  }
}, [allSongs]);
//////////
//algo for fil

const applyFilters = () => {
  // Step : Initialize the datasett
  let filteredSongs = allSongs || []; // Start with all songs (or an empty array if not available)

  // Step 2: Apply filters if they exist()

  // A Artist Filter
  if (artistFilter) {
    filteredSongs = filteredSongs.filter((song) =>
      song.artist && song.artist.toLowerCase().includes(artistFilter.toLowerCase())
    );
  }

  // Ap Language Filter
  if (languageFilter) {
    filteredSongs = filteredSongs.filter((song) =>
      song.language && song.language.toLowerCase().includes(languageFilter.toLowerCase())
    );
  }

  // A Album Filter
  if (albumFilter) {
    filteredSongs = filteredSongs.filter((song) =>
      song.album && song.album.toLowerCase().includes(albumFilter.toLowerCase())
    );
  }

  //  Category 
  if (filterTerm) {
    filteredSongs = filteredSongs.filter((song) =>
      song.category && song.category.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }

  // Step 3: Update the state  filtered songs
  setFilteredSongs(filteredSongs);
};
