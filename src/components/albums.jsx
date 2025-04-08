import React, { useState, useEffect } from "react";
import axios from "axios";

function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [newAlbum, setNewAlbum] = useState({
    id: null,
    title: "",
    genre: "",
    numberOfSongs: "",
    listOfSongs: "",
    releaseYear: "",
    artistId: "",
  });
  const databaseLink = "http://34.235.166.184:80";
  // const databaseLink = "http://localhost:8080";

  useEffect(() => {
    axios
      .get(`http://34.235.166.184:80/albums`)
      .then((response) => {
        setAlbums(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching albums");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const albumData = {
        title: newAlbum.title,
        artist: { id: parseInt(newAlbum.artistId) },
        genre: newAlbum.genre,
        duration: parseInt(newAlbum.numberOfSongs),
        releaseYear: parseInt(newAlbum.releaseYear),
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
        numberOfSongs: "",
        listOfSongs: "",
        releaseYear: "",
        artistId: "",
      });
    } catch (error) {
      console.error("Error saving album:", error);
      setError("Failed to save album. Please check artist ID and try again.");
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
        return album.releaseYear.toLowerCase().includes(input.toLowerCase());
      case "Genre":
        return album.genre.toLowerCase().includes(input.toLowerCase());
      case "Number of Songs":
        return album.numberOfSongs
          .toString()
          .toLowerCase()
          .includes(input.toLowerCase());
      case "List of Songs":
        return album.listOfSongs.toLowerCase().includes(input.toLowerCase());
      default:
        return true;
    }
  };

  const handleEdit = (album) => {
    console.log("Editing album:", album);
    setNewAlbum({
      id: album.id,
      title: album.title,
      artistId: album.artist?.id || "",
      releaseYear: album.releaseYear,
      genre: album.genre,
      numberOfSongs: album.numberOfSongs,
      listOfSongs: album.listOfSongs,
    });
  };

  const handleDelete = async (albumId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this album?"
    );
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

      <form onSubmit={(e) => e.preventDefault()}>
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
        <ul className="list">
          {albums.filter(filterAlbums).map((album) => (
            <li key={album.id} className="item">
              <div className="details">
                <h2 className="name">{album.title}</h2>
                <div className="info">
                  <p>
                    <strong>Artist: {album.artist?.name}</strong>
                  </p>
                  <p>
                    <strong>Release Year: {album.releaseYear}</strong>
                  </p>
                  <p>
                    <strong>Genre: {album.genre}</strong>
                  </p>
                  <p>
                    <strong>Number of Songs: {album.numberOfSongs}</strong>
                  </p>
                </div>
                <button onClick={() => handleEdit(album)}>Edit</button>
                <button
                  onClick={() => handleDelete(album.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

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
              numberOfSongs: "",
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
          type="number"
          placeholder="Number of Songs"
          value={newAlbum.numberOfSongs}
          onChange={(e) =>
            setNewAlbum({ ...newAlbum, numberOfSongs: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="List of Songs"
          value={newAlbum.listOfSongs}
          onChange={(e) =>
            setNewAlbum({ ...newAlbum, listOfSongs: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Release Year"
          value={newAlbum.releaseYear}
          onChange={(e) =>
            setNewAlbum({ ...newAlbum, releaseYear: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Artist ID"
          value={newAlbum.artistId}
          onChange={(e) =>
            setNewAlbum({ ...newAlbum, artistId: e.target.value })
          }
          required
        />

        <button type="submit">
          {newAlbum.id === null ? "Add Album" : "Update Album"}
        </button>
      </form>
    </div>
  );
}

export default Albums;
