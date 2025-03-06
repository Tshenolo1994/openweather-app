import React, { useState, useEffect, useRef } from "react";
import MapComponent from "../components/MapComponent";
import WeatherModal from "../components/WeatherModal";
import SearchBar from "../components/SearchBar";
import { fetchWeatherByCoordinates } from "../utils/weatherApi";
import { Weather } from "../types/weather";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { LuClock3 } from "react-icons/lu";
import { IoLocationSharp } from "react-icons/io5";
import { ImSpinner8 } from "react-icons/im";

const HomePage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<Weather | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );
  const [currentLocation, setCurrentLocation] = useState<string>(
    "Loading location..."
  );
  const intervalRef = useRef<number | null>(null);
  const isDark = theme.text.includes("white");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();
    intervalRef.current = window.setInterval(updateTime, 60000);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);

          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
            .then((response) => response.json())
            .then((data) => {
              setCurrentLocation(`${data.city}, ${data.countryName}`);
            })
            .catch(() => {
              setCurrentLocation("Unknown Location");
            });
        },
        () => {
          setCurrentLocation("Location access denied");
        }
      );
    } else {
      setCurrentLocation("Geolocation not supported");
    }
  }, []);

  const handleLocationSelect = async (lat: number, lon: number) => {
    setMapCenter([lat, lon]);
    try {
      setIsLoading(true);
      const data = await fetchWeatherByCoordinates(lat, lon);
      const weatherData: Weather = {
        ...data,
        sys: {
          country: data.sys?.country || "",
          sunrise: data.sys?.sunrise || 0,
          sunset: data.sys?.sunset || 0,
          type: data.sys?.type,
          id: data.sys?.id,
        },
        dt: data.dt || Math.floor(Date.now() / 1000),
        timezone: data.timezone || 0,
        visibility: data.visibility || 0,
        clouds: data.clouds || { all: 0 },
      };
      setWeatherData(weatherData);
      setIsModalOpen(true);
    } catch (error) {
      alert("Failed to fetch weather data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (lat: number, lon: number, name: string) => {
    setMapCenter([lat, lon]);
    try {
      setIsLoading(true);
      const data = await fetchWeatherByCoordinates(lat, lon);
      const weatherData: Weather = {
        ...data,
        name,
        sys: {
          country: data.sys?.country || "",
          sunrise: data.sys?.sunrise || 0,
          sunset: data.sys?.sunset || 0,
          type: data.sys?.type,
          id: data.sys?.id,
        },
        dt: data.dt || Math.floor(Date.now() / 1000),
        timezone: data.timezone || 0,
        visibility: data.visibility || 0,
        clouds: data.clouds || { all: 0 },
      };
      setWeatherData(weatherData);
      setIsModalOpen(true);
    } catch (error) {
      alert("Failed to fetch weather data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-screen ${theme.background}`}>
      <div className={`p-4 border-b ${theme.border} backdrop-blur-sm`}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="hidden md:flex">
            <div className="flex justify-start items-center gap-4">
              <LuClock3
                className={`${
                  isDark ? "text-blue-100" : "text-blue-200"
                } text-4xl`}
              />
              <p className={`text-4xl font-bold ${theme.text}`}>
                {currentTime}
              </p>
            </div>
            <div className="flex justify-start items-center gap-4">
              <IoLocationSharp
                className={`${
                  isDark ? "text-blue-100" : "text-blue-200"
                } text-4xl`}
              />
              <p className={`text-lg ${theme.text} mt-1`}>{currentLocation}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <SearchBar onSearch={handleSearch} />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="flex-1">
        <MapComponent
          onLocationSelect={handleLocationSelect}
          center={mapCenter}
        />
      </div>

      {isModalOpen && weatherData && (
        <WeatherModal
          weatherData={weatherData}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <ImSpinner8 className="animate-spin text-6xl text-white" />
        </div>
      )}
    </div>
  );
};

export default HomePage;
