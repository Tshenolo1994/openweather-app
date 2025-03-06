export interface Weather {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number;
  clouds?: {
    all: number;
  };
  visibility: number;
}

export interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
}
