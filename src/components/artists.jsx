import React, { useState, useEffect } from "react";
import axios from "axios";

function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Artists</h1>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>
            <h2>{artist.name}</h2>
            <p>Debut Year: {artist.debutYear}</p>
            <p>Genre: {artist.genre}</p>
            <p>Country: {artist.country}</p>
            <p>Test</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Artists;
