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
		<div className="min-h-screen flex items-center justify-center bg-black p-4">
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

				{weather_data && (
					<>
						<div className="mt-6 p-4 bg-black rounded-lg shadow-lg border border-zinc-800 text-zinc-200">
							<div className="flex items-start justify-between">
								<div className="flex-col items-center mb-4">
									<div>
										<h2 className="text-2xl font-bold">
											<a
												href={`https://www.google.com/maps/search/${weather_data.name},${weather_data.sys.country}`}
												target="_blank"
												rel="noopener noreferrer"
												aria-label={`Open ${weather_data.name} on Google Maps`}
												className="hover:underline-offset-1 hover:underline hover:text-blue-500">
												<div className="flex items-center gap-1">
													<span>
														{weather_data.name},{" "}
														{
															weather_data.sys
																.country
														}
													</span>{" "}
													<img
														src="/link-icon-2.svg"
														alt="Open on Map"
														className="w-6 h-6"
													/>
												</div>
											</a>
										</h2>
									</div>

									<div className="flex justify-normal items-center">
										<p className="text-lg text-zinc-300 capitalize">
											{weather_data.weather[0].icon && (
												<img
													src={`https://openweathermap.org/img/wn/${weather_data.weather[0].icon}@2x.png`}
													alt={
														weather_data.weather[0]
															.description
													}
													className="w-16 h-16 -ml-2" // iconu biraz sola kaydırabiliriz
												/>
											)}
										</p>
										<p className="text-lg text-zinc-300 capitalize">
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

							<div className="grid grid-cols-2 gap-4 text-sm text-zinc-400">
								<div className="flex items-center justify-between p-2 bg-zinc-950 rounded">
									<span className="font-medium">
										Feels like:
									</span>
									<span className="font-semibold text-zinc-200">
										{Math.round(
											weather_data.main.feels_like
										)}
										°C
									</span>
								</div>
								<div className="flex items-center justify-between p-2 bg-zinc-950 rounded">
									<span className="font-medium">
										Humidity:
									</span>
									<span className="font-semibold text-zinc-200">
										{weather_data.main.humidity}%
									</span>
								</div>
								<div className="flex items-center justify-between p-2 bg-zinc-950 rounded">
									<span className="font-medium">
										Wind Speed:
									</span>
									<span className="font-semibold text-zinc-200">
										{weather_data.wind.speed} m/s
									</span>
								</div>
								<div className="flex items-center justify-between p-2 bg-zinc-950 rounded">
									<span className="font-medium">
										Pressure:
									</span>
									<span className="font-semibold text-zinc-200">
										{weather_data.main.pressure} hPa
									</span>
								</div>
								<div className="flex items-center justify-between p-2 bg-zinc-950 rounded">
									<span className="font-medium">
										Min Temperature:
									</span>
									<span className="font-semibold text-zinc-200">
										{Math.round(weather_data.main.temp_min)}
										°C
									</span>
								</div>
								<div className="flex items-center justify-between p-2 bg-zinc-950 rounded">
									<span className="font-medium">
										Max Temperature:
									</span>
									<span className="font-semibold text-zinc-200">
										{Math.round(weather_data.main.temp_max)}
										°C
									</span>
								</div>
							</div>
						</div>
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
					</>
				)}

				{error && (
					<div
						className="bg-red-950 border border-red-500 text-red-500 px-4 py-3 rounded relative"
						role="alert">
						<span className="block sm:inline">{error}</span>
					</div>
				)}
			</div>
		</div>
	);
}
