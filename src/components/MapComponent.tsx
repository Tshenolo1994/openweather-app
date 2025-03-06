import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "../context/ThemeContext";

const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

if (!mapboxAccessToken) {
  throw new Error(
    "Mapbox access token is missing. Please check your .env file."
  );
}

mapboxgl.accessToken = mapboxAccessToken;

interface MapComponentProps {
  onLocationSelect: (lat: number, lon: number) => void;
  center: [number, number];
  className?: string;
  fullScreenOnMobile?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
  onLocationSelect,
  center,
  className = "",
  fullScreenOnMobile = false,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const { theme } = useTheme();
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/light-v11");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const isDarkTheme = theme.text.includes("white");

  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    if (map.current) {
      map.current.resize();

      if (mobile) {
        map.current.setZoom(map.current.getZoom() - 0.5);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    setMapStyle(
      isDarkTheme
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11"
    );
  }, [isDarkTheme]);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: mapStyle,
        center: center,
        zoom: 2,
        attributionControl: false,
        pitchWithRotate: !isMobile,
        dragRotate: !isMobile,
      });

      if (!isMobile) {
        map.current.addControl(
          new mapboxgl.NavigationControl({
            showCompass: true,
            visualizePitch: true,
          }),
          "bottom-right"
        );
      } else {
        map.current.addControl(
          new mapboxgl.NavigationControl({
            showCompass: false,
            visualizePitch: false,
            showZoom: true,
          }),
          "bottom-right"
        );
      }

      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        }),
        "bottom-right"
      );

      marker.current = new mapboxgl.Marker({
        color: isDarkTheme ? "#93c5fd" : "#3b82f6",
        draggable: true,
      })
        .setLngLat(center)
        .addTo(map.current);

      map.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        onLocationSelect(lat, lng);

        if (marker.current) {
          marker.current.setLngLat([lng, lat]);
        }
      });

      if (marker.current) {
        marker.current.on("dragend", () => {
          const lngLat = marker.current!.getLngLat();
          onLocationSelect(lngLat.lat, lngLat.lng);
        });
      }

      map.current.addControl(
        new mapboxgl.ScaleControl({ maxWidth: isMobile ? 100 : 150 }),
        "bottom-left"
      );
    } else {
      map.current.setStyle(mapStyle);
      map.current.flyTo({
        center: center,
        zoom: isMobile ? 11 : 12,
        essential: true,
      });

      if (marker.current) {
        marker.current.setLngLat(center);
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, onLocationSelect, mapStyle, isMobile]);

  useEffect(() => {
    if (map.current) {
      map.current.resize();
    }
  }, [isFullScreen]);

  return (
    <div
      className={`relative ${
        isFullScreen ? "fixed inset-0 z-50" : "h-full w-full"
      } rounded-lg overflow-hidden shadow-lg ${className}`}
    >
      <div ref={mapContainer} className="h-full w-full" />

      <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hidden sm:block">
        Current Location
      </div>

      {fullScreenOnMobile && isMobile && (
        <button
          className="absolute top-4 right-4 bg-white/80 dark:bg-black/50 p-2 rounded-full shadow-lg z-10"
          onClick={() => {
            setIsFullScreen((prev) => !prev);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MapComponent;
