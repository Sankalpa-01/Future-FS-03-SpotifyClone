import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

axios.defaults.withCredentials = true;

const UserContext = createContext();

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function registerUser(name, email, password, navigate, fetchSongs, fetchAlbums) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/api/user/register`,
        { name, email, password }, // ✅ actual request body
        { withCredentials: true }  // ✅ axios config
      );


      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchSongs();
      fetchAlbums();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
      setBtnLoading(false);
    }
  }

  async function loginUser(email, password, navigate, fetchSongs, fetchAlbums) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/api/user/login`,
        { email, password },       
        { withCredentials: true }   
      );


      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchSongs();
      fetchAlbums();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get(
        `${API}/api/user/me`,
        { withCredentials: true }
      );
      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
      setLoading(false);
    }
  }

  async function logoutUser() {
    try {
      const { data } = await axios.get(
        `${API}/api/user/logout`,
        { withCredentials: true }
      );
      toast.success(data.message);
      window.location.reload();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  }

  async function addToPlaylist(id) {
    try {
      const { data } = await axios.post(
        `${API}/api/user/song/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchUser();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add to playlist");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        registerUser,
        user,
        isAuth,
        btnLoading,
        loading,
        loginUser,
        logoutUser,
        addToPlaylist,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
