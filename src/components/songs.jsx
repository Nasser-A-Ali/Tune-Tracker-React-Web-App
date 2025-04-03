import React, { useState, useEffect } from "react";
import axios from "axios";

function Songs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [filterOption, setFilterOption] = useState("");
  

  useEffect(() => {
    axios
      .get("http://localhost:8080/songs")
      .then((response) => {
        setSongs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching songs");
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Songs</h1>

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
          type="text"
          placeholder="Enter query"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
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
            <strong>Artist Name:</strong> {song.artist?.name || "Unknown"}
          </p>
          <p>
            <strong>Artist ID:</strong> {song.artist?.id || "Unknown"}
          </p>
        </div>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
}

export default Songs;
