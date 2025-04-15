// home.jsx
// Home component for the Tune Tracker React Web App
// Displays the welcome message and app description

import React from "react";
import "../App.css";

/**
 * Home component
 * Renders the landing page with instructions for using the app.
 */
function Home() {
  return (
    <div className="home-container">
      {/* Main welcome header */}
      <h1>Welcome to Tune Tracker</h1>
      {/* App description */}
      <p>
        Tune Tracker is your one-stop solution for managing your favorite
        artists, albums, and songs.
      </p>
      {/* Step-by-step instructions for new users */}
      <p>To get started, please follow these steps:</p>
      <ol>
        <li>Add an artist to the database.</li>
        <li>Add songs associated with the artist.</li>
        <li>Create albums and link them to the artist and songs.</li>
      </ol>
      {/* Navigation instructions */}
      <p>
        Use the navigation bar above to access the Artists, Albums, and Songs
        sections. Enjoy exploring your music collection!
      </p>
    </div>
  );
}

export default Home;
