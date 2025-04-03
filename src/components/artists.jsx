import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [filterOption, setFilterOption] = useState("");

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
