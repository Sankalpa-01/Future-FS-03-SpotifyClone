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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [singer, setSinger] = useState("");
  const [album, setAlbum] = useState("");

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const addAlbumHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    addAlbum(formData, setTitle, setDescription, setFile);
  };

  const addSongHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("singer", singer);
    formData.append("album", album);
    formData.append("file", file);
    addSong(formData, setTitle, setDescription, setFile, setSinger, setAlbum);
  };

  const addThumbnailHandler = (id) => {
    const formData = new FormData();
    formData.append("file", file);
    addThumbnail(id, formData, setFile);
  };

  const deleteHandler = (id) => {
    if (confirm("Are you sure you want to delete this song?")) {
      deleteSong(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6 sm:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link
          to="/"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition"
        >
          Home
        </Link>
      </div>

      {/* Add Album */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Add Album</h2>
        <form
          onSubmit={addAlbumHandler}
          className="bg-[#262626] p-6 rounded-lg shadow-md space-y-4"
        >
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              type="text"
              className="auth-input w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <input
              type="text"
              className="auth-input w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Thumbnail</label>
            <input
              type="file"
              className="auth-input w-full"
              accept="image/*"
              onChange={fileChangeHandler}
              required
            />
          </div>
          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition w-full sm:w-32"
          >
            {loading ? "Please Wait..." : "Add Album"}
          </button>
        </form>
      </section>

      {/* Add Song */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Add Song</h2>
        <form
          onSubmit={addSongHandler}
          className="bg-[#262626] p-6 rounded-lg shadow-md space-y-4"
        >
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              type="text"
              className="auth-input w-full border-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <input
              type="text"
              className="auth-input w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Singer</label>
            <input
              type="text"
              className="auth-input w-full"
              value={singer}
              onChange={(e) => setSinger(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Select Album</label>
            <select
              className="auth-input w-full"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              required
            >
              <option value="">-- Select Album --</option>
              {albums &&
                albums.map((e, i) => (
                  <option key={i} value={e._id}>
                    {e.title}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Audio File</label>
            <input
              type="file"
              className="auth-input w-full"
              accept="audio/*"
              onChange={fileChangeHandler}
              required
            />
          </div>
          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition w-full sm:w-32"
          >
            {loading ? "Please Wait..." : "Add Song"}
          </button>
        </form>
      </section>

      {/* Songs List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Added Songs</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {songs &&
            songs.map((song, i) => (
              <div
                key={i}
                className="bg-[#262626] p-4 rounded-lg shadow-md flex flex-col items-center text-center"
              >
                {song.thumbnail ? (
                  <img
                    src={song.thumbnail.url}
                    alt={song.title}
                    className="w-48 h-48 object-cover rounded mb-4"
                  />
                ) : (
                  <div className="flex flex-col items-center mb-4">
                    <input
                      type="file"
                      onChange={fileChangeHandler}
                      className="text-sm mb-2"
                    />
                    <button
                      onClick={() => addThumbnailHandler(song._id)}
                      className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                    >
                      Add Thumbnail
                    </button>
                  </div>
                )}
                <h4 className="font-bold">{song.title}</h4>
                <p className="text-gray-400 text-sm">{song.singer}</p>
                <p className="text-gray-400 text-sm">{song.description}</p>
                <button
                  onClick={() => deleteHandler(song._id)}
                  className="mt-3 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  <MdDelete size={18} /> Delete
                </button>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Admin;
