import React, { useState, useEffect } from "react";
import axios from "axios";

function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [filterOption, setFilterOption] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/albums")
      .then((response) => {
        setAlbums(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching albums");
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleFilterOption = (e) => {
    setFilterOption(e.target.value);
  };

  const filterAlbums = (album) => {
    if (!input) return true;

    switch (filterOption) {
      case "Title":
        return album.title.toLowerCase().includes(input.toLowerCase());
      case "Artist":
        const artistName = album.artist?.name || album.artist || "";
        return artistName.toLowerCase().includes(input.toLowerCase());
      case "Release Year":
        return String(album.releaseYear).includes(input);
      case "Genre":
        return album.genre.toLowerCase().includes(input.toLowerCase());
      case "Number of Songs":
        return String(album.numberOfSongs).includes(input);
      case "List of Songs":
        return (
          album.songs &&
          album.songs.some(
            (song) =>
              song.title &&
              song.title.toLowerCase().includes(input.toLowerCase())
          )
        );
      default:
        return true;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Albums</h1>

      <h2>Search by: </h2>

      <select value={filterOption} onChange={handleFilterOption}>
        <option value="">Select Filter</option>
        <option value="Title">Title</option>
        <option value="Artist">Artist</option>
        <option value="Release Year">Release Year</option>
        <option value="Genre">Genre</option>
        <option value="Number of Songs">Number of Songs</option>
        <option value="List of Songs">List of Songs</option>
      </select>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Query..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>

      {albums.length === 0 ? (
        <div>No albums available</div>
      ) : (
        <ul>
          {albums.filter(filterAlbums).map((album) => (
            <li key={album.id}>
              <h2>{album.title}</h2>
              <p>
                Artist:{" "}
                {typeof album.artist === "object" && album.artist !== null
                  ? album.artist.name || "Unknown Artist"
                  : album.artist || "Unknown Artist"}
              </p>
              <p>Release Year: {album.releaseYear}</p>
              <p>Genre: {album.genre}</p>
              <p>numberOfSongs: {album.numberOfSongs}</p>
              <ul>
                <p>List of Songs:</p>
                {album.songs && album.songs.length > 0 ? (
                  album.songs.map((song) => (
                    <li key={song.id || Math.random()}>
                      {song.title || "Unknown Song"}
                    </li>
                  ))
                ) : (
                  <li>No songs available</li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Albums;
