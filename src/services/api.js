import axios from "axios";

const api = axios.create({
  baseURL: "http://46.250.227.211:8085/api",
  headers: {
    "X-API-KEY": "SpmZ8MjWL1*X!S}-rnL&85rP&z>}#nob", // replace with your real API key
    "Content-Type": "application/json",
  },
});

export default api;