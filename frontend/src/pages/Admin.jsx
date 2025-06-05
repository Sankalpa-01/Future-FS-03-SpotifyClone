import React, { useState } from "react";
import { UserData } from "../context/User";
import { Link, useNavigate } from "react-router-dom";
import { SongData } from "../context/Song";
import { MdDelete } from "react-icons/md";

const Admin = () => {
  const { user } = UserData();
  const {
    albums,
    songs,
    addAlbum,
    loading,
    addSong,
    addThumbnail,
    deleteSong,
  } = SongData();
  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  // Album Form State
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [albumThumbnail, setAlbumThumbnail] = useState(null);

  // Song Form State
  const [songTitle, setSongTitle] = useState("");
  const [songDescription, setSongDescription] = useState("");
  const [songSinger, setSongSinger] = useState("");
  const [songAlbum, setSongAlbum] = useState("");
  const [songAudioFile, setSongAudioFile] = useState(null);

  const handleAlbumThumbnailChange = (e) => {
    setAlbumThumbnail(e.target.files[0]);
  };

  const handleSongAudioChange = (e) => {
    setSongAudioFile(e.target.files[0]);
  };

  const handleAddAlbum = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", albumTitle);
    formData.append("description", albumDescription);
    formData.append("file", albumThumbnail);
    addAlbum(formData, setAlbumTitle, setAlbumDescription, setAlbumThumbnail);
  };

  const handleAddSong = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", songTitle);
    formData.append("description", songDescription);
    formData.append("singer", songSinger);
    formData.append("album", songAlbum);
    formData.append("file", songAudioFile);
    addSong(
      formData,
      setSongTitle,
      setSongDescription,
      setSongAudioFile,
      setSongSinger,
      setSongAlbum
    );
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this song?")) {
      deleteSong(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#212121] text-white p-8">
      <Link
        to="/"
        className="bg-green-500 text-white font-bold py-2 px-4 rounded-full"
      >
        Go to home page
      </Link>

      {/* Add Album Form */}
      <h2 className="text-2xl font-bold mb-6 mt-6">Add Album</h2>
      <form
        onSubmit={handleAddAlbum}
        className="bg-[#181818] p-6 rounded-lg shadow-lg"
      >
        <input
          type="text"
          placeholder="Album Title"
          className="auth-input mb-4"
          value={albumTitle}
          onChange={(e) => setAlbumTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Album Description"
          className="auth-input mb-4"
          value={albumDescription}
          onChange={(e) => setAlbumDescription(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          className="auth-input mb-4"
          onChange={handleAlbumThumbnailChange}
          required
        />
        <button
          disabled={loading}
          className="auth-btn"
          style={{ width: "100px" }}
        >
          {loading ? "Please Wait..." : "Add"}
        </button>
      </form>

      {/* Add Song Form */}
      <h2 className="text-2xl font-bold mb-6 mt-6">Add Song</h2>
      <form
        onSubmit={handleAddSong}
        className="bg-[#181818] p-6 rounded-lg shadow-lg"
      >
        <input
          type="text"
          placeholder="Song Title"
          className="auth-input mb-4"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Song Description"
          className="auth-input mb-4"
          value={songDescription}
          onChange={(e) => setSongDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Singer"
          className="auth-input mb-4"
          value={songSinger}
          onChange={(e) => setSongSinger(e.target.value)}
          required
        />
        <select
          className="auth-input mb-4"
          value={songAlbum}
          onChange={(e) => setSongAlbum(e.target.value)}
          required
        >
          <option value="">Choose Album</option>
          {albums.map((album) => (
            <option key={album._id} value={album._id}>
              {album.title}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="audio/*"
          className="auth-input mb-4"
          onChange={handleSongAudioChange}
          required
        />
        <button
          disabled={loading}
          className="auth-btn"
          style={{ width: "100px" }}
        >
          {loading ? "Please Wait..." : "Add"}
        </button>
      </form>

      {/* Songs List */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Added Songs</h3>
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          {songs.map((song) => {
            const [thumbFile, setThumbFile] = useState(null);

            const handleThumbChange = (e) => {
              setThumbFile(e.target.files[0]);
            };

            const uploadThumbnail = () => {
              if (!thumbFile) return;
              const formData = new FormData();
              formData.append("file", thumbFile);
              addThumbnail(song._id, formData, () => setThumbFile(null));
            };

            return (
              <div
                key={song._id}
                className="bg-[#181818] p-4 rounded-lg shadow-md w-60"
              >
                {song.thumbnail ? (
                  <img
                    src={song.thumbnail.url}
                    alt={song.title}
                    className="w-52 h-52 object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <input type="file" onChange={handleThumbChange} />
                    <button
                      onClick={uploadThumbnail}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Add Thumbnail
                    </button>
                  </div>
                )}
                <h4 className="text-lg font-bold mt-2">{song.title}</h4>
                <p className="text-sm text-gray-400">{song.singer}</p>
                <p className="text-sm text-gray-500">{song.description}</p>
                <button
                  onClick={() => handleDelete(song._id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
                >
                  <MdDelete />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Admin;
