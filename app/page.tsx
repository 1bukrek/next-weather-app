"use client";

import { useState, useEffect } from "react";

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

export default function Home() {
	const [weather_data, set_weather_data] = useState<WeatherData | null>(null);
	const [location_data, set_location_data] = useState<string>("");
	const [suggestions, set_suggestions] = useState<CitySuggestion[]>([]);
	const [error, set_error] = useState<string | null>(null);

	const API_KEY = "f1032ef34fa5f2895e4d4258da67b24d";
	const weather_url = `https://api.openweathermap.org/data/2.5/weather?q=${location_data}&appid=${API_KEY}&units=metric`;
	const geo_url = `https://api.openweathermap.org/geo/1.0/direct?q=${location_data}&limit=5&appid=${API_KEY}`;

	const fetch_weather = () => {
		set_suggestions([]);
		set_error(null);

		fetch(weather_url)
			.then((response) => {
				if (!response.ok) {
					if (response.status === 404) {
						throw new Error("City not found.");
					} else {
						throw new Error(
							`Network response was not OK: ${response.status}`
						);
					}
				}
				return response.json();
			})
			.then((data: WeatherData) => {
				set_weather_data(data);
			})
			.catch((error) => {
				console.error("ERROR WHILE FETCHING DATA: ", error);
				set_weather_data(null);
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
		fetch_weather();
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
			<div className="bg-black p-6 pb-3 rounded-lg shadow-md w-full max-w-md border-zinc-800 border-1">
				<h1 className="text-2xl font-bold mb-6 text-center text-zinc-300">
					Weather Forecast
				</h1>
				<div className="relative mb-4">
					<input
						type="text"
						placeholder="Enter city name..."
						value={location_data}
						onChange={handle_input_change}
						onKeyDown={(event) => {
							if (event.key === "Enter" && location_data) {
								fetch_weather();
							}
						}}
						className="w-full px-4 py-2 border border-zinc-800 rounded-md focus:outline-none focus:ring-0 focus:ring-blue-500 hover:border-zinc-700 ease-in-out transition  focus:ring-offset-0"
						aria-label="City name"
					/>
					{suggestions.length > 0 && (
						<ul className="absolute z-10 w-full bg-black border border-zinc-800 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
							{suggestions.map((city, index) => (
								<li
									className="px-4 py-2 cursor-pointer hover:text-neutral-50 hover:font-semibold transition ease-in-out text-neutral-400"
									key={index}
									onClick={() =>
										handle_suggestion_click(city)
									}
									aria-option={
										index === 0 ? "selected" : undefined
									}
									role="option">
									{city.name}, {city.country}{" "}
									{city.state && `, ${city.state}`}{" "}
								</li>
							))}
						</ul>
					)}
				</div>

				{error && (
					<div
						className="bg-red-950 border border-red-500 text-red-500 px-4 py-3 rounded relative"
						role="alert">
						<span className="block sm:inline">{error}</span>
					</div>
				)}

				{weather_data && (
					<>
						<div className="mt-6 p-4 bg-black border-zinc-800 border-1 rounded-md shadow-sm">
							<div className="flex justify-between items-center mb-2">
								<h2 className="text-xl font-semibold text-neutral-300">
									{" "}
									{weather_data.name},{" "}
									{weather_data.sys.country}
								</h2>
								<p className="text-neutral-300">
									<span className="font-semibold text-4xl">
										{weather_data.main.temp.toFixed(0)}°C
									</span>
								</p>
							</div>
							<hr style={{ color: "#27272a" }} />
							<div>
								<div className="flex items-center mb-1 mt-1">
									<img
										src={`http://openweathermap.org/img/w/${weather_data.weather[0].icon}.png`}
										alt={
											weather_data.weather[0].description
										}
										className="w-12 h-12 mr-2"
									/>
									<p className="text-neutral-300 text-lg capitalize">
										{weather_data.weather[0].description}
									</p>
								</div>
								<p className="text-neutral-300">
									Feels like:{" "}
									<span className="font-medium">
										{weather_data.main.feels_like}°C
									</span>
								</p>
								<p className="text-neutral-300">
									Humidity:{" "}
									<span className="font-medium">
										{weather_data.main.humidity}%
									</span>
								</p>
								<p className="text-neutral-300">
									Wind Speed:{" "}
									<span className="font-medium">
										{weather_data.wind.speed} m/s
									</span>
								</p>
							</div>
						</div>
						<div className="flex justify-between ">
							<p
								style={{ fontSize: "13px" }}
								className="text-neutral-600 mt-1 p-1">
								Weather data from{" "}
							</p>
							<p
								style={{ fontSize: "13px" }}
								className="text-neutral-600 mt-1 p-1 underline underline-offset-2 hover:text-neutral-500 cursor-pointer">
								api.openweathermap.org
							</p>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
