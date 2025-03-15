// src/service/api.js
import axios from "axios";

// Instanciando o axios com a URL base da API
const api = axios.create({
  baseURL: "http://localhost:8080/api", // URL base do seu backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
