import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const SongContext = createContext();

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const SongProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [songLoading, setSongLoading] = useState(true);

  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [song, setSong] = useState([]);

  const [index, setIndex] = useState(0);

  const [albums, setAlbums] = useState([]);
  const [albumSong, setAlbumSong] = useState([]);
  const [albumData, setAlbumData] = useState([]);

  // Fetch all songs
  async function fetchSongs() {
    try {
      const { data } = await axios.get(
        `${API}/api/song/all`,
        { withCredentials: true }
      );
      setSongs(data);
      if (data.length > 0) {
        setSelectedSong(data[0]._id);
        setIndex(0);
      }
      setIsPlaying(false);
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch a single song by selectedSong ID
  async function fetchSingleSong() {
    if (!selectedSong) {
      console.warn("No song selected to fetch");
      return;
    }

    try {
      const { data } = await axios.get(
        `${API}/api/song/single/` + selectedSong,
        { withCredentials: true }
      );
      setSong(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Add album
  async function addAlbum(formData, setTitle, setDescription, setFile) {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/api/song/album/new`,
        formData,
        { withCredentials: true }
      );
      toast.success(data.message);
      setLoading(false);
      fetchAlbums();
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add album");
      setLoading(false);
    }
  }

  // Add song
  async function addSong(formData, setTitle, setDescription, setFile, setSinger, setAlbum) {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/api/song/new`,
        formData,
        { withCredentials: true }
      );
      toast.success(data.message);
      setLoading(false);
      fetchSongs();
      setTitle("");
      setDescription("");
      setFile(null);
      setSinger("");
      setAlbum("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add song");
      setLoading(false);
    }
  }

  // Add thumbnail
  async function addThumbnail(id, formData, setFile) {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/api/song/` + id,
        formData,
        { withCredentials: true }
      );
      toast.success(data.message);
      setLoading(false);
      fetchSongs();
      setFile(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload thumbnail");
      setLoading(false);
    }
  }

  // Fetch all albums
  async function fetchAlbums() {
    try {
      const { data } = await axios.get(
        `${API}/api/song/album/all`,
        { withCredentials: true }
      );
      setAlbums(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Delete song
  async function deleteSong(id) {
    try {
      const { data } = await axios.delete(
        `${API}/api/song/` + id,
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchSongs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete song");
    }
  }

  // Next and Previous music navigation
  function nextMusic() {
    if (songs.length === 0) return;
    const nextIndex = (index + 1) % songs.length;
    setIndex(nextIndex);
    setSelectedSong(songs[nextIndex]._id);
  }

  function prevMusic() {
    if (songs.length === 0 || index === 0) return;
    const prevIndex = index - 1;
    setIndex(prevIndex);
    setSelectedSong(songs[prevIndex]._id);
  }

  // Fetch album songs
  async function fetchAlbumSong(id) {
    try {
      const { data } = await axios.get(
        `${API}/api/song/album/` + id,
        { withCredentials: true }
      );
      setAlbumSong(data.songs);
      setAlbumData(data.album);
    } catch (error) {
      console.log(error);
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, []);

  return (
    <SongContext.Provider
      value={{
        songs,
        addAlbum,
        loading,
        songLoading,
        albums,
        addSong,
        addThumbnail,
        deleteSong,
        fetchSingleSong,
        song,
        setSelectedSong,
        isPlaying,
        setIsPlaying,
        selectedSong,
        nextMusic,
        prevMusic,
        fetchAlbumSong,
        albumSong,
        albumData,
        fetchSongs,
        fetchAlbums,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const SongData = () => useContext(SongContext);
