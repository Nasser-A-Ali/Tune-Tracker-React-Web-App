// artists.jsx
// Artists component for the Tune Tracker React Web App
// Handles displaying, adding, editing, and deleting artist profiles

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../App.css";

/**
 * Artists component
 * Manages the list of artists, including CRUD operations and filtering.
 */
function Artists() {
  // State for artist data, loading, error, and form input
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const formRef = useRef(null);

  // Chooses the API URL based on the environment (local or production)
  const databaseLink = process.env.REACT_APP_API_URL || "http://localhost:8080";

  // State for the artist form (add/edit)
  const [newArtist, setNewArtist] = useState({
    id: null,
    name: "",
    debutYear: "",
    genre: "",
    country: "",
  });

  // Fetch artists on mount
  useEffect(() => {
    axios
      .get(`${databaseLink}/artists`)
      .then((response) => {
        setArtists(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching artists");
        setLoading(false);
      });
  }, [databaseLink]);

  /**
   * Handles form submission for adding or updating an artist
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields are filled
    if (
        !newArtist.name || !newArtist.debutYear || !newArtist.genre || !newArtist.country
    ){
      setError("Please fill all fields");
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }

    try {
      const artistData = {
        name: newArtist.name,
        debutYear: parseInt(newArtist.debutYear),
        genre: newArtist.genre,
        country: newArtist.country,
      };

      if (newArtist.id === null) {
        // Add new artist
        await axios.post(`${databaseLink}/artist`, artistData);
      } else {
        // Update existing artist
        await axios.put(`${databaseLink}/artist/${newArtist.id}`, artistData);
      }

      // Refresh artist list
      const refreshed = await axios.get(`${databaseLink}/artists`);
      setArtists(refreshed.data);

      // Reset form
      setNewArtist({
        id: null,
        name: "",
        debutYear: "",
        genre: "",
        country: "",
      });
    } catch (error) {
      console.error("Error saving artist:", error);
      setError("Failed to save artist. Please check artist ID and try again.");
    }
  };

  /**
   * Handles filter option change
   */
  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  /**
   * Returns true if the artist matches the current filter
   */
  const filterArtists = (artist) => {
    if (!input) return true;

    switch (filterOption) {
      case "Artist":
        return (
          artist.name && artist.name.toLowerCase().includes(input.toLowerCase())
        );
      case "Debut Year":
        return artist.debutYear.toString().includes(input);
      case "Genre":
        return (
          artist.genre &&
          artist.genre.toLowerCase().includes(input.toLowerCase())
        );
      case "Country":
        return (
          artist.country &&
          artist.country.toLowerCase().includes(input.toLowerCase())
        );
      default:
        return true;
    }
  };

  /**
   * Populates the form for editing an artist
   */
  const handleEdit = (artist) => {
    setNewArtist({
      id: artist.id,
      name: artist.name,
      debutYear: artist.debutYear,
      genre: artist.genre,
      country: artist.country,
    });
  };

  /**
   * Deletes an artist by ID after confirmation
   */
  const handleDelete = async (artistId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this artist?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(`${databaseLink}/artist/${artistId}`);
        // Refresh artist list
        const refreshed = await axios.get(`${databaseLink}/artists`);
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

  return (
    <div>
      <h1>Artists</h1>

      {/* Display error messages */}
      {error && <div className="error-message">{error}</div>}

      <div className="SearchAddEditContainer">
        {/* Search/filter section */}
        <div id="Search">
          <h2>Search by:</h2>
          <div className="search-bar-content">
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
          </div>
        </div>

        {/* Add/Edit artist form */}
        <div id="AddEdit" ref={formRef}>
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
              onChange={(e) =>
                setNewArtist({ ...newArtist, name: e.target.value })
              }
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
      </div>

      {/* List of artists */}
      <ul className="list">
        {artists.filter(filterArtists).map((artist) => (
          <li key={artist.id} className="item">
            <div className="details">
              <h2 className="name">
                {artist.name}
                <span className="header-id"> #{artist.id}</span>
              </h2>
              <div className="info">
                <p>
                  <strong>Debut Year:</strong> {artist.debutYear}
                </p>
                <p>
                  <strong>Genre:</strong> {artist.genre}
                </p>
                <p>
                  <strong>Country:</strong> {artist.country}
                  <div className="button-group">
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
                  </div>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Artists;
