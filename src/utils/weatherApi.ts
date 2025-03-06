
export const fetchWeatherByCoordinates = async (lat: number, lon: number) => {
    const response = await fetch(`http://localhost:3000/api/weather?lat=${lat}&lon=${lon}`);
    return response.json();
  };
  
  export const searchCity = async (query: string) => {
    const response = await fetch(`http://localhost:3000/api/search?q=${query}`);
    return response.json();
  };