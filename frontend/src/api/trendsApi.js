import axios from "axios";

export const fetchTrends = async (country = "IN") => {
  const res = await axios.get(`http://localhost:5000/api/trends?country=${country}`);
  return res.data;
};
