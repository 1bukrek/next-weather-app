"use client";

import { useState } from "react";

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
	};
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
			aqi: number; // Air Quality Index (1: Good, 2: Fair, 3: Moderate, 4: Poor, 5: Very Poor)
		};
		components: {
			co: number;
			no: number;
			no2: number;
			o3: number;
			so2: number;
			pm2_5: number; // Fine particles matter (μg/m³)
			pm10: number; // Coarse particulate matter (μg/m³)
			nh3: number; // Ammonia (μg/m³) - Might not always be present
		};
		dt: number; // Time of data calculation, Unix, UTC
	}[];
}

import WeatherDetails from "./components/container/WeatherDetails";
import WeatherHeader from "./components/container/WeatherHeader";
import AirQualityDetails from "./components/container/AirQualityDetails";
import CityMap from "./components/container/CityMap";
import SunriseSunsetDetails from "./components/container/SunriseSunsetDetails";

export default function CityData() {
	const [weather_data, set_weather_data] = useState<WeatherData | null>(null);
	const [location_data, set_location_data] = useState<string>("");
	const [suggestions, set_suggestions] = useState<CitySuggestion[]>([]);
	const [error, set_error] = useState<string | null>(null);

	const [air_quality_data, set_air_quality_data] =
		useState<AirPollutionData | null>(null);

	const API_KEY = "f1032ef34fa5f2895e4d4258da67b24d";
	const weather_url = `https://api.openweathermap.org/data/2.5/weather?q=${location_data}&appid=${API_KEY}&units=metric`;
	const geo_url = `https://api.openweathermap.org/geo/1.0/direct?q=${location_data}&limit=5&appid=${API_KEY}`;

	const fetch_weather = (location_query: string) => {
		set_suggestions([]);
		set_error(null);
		set_air_quality_data(null); // Yeni şehir arandığında önceki hava kalitesi verilerini temizle

		const weather_api_url = `https://api.openweathermap.org/data/2.5/weather?q=${location_query}&appid=${API_KEY}&units=metric`;

		if (!location_query) {
			set_error("Please enter a city name.");
			return;
		}

		fetch(weather_api_url)
			.then((response) => {
				if (!response.ok) {
					if (response.status === 404)
						throw new Error("City not found.");
					else {
						throw new Error(
							`Network response was not OK: ${response.status}`
						);
					}
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
				if (!response.ok) {
					throw new Error(
						`Failed to fetch air quality data: ${response.status}`
					);
				}
				return response.json();
			})
			.then((data: AirPollutionData) => {
				set_air_quality_data(data);
			})
			.catch((error) => {
				console.error("ERROR WHILE FETCHING DATA: ", error);
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
		set_error(null);

		const geo_url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;

		if (query.length > 1) {
			fetch(geo_url)
				.then((response) => {
					if (!response.ok) {
						throw new Error(
							`Network response for suggestions was not OK: ${response.status}`
						);
					}
					return response.json();
				})
				.then((data: CitySuggestion[]) => {
					set_suggestions(data.slice(0, 3));
				})
				.catch((error) => {
					console.error("ERROR FETCHING CITY SUGGESTIONS: ", error);
					set_suggestions([]);
				});
		} else {
			set_suggestions([]);
		}
	};

	const handle_suggestion_click = (city: CitySuggestion) => {
		set_location_data(city.name);
		set_suggestions([]);
		fetch_weather(city.name);
	};
	return (
		<div className="min-h-screen flex-col bg-black p-4">
			<h1
				style={{ marginTop: "20px" }}
				className="text-2xl text-center font-bold mb-6 text-zinc-300">
				Weather Forecast
			</h1>
			<div className="relative mb-4 shadow-md w-full max-w-3xl mx-auto">
				<input
					type="text"
					placeholder="Enter city name..."
					value={location_data}
					onChange={handle_input_change}
					onKeyDown={(event) => {
						if (event.key === "Enter" && location_data) {
							fetch_weather(location_data);
						}
					}}
					className="w-full px-4 py-2 border border-zinc-800 rounded-md focus:outline-none focus:ring-0 focus:ring-blue-500 hover:border-zinc-700 ease-in-out transition  focus:ring-offset-0"
					aria-label="City name"
				/>
				{/*
					suggestions.length > 0 && (
					<ul className="absolute z-10 w-full bg-black border border-zinc-800 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
						{suggestions.map((city, index) => (
							<li
								className="px-4 py-2 cursor-pointer hover:text-neutral-50 hover:font-semibold transition ease-in-out text-neutral-400"
								key={index}
								onClick={() => handle_suggestion_click(city)}
								aria-option={
									index === 0 ? "selected" : undefined
								}
								role="option">
								{city.name}, {city.country}{" "}
								{city.state && `, ${city.state}`}{" "}
							</li>
						))}
					</ul>
				)
				*/}
			</div>
			{weather_data && (
				<div className="bg-black p-6 pb-3 rounded-lg shadow-md w-full max-w-3xl mx-auto border-zinc-800 border-1">
					{weather_data && (
						<div className="grid grid-cols-2 gap-4">
							<div className="p-4 bg-black rounded-lg shadow-lg border border-zinc-800 text-zinc-200">
								<div className="flex items-start justify-between">
									<div className="flex-col items-center mb-4">
										<WeatherHeader
											name={weather_data.name}
											country={weather_data.sys.country}
										/>

										<div className="flex justify-normal items-center mt-2 gap-3">
											<p className="text-lg text-zinc-300 capitalize">
												{weather_data.weather[0]
													.icon && (
													<img
														src={`weather-icons/${weather_data.weather[0].icon}@2x.svg`}
														alt={
															weather_data
																.weather[0]
																.description ||
															"01d@2x.svg"
														}
														className="w-8 h-8 ml-2"
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
																	.weather[0]
																	.icon
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
								typeof weather_data.timezone !==
									"undefined" && (
									<SunriseSunsetDetails
										sunrise={weather_data.sys.sunrise}
										sunset={weather_data.sys.sunset}
										timezoneOffset={weather_data.timezone}
									/>
								)}
						</div>
					)}

					<div className="flex justify-between mt-2 ">
						<p
							style={{ fontSize: "13px" }}
							className="text-neutral-600 p-1">
							Weather data from{" "}
						</p>
						<p
							style={{ fontSize: "13px" }}
							className="text-neutral-600 p-1 underline underline-offset-2 hover:text-neutral-500 cursor-pointer">
							api.openweathermap.org
						</p>
					</div>

					{error && (
						<div
							className="bg-red-950 border border-red-500 text-red-500 px-4 py-3 rounded relative"
							role="alert">
							<span className="block sm:inline">{error}</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
