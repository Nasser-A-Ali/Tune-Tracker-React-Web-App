import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Artists from "./components/artists";
import Albums from "./components/albums";
import Songs from "./components/songs";
import Footer from "./components/footer";

function App() {
  return (
    <div>
      <div id="header">
        <h1>🎧 Tune Tracker 🎧</h1>
        <ul id="NavBar">
          <li>
            <Link to="/artists">Artists</Link>
          </li>
          <li>
            <Link to="/albums">Albums</Link>
          </li>
          <li>
            <Link to="/songs">Songs</Link>
          </li>
        </ul>
      </div>
        <div id="welcome-container">
            <h2 id="welcome">
                Welcome to Tune Tracker, where you can <em>add, update</em> and <em>delete</em>- <em>songs, albums</em> and <em>artists!</em>
            </h2>
            <p className="app-description">
                To get started, choose 1 of the 3 options in the navigation bar- Artists, Albums or Songs!
            </p>
            <p className="app-description">
                On each page, you can view and update existing entries, delete them, or add your own to achieve your
                personally curated music library!
            </p>
            <p id="hint">
                <em>hint: </em> to add a <em>song,</em> you need to have an existing <em>artist.</em> and to add an <em>album,</em> you need to have
                an existing <em>artist,</em> and one or more existing <em>songs.</em>
            </p>
        </div>

      <Routes>
        <Route path="/artists" element={<Artists />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/songs" element={<Songs />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
