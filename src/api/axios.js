import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // backend Laravel kamu
  withCredentials: true, // penting untuk kirim cookie CSRF + session
});

export default api;
