import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [filterOption, setFilterOption] = useState("");

  const [newArtist, setNewArtist] = useState({
    id: null,
    name: "",
    debutYear: "",
    genre: "",
    country: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/artists")
      .then((response) => {
        setArtists(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching artists");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const artistData = {
        name: newArtist.name,
        debutYear: parseInt(newArtist.debutYear),
        genre: newArtist.genre,
        country: newArtist.country,
      };

      if (newArtist.id === null) {
        await axios.post("http://localhost:8080/artist", artistData);
      } else {
        await axios.put(
          `http://localhost:8080/artist/${newArtist.id}`,
          artistData
        );
      }

      const refreshed = await axios.get("http://localhost:8080/artists");
      setArtists(refreshed.data);

      setNewArtist({
        id: null,
        name: "",
        debutYear: "",
        genre: "",
        country: "",
      });
    } catch (error) {
      console.error("Error saving artist:", error);
      setError("Failed to save song. Please check artist ID and try again.");
    }
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  const filterArtists = (artist) => {
    if (!input) return true;

    switch (filterOption) {
      case "Artist":
        return artist.name.toLowerCase().includes(input.toLowerCase());
      case "Debut Year":
        return artist.debutYear.toString().includes(input);
      case "Genre":
        return artist.genre.toLowerCase().includes(input.toLowerCase());
      case "Country":
        return artist.country.toLowerCase().includes(input.toLowerCase());
      default:
        return true;
    }
  };

  const handleEdit = (artist) => {
    console.log("Editing artist:", artist);
    setNewArtist({
      id: artist.id,
      name: artist.name,
      debutYear: artist.debutYear,
      genre: artist.genre,
      country: artist.country,
    });
  };

  const handleDelete = async (artistId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this artist?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/artist/${artistId}`);

        const refreshed = await axios.get("http://localhost:8080/artists");
        setArtists(refreshed.data);
      } catch (error) {
        console.error("Error deleting artist:", error);
        setError("Failed to delete artist. Please try again.");
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
      <h1>Artists</h1>

      <h2>Search by:</h2>
      <select value={filterOption} onChange={handleFilterChange}>
        <option value="">Select Filter</option>
        <option value="Artist">Artist</option>
        <option value="Debut Year">Debut Year</option>
        <option value="Genre">Genre</option>
        <option value="Country">Country</option>
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

      <ul className="list">
        {artists.filter(filterArtists).map((artist) => (
          <li key={artist.id} className="item">
            <div className="details">
              <h2 className="name">{artist.name}</h2>
              <div className="info">
                <p>
                  <strong>Debut Year:</strong> {artist.debutYear}
                </p>
                <p>
                  <strong>Genre:</strong> {artist.genre}
                </p>
                <p>
                  <strong>Country:</strong> {artist.country}
                  <button id="EditButton" onClick={() => handleEdit(artist)}>
                    Edit
                  </button>
                  <button
                    id="DeleteButton"
                    onClick={() => handleDelete(artist.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <h2>{newArtist.id === null ? "Add New Artist" : "Update Artist"}</h2>
      {newArtist.id !== null && (
        <button
          onClick={() =>
            setNewArtist({
              id: null,
              name: "",
              debutYear: "",
              genre: "",
              country: "",
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
          placeholder="Artist"
          value={newArtist.name}
          onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Debut Year"
          value={newArtist.debutYear}
          onChange={(e) =>
            setNewArtist({ ...newArtist, debutYear: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={newArtist.genre}
          onChange={(e) =>
            setNewArtist({ ...newArtist, genre: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Country"
          value={newArtist.country}
          onChange={(e) =>
            setNewArtist({ ...newArtist, country: e.target.value })
          }
          required
        />

        <button type="submit">
          {newArtist.id === null ? "Add Artist" : "Update Artist"}
        </button>
      </form>
    </div>
  );
}

export default Artists;
