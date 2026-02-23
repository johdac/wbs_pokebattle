import axios from "axios";

const GAME_URL = "http://localhost:3000";

export const gameApi = axios.create({
  baseURL: GAME_URL,
});

gameApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
