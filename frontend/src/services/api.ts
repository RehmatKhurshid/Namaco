import axios from "axios";

const API = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || 
  baseURL: "http://localhost:3000",
});

export default API;