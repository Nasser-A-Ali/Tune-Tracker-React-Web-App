import React from "react";
import "../App.css";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Tune Tracker</h1>
      <p>
        Tune Tracker is your one-stop solution for managing your favorite
        artists, albums, and songs.
      </p>
      <p>To get started, please follow these steps:</p>
      <ol>
        <li>Add an artist to the database.</li>
        <li>Add songs associated with the artist.</li>
        <li>Create albums and link them to the artist and songs.</li>
      </ol>
      <p>
        Use the navigation bar above to access the Artists, Albums, and Songs
        sections. Enjoy exploring your music collection!
      </p>
    </div>
  );
}

export default Home;
