"use client";

import { useState } from "react";
import "dotenv/config";

interface WeatherData {
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
        country: string;
        sunrise: number;
        sunset: number;
    };
    coord: {
        lat: number;
        lon: number;
    };
    timezone: number;
}

interface CitySuggestion {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

interface AirPollutionData {
    list: {
        main: {
            aqi: number;
        };
        components: {
            co: number;
            no: number;
            no2: number;
            o3: number;
            so2: number;
            pm2_5: number;
            pm10: number;
            nh3: number;
        };
        dt: number;
    }[];
}

import WeatherDetails from "./components/container/WeatherDetails";
import WeatherHeader from "./components/container/WeatherHeader";
import AirQualityDetails from "./components/container/AirQualityDetails";
import CityMap from "./components/container/CityMap";
import SunriseSunsetDetails from "./components/container/SunriseSunsetDetails";
import RecommendedCities from "./components/search/RecommendedCities";
import ErrorMessage from "./components/messages/ErrorMessage";
import SearchBox from "./components/search/SearchBox";

export default function CityData() {
    const [weather_data, set_weather_data] = useState<WeatherData | null>(null);
    const [location_data, set_location_data] = useState<string>("");
    const [suggestions, set_suggestions] = useState<CitySuggestion[]>([]);
    const [error, set_error] = useState<string | null>(null);

    const [air_quality_data, set_air_quality_data] =
        useState<AirPollutionData | null>(null);

    const recommendedCities = [
        "Paris, France",
        "London, UK",
        "Rome, Italy",
        "Istanbul, Turkey",
        "New York, US",
        "Tokyo, JP",
        "São Paulo, BR",
        "Cairo, EG",
        "Delhi, IN",
    ];

    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    const fetch_weather = (location_query: string) => {
        set_suggestions([]);
        set_error(null);
        set_weather_data(null);
        set_air_quality_data(null);

        const weather_api_url = `https://api.openweathermap.org/data/2.5/weather?q=${location_query}&appid=${API_KEY}&units=metric`;

        if (!location_query) return set_error("Please enter a city name.");

        fetch(weather_api_url)
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 404)
                        throw new Error("City not found.");
                    else
                        throw new Error(
                            `Network response was not OK: ${response.status}`
                        );
                }
                return response.json();
            })
            .then((data: WeatherData) => {
                set_weather_data(data);
                const { lat, lon } = data.coord;
                const air_pollution_url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
                return fetch(air_pollution_url);
            })
            .then((response) => {
                if (!response.ok)
                    throw new Error(
                        `Failed to fetch air quality data: ${response.status}`
                    );
                return response.json();
            })
            .then((data: AirPollutionData) => {
                set_air_quality_data(data);
            })
            .catch((error) => {
                set_weather_data(null);
                set_air_quality_data(null);
                set_error(error.message);
            });
    };

    const handle_input_change = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const query = event.target.value;
        set_location_data(query);
        set_weather_data(null);
        set_air_quality_data(null);
        set_error(null);

        const geo_url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;

        if (query.length > 1) {
            fetch(geo_url)
                .then((response) => {
                    if (!response.ok)
                        throw new Error(
                            `Network response for suggestions was not OK: ${response.status}`
                        );
                    return response.json();
                })
                .then((data: CitySuggestion[]) => {
                    set_suggestions(data.slice(0, 3));
                })
                .catch((error) => {
                    set_suggestions([]);
                });
        } else set_suggestions([]);
    };

    const handle_recommended_click = (city_name: string) => {
        set_location_data(city_name);
        set_suggestions([]);
        fetch_weather(city_name);
    };

    const clear_location_data = () => {
        set_location_data("");
        console.log("deneme");
    };

    return (
        <div className="min-h-screen flex-col bg-black p-4">
            <h1
                style={{ marginTop: "20px" }}
                className="text-3xl text-center mb-3 text-zinc-400"
            >
                Search Locations
            </h1>
            <hr
                className="shadow-md w-full max-w-3xl mx-auto mb-3 rounded-md"
                style={{ color: "#696969" }}
            />
            <SearchBox
                handle_input_change={handle_input_change}
                fetch_weather={fetch_weather}
                location_data={location_data}
                clear_location_data={clear_location_data}
            />

            <RecommendedCities
                recommendedCities={recommendedCities}
                handle_recommended_click={handle_recommended_click}
            />

            <ErrorMessage error={error} />

            {weather_data && (
                <div className="bg-black p-6 pb-3 rounded-lg shadow-md w-full max-w-3xl mx-auto border-zinc-800 border-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {" "}
                        <div className="p-4 bg-black rounded-lg shadow-lg border border-zinc-800 text-zinc-200">
                            <div className="flex items-start justify-between">
                                <div className="flex-col items-center mb-4">
                                    <WeatherHeader
                                        name={weather_data.name}
                                        country={weather_data.sys.country}
                                    />

                                    <div className="flex justify-normal items-center mt-2 gap-3">
                                        <p className="text-lg text-zinc-300 capitalize">
                                            {weather_data.weather[0].icon && (
                                                <img
                                                    src={`weather-icons/${weather_data.weather[0].icon}@2x.svg`}
                                                    alt={
                                                        weather_data.weather[0]
                                                            .description ||
                                                        "01d@2x.svg"
                                                    }
                                                    className="w-12 h-12 mr-2"
                                                    style={{
                                                        filter: "invert(80%)",
                                                    }}
                                                    onError={(
                                                        e: React.SyntheticEvent<
                                                            HTMLImageElement,
                                                            Event
                                                        >
                                                    ) => {
                                                        console.error(
                                                            "icon cannot found:",
                                                            weather_data
                                                                .weather[0].icon
                                                        );
                                                        e.currentTarget.src =
                                                            "/default-weather-icon.svg";
                                                        e.currentTarget.alt =
                                                            "icon cannot found";
                                                    }}
                                                />
                                            )}
                                        </p>
                                        <p className="text-lg text-zinc-100 capitalize">
                                            {
                                                weather_data.weather[0]
                                                    .description
                                            }
                                        </p>
                                    </div>
                                </div>
                                <p className="text-6xl font-extrabold text-zinc-300">
                                    {Math.round(weather_data.main.temp)}°C
                                </p>
                            </div>

                            <WeatherDetails
                                main={weather_data.main}
                                wind={weather_data.wind}
                            />
                        </div>
                        {air_quality_data && (
                            <AirQualityDetails data={air_quality_data} />
                        )}
                        {weather_data.coord && (
                            <CityMap
                                lat={weather_data.coord.lat}
                                lon={weather_data.coord.lon}
                            />
                        )}
                        {weather_data.sys &&
                            typeof weather_data.timezone !== "undefined" && (
                                <SunriseSunsetDetails
                                    sunrise={weather_data.sys.sunrise}
                                    sunset={weather_data.sys.sunset}
                                    timezoneOffset={weather_data.timezone}
                                />
                            )}
                    </div>

                    <div className="flex justify-between mt-2 ">
                        <p
                            style={{ fontSize: "13px" }}
                            className="text-neutral-600 p-1"
                        >
                            Weather data from
                        </p>
                        <a
                            href="https://openweathermap.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "13px" }}
                            className="text-neutral-600 p-1 underline underline-offset-2 hover:text-neutral-500 cursor-pointer"
                        >
                            api.openweathermap.org
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
