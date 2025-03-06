import React from "react";
import { Weather } from "../types/weather";
import {
  FaTint,
  FaWind,
  FaSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaTimes,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

interface WeatherModalProps {
  weatherData: Weather | null;
  onClose: () => void;
}

const WeatherModal: React.FC<WeatherModalProps> = ({
  weatherData,
  onClose,
}) => {
  const { theme } = useTheme();

  if (!weatherData) return null;

  const getWeatherIcon = (condition: string) => {
    const isDark = theme.text.includes("white");

    switch (condition.toLowerCase()) {
      case "clear":
        return (
          <FaSun
            className={`${
              isDark ? "text-yellow-300" : "text-yellow-400"
            } text-4xl`}
          />
        );
      case "clouds":
        return (
          <FaCloud
            className={`${isDark ? "text-gray-200" : "text-gray-400"} text-4xl`}
          />
        );
      case "rain":
        return (
          <FaCloudRain
            className={`${isDark ? "text-blue-300" : "text-blue-400"} text-4xl`}
          />
        );
      case "thunderstorm":
        return (
          <div className="relative">
            <FaCloud
              className={`${
                isDark ? "text-gray-200" : "text-gray-400"
              } text-4xl`}
            />
            <span
              className={`absolute -bottom-1 -right-1 ${
                isDark ? "text-yellow-300" : "text-yellow-400"
              } text-lg`}
            >
              ⚡
            </span>
          </div>
        );
      case "snow":
        return (
          <FaSnowflake
            className={`${isDark ? "text-blue-100" : "text-blue-200"} text-4xl`}
          />
        );
      default:
        return (
          <FaCloud
            className={`${isDark ? "text-gray-200" : "text-gray-400"} text-4xl`}
          />
        );
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed inset-0 flex justify-start z-50 pointer-events-none">
      <div
        className={`${theme.background} backdrop-blur-lg w-full md:w-96 h-full shadow-2xl border-r ${theme.border} pointer-events-auto transition-all duration-300 ease-in-out`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors`}
        >
          <FaTimes />
        </button>

        <div className="p-4 md:p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className={`text-2xl font-bold ${theme.text}`}>
              {weatherData.name}
            </h2>
            <span className={`${theme.accent} text-sm font-medium`}>
              {weatherData.sys.country}
            </span>
          </div>

          <p className={`${theme.accent} text-sm`}>
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
            {" • "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <div className="flex items-center justify-center my-8">
            <div className="mr-6">
              {getWeatherIcon(weatherData.weather[0].main)}
            </div>
            <div>
              <p className={`text-6xl font-bold ${theme.text}`}>
                {Math.round(weatherData.main.temp)}°
              </p>
              <p className={`${theme.accent} text-sm capitalize`}>
                {weatherData.weather[0].description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className={`${theme.cardBackground} rounded-lg p-4 backdrop-blur-sm`}
            >
              <p className={`${theme.accent} text-sm font-medium`}>
                Feels Like
              </p>
              <p className={`${theme.text} text-xl font-semibold`}>
                {Math.round(weatherData.main.feels_like)}°
              </p>
            </div>
            <div
              className={`${theme.cardBackground} rounded-lg p-4 backdrop-blur-sm`}
            >
              <p className={`${theme.accent} text-sm font-medium`}>
                High / Low
              </p>
              <p className={`${theme.text} text-xl font-semibold`}>
                {Math.round(weatherData.main.temp_max)}° /{" "}
                {Math.round(weatherData.main.temp_min)}°
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-2">
            <div
              className={`flex items-center gap-4 ${theme.cardBackground} rounded-lg p-4 backdrop-blur-sm`}
            >
              <FaTint className={`${theme.accent} text-2xl`} />
              <div>
                <p className={`text-sm ${theme.accent}`}>Humidity</p>
                <p className={`text-lg font-semibold ${theme.text}`}>
                  {weatherData.main.humidity}%
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-4 ${theme.cardBackground} rounded-lg p-4 backdrop-blur-sm`}
            >
              <FaWind className={`${theme.accent} text-2xl`} />
              <div>
                <p className={`text-sm ${theme.accent}`}>Wind Speed</p>
                <p className={`text-lg font-semibold ${theme.text}`}>
                  {weatherData.wind.speed} m/s
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${theme.cardBackground} rounded-lg p-4 mt-4 backdrop-blur-sm`}
          >
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className={`${theme.accent} text-sm mb-1`}>Sunrise</p>
                <div className="flex items-center">
                  <FaSun className="text-yellow-400 mr-1 text-sm" />
                  <p className={`${theme.text} font-medium`}>
                    {formatTime(weatherData.sys.sunrise)}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className={`${theme.accent} text-sm mb-1`}>Sunset</p>
                <div className="flex items-center">
                  <FaSun className="text-orange-400 mr-1 text-sm" />
                  <p className={`${theme.text} font-medium`}>
                    {formatTime(weatherData.sys.sunset)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherModal;
