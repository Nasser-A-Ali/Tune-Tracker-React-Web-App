import React, { useState, useEffect } from "react";
import axios from "axios";

const albums = () => {

    function Albums() {
        const [albums, setAlbums] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            axios
                .get("http://localhost:8080/albums")
                .then((response) => {
                    setAlbums(response.data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError("Error fetching albums");
                    setLoading(false);
                });
        }, []);

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

    }


    return (
        <div>
            <h1>Albums</h1>
            {albums.length === 0 ? (
                <div>No albums available</div>
            ) : (
                <ul>
                    {albums.map((album) => (
                        <li key={album.id}>
                            <h2>{album.title}</h2>
                            <p>Artist: {album.artist}</p>
                            <p>Release Year: {album.releaseYear}</p>
                            <p>Country: {album.country}</p>
                            <p>Genre: {album.genre}</p>
                            <ul>
                                <p>List of Songs:</p>
                                {album.songs && album.songs.map((song) => (
                                    <li key={song.id}>{song.title}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default albums;
