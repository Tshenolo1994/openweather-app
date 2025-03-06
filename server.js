import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

const OPENWEATHER_API_KEY = "6f6219a4c7185e967015a8791e1e5f55";

app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("/api/search", async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get(
      "https://api.openweathermap.org/geo/1.0/direct",
      {
        params: {
          q,
          limit: 5,
          appid: OPENWEATHER_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching city data:", error);
    res.status(500).json({ error: "Failed to fetch city data" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
