import React, { useState, useEffect } from "react";
import axios from "axios";

function Songs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Songs</h1>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <h2>{song.title}</h2>
            <p>Release Year: {song.releaseYear}</p>
            <p>Genre: {song.genre}</p>
            <p>Duration (seconds): {song.duration}</p>
            <p>Artist Name: {song.artist?.name || "Unknown"}</p>
            <p>Artist ID: {song.artist?.id || "Unknown"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Songs;
