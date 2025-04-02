import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Artists from "./components/artists";
import Albums from "./components/albums";
import Songs from "./components/songs";

function App() {
  return (
    <div>
      <h1>Tune Tracker</h1>
      <ul>
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

      <Routes>
        <Route path="/artists" element={<Artists />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/songs" element={<Songs />} />
      </Routes>
    </div>
  );
}

export default App;
