// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // URL backend Laravel
  withCredentials: true,             // penting! agar Sanctum cookie tersimpan
  headers: {
    "Accept": "application/json",
  },
});

export default api;
