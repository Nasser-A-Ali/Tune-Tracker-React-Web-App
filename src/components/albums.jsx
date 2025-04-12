import React, { useState, useEffect } from "react";
import axios from "axios";

function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [filterOption, setFilterOption] = useState("");

  // Chooses the API URL based on the environment (local or production - npm start or npm run build)
  const databaseLink = process.env.REACT_APP_API_URL || "http://localhost:8080"; 
  
  const [newAlbum, setNewAlbum] = useState({
    id: null,
    title: "",
    genre: "",
    listOfSongs: "",
    releaseYear: "",
    artistId: "",
  });

  useEffect(() => {
    axios
      .get(`${databaseLink}/albums`)
      .then((response) => {
        setAlbums(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching albums");
        setLoading(false);
      });
  }, [databaseLink]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const parsedListOfSongs = newAlbum.listOfSongs
        .split(",")
        .map((id) => ({ id: parseInt(id.trim()) }));

      const albumData = {
        title: newAlbum.title,
        artist: { id: parseInt(newAlbum.artistId) },
        genre: newAlbum.genre,
        releaseYear: parseInt(newAlbum.releaseYear),
        listOfSongs: parsedListOfSongs,
      };

      if (newAlbum.id === null) {
        await axios.post(`${databaseLink}/album`, albumData);
      } else {
        await axios.put(`${databaseLink}/album/${newAlbum.id}`, albumData);
      }

      const refreshed = await axios.get(`${databaseLink}/albums`);
      setAlbums(refreshed.data);

      setNewAlbum({
        id: null,
        title: "",
        genre: "",
        listOfSongs: "",
        releaseYear: "",
        artistId: "",
      });
    } catch (error) {
      console.error("Error saving album:", error);
      setError("Failed to save album. Please check artist ID or song IDs.");
    }
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
        return album.artist?.name.toLowerCase().includes(input.toLowerCase());
      case "Release Year":
        return album.releaseYear.toString().includes(input);
      case "Genre":
        return album.genre.toLowerCase().includes(input.toLowerCase());
      default:
        return true;
    }
  };

  const handleEdit = (album) => {
    const songIds = album.listOfSongs?.map((s) => s.id).join(",") || "";

    setNewAlbum({
      id: album.id,
      title: album.title,
      artistId: album.artist?.id || "",
      releaseYear: album.releaseYear,
      genre: album.genre,
      listOfSongs: songIds,
    });
  };

  const handleDelete = async (albumId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this album?");
    if (confirmDelete) {
      try {
        await axios.delete(`${databaseLink}/album/${albumId}`);
        const refreshed = await axios.get(`${databaseLink}/albums`);
        setAlbums(refreshed.data);
      } catch (error) {
        console.error("Error deleting album:", error);
        setError("Failed to delete album. Please try again.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Albums</h1>

      <div className="SearchAddEditContainer">
        <div id="Search">
          <h2>Search by:</h2>
          <select value={filterOption} onChange={handleFilterOption}>
            <option value="">Select Filter</option>
            <option value="Title">Title</option>
            <option value="Artist">Artist</option>
            <option value="Release Year">Release Year</option>
            <option value="Genre">Genre</option>
          </select>

          <form onSubmit={(e) => e.preventDefault()}>
            <input
              id="InputTop"
              type="text"
              placeholder="Enter Query..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </form>

          <h2>{newAlbum.id === null ? "Add New Album" : "Update Album"}</h2>
          {newAlbum.id !== null && (
            <button
              onClick={() =>
                setNewAlbum({
                  id: null,
                  title: "",
                  artistId: "",
                  releaseYear: "",
                  genre: "",
                  listOfSongs: "",
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
              value={newAlbum.title}
              onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Genre"
              value={newAlbum.genre}
              onChange={(e) => setNewAlbum({ ...newAlbum, genre: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="List of Song IDs (comma separated)"
              value={newAlbum.listOfSongs}
              onChange={(e) => setNewAlbum({ ...newAlbum, listOfSongs: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Release Year"
              value={newAlbum.releaseYear}
              onChange={(e) => setNewAlbum({ ...newAlbum, releaseYear: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Artist ID"
              value={newAlbum.artistId}
              onChange={(e) => setNewAlbum({ ...newAlbum, artistId: e.target.value })}
              required
            />
            <button type="submit">
              {newAlbum.id === null ? "Add Album" : "Update Album"}
            </button>
          </form>
        </div>
      </div>

      <ul className="list">
        {albums.filter(filterAlbums).map((album) => (
          <li key={album.id} className="item">
            <div className="details">
              <h2 className="name">{album.title}</h2>
              <div className="info">
                <p><strong>Artist:</strong> {album.artist?.name}</p>
                <p><strong>Release Year:</strong> {album.releaseYear}</p>
                <p><strong>Genre:</strong> {album.genre}</p>
                <p><strong>Songs:</strong></p>
                <ul>
                  {album.listOfSongs?.map((song) => (
                    <li key={song.id}>{song.title}</li>
                  )) || <li>No songs available</li>}
                </ul>
              </div>
              <div className="button-group">
                <button id="EditButton" onClick={() => handleEdit(album)}>Edit</button>
                <button id="DeleteButton" onClick={() => handleDelete(album.id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Albums;
