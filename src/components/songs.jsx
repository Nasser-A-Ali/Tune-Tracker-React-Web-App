import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

function Songs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [filterOption, setFilterOption] = useState("");

  // Chooses the API URL based on the environment (local or production - npm start or npm run build)
  const databaseLink = process.env.REACT_APP_API_URL || "http://localhost:8080"; 
  const [newSong, setNewSong] = useState({
    id: null,
    title: "",
    genre: "",
    duration: "",
    releaseYear: "",
    artistId: "",
  });

  useEffect(() => {
    axios
      .get(`${databaseLink}/songs`)
      .then((response) => {
        setSongs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching songs");
        setLoading(false);
      });
  }, [databaseLink]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const songData = {
        title: newSong.title,
        genre: newSong.genre,
        duration: parseInt(newSong.duration),
        releaseYear: parseInt(newSong.releaseYear),
        artist: { id: parseInt(newSong.artistId) },
      };

      if (newSong.id === null) {
        await axios.post(`${databaseLink}/song`, songData);
      } else {
        await axios.put(`${databaseLink}/song/${newSong.id}`, songData);
      }

      const refreshed = await axios.get(`${databaseLink}/songs`);
      setSongs(refreshed.data);

      setNewSong({
        id: null,
        title: "",
        genre: "",
        duration: "",
        releaseYear: "",
        artistId: "",
      });
    } catch (error) {
      console.error("Error saving song:", error);
      setError("Failed to save song. Please check artist ID and try again.");
    }
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  const filterSongs = (song) => {
    if (!input) return true;
    switch (filterOption) {
      case "Title":
        return song.title.toLowerCase().includes(input.toLowerCase());
      case "Release Year":
        return song.releaseYear.toString().includes(input);
      case "Genre":
        return song.genre.toLowerCase().includes(input.toLowerCase());
      case "Artist":
        return song.artist?.name?.toLowerCase().includes(input.toLowerCase());
      default:
        return true;
    }
  };

  const handleEdit = (song) => {
    setNewSong({
      id: song.id,
      title: song.title,
      genre: song.genre,
      duration: song.duration,
      releaseYear: song.releaseYear,
      artistId: song.artist?.id || "",
    });
  };

  const handleDelete = async (songId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this song?");
    if (confirmDelete) {
      try {
        await axios.delete(`${databaseLink}/song/${songId}`);
        const refreshed = await axios.get(`${databaseLink}/songs`);
        setSongs(refreshed.data);
      } catch (error) {
        console.error("Error deleting song:", error);
        setError("Failed to delete song. Please try again.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Songs</h1>

      <div className="SearchAddEditContainer">
        <div id="Search">
          <h2>Search by:</h2>
          <select value={filterOption} onChange={handleFilterChange}>
            <option value="">Select Filter</option>
            <option value="Title">Title</option>
            <option value="Release Year">Release Year</option>
            <option value="Genre">Genre</option>
            <option value="Artist">Artist</option>
          </select>
          <form onSubmit={handleSubmit}>
            <input
              id="InputTop"
              type="text"
              placeholder="Enter query"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        </div>

        <div id="AddEdit">
          <h2>{newSong.id === null ? "Add New Song" : "Update Song"}</h2>
          {newSong.id !== null && (
            <button
              onClick={() =>
                setNewSong({
                  id: null,
                  title: "",
                  genre: "",
                  duration: "",
                  releaseYear: "",
                  artistId: "",
                })
              }
              style={{ marginBottom: "10px" }}
            >
              Cancel Edit
            </button>
          )}
          <form onSubmit={handleSubmit} className="addForm">
            <input
              type="text"
              placeholder="Title"
              value={newSong.title}
              onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Genre"
              value={newSong.genre}
              onChange={(e) => setNewSong({ ...newSong, genre: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Duration (seconds)"
              value={newSong.duration}
              onChange={(e) => setNewSong({ ...newSong, duration: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Release Year"
              value={newSong.releaseYear}
              onChange={(e) =>
                setNewSong({ ...newSong, releaseYear: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Artist ID"
              value={newSong.artistId}
              onChange={(e) =>
                setNewSong({ ...newSong, artistId: e.target.value })
              }
              required
            />

            <button type="submit">
              {newSong.id === null ? "Add Song" : "Update Song"}
            </button>
          </form>
        </div>
      </div>

      <ul className="list">
        {songs.filter(filterSongs).map((song) => (
          <li key={song.id} className="item">
            <div className="details">
              <h2 className="name">{song.title}</h2>
              <div className="info">
                <p>
                  <strong>Release Year:</strong> {song.releaseYear}
                </p>
                <p>
                  <strong>Genre:</strong> {song.genre}
                </p>
                <p>
                  <strong>Duration:</strong> {song.duration} seconds
                </p>
                <p>
                  <strong>Artist Name:</strong> {song.artist?.name || "Unknown"} (ID: {song.artist?.id || "Unknown"})
                </p>
                {/* <p>
                  <strong>Artist ID:</strong> {song.artist?.id || "Unknown"}
                </p> */}
                <div className="button-group">
                  <button id="EditButton" onClick={() => handleEdit(song)}>
                    Edit
                  </button>
                  <button id="DeleteButton" onClick={() => handleDelete(song.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Songs;
