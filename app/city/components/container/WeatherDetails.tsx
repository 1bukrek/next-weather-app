import React from "react";

interface WeatherDetailsProps {
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
	};
	wind: {
		speed: number;
		deg: number;
	};
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ main, wind }) => {
	return (
		<div className="grid grid-cols-2 gap-4 text-sm text-zinc-400">
			<div className="flex items-center justify-between p-2 bg-zinc-950 rounded">
				<span className="font-medium">Feels like:</span>
				<span className="font-semibold text-zinc-200">
					{Math.round(main.feels_like)}°C
				</span>
			</div>
			<div className="flex items-center justify-between p-2 bg-zinc-950 rounded">
				<span className="font-medium">Humidity:</span>
				<span className="font-semibold text-zinc-200">
					{main.humidity}%
				</span>
			</div>
			<div className="flex items-center justify-between p-2 bg-zinc-950 rounded">
				<span className="font-medium">Wind Spd.:</span>
				<span className="font-semibold text-zinc-200">
					{wind.speed} m/s
				</span>
			</div>
			<div className="flex items-center justify-between p-2 bg-zinc-950 rounded">
				<span className="font-medium">Pressure:</span>
				<span className="font-semibold text-zinc-200">
					{main.pressure} hPa
				</span>
			</div>
			<div className="flex items-center justify-between p-2 bg-zinc-950 rounded">
				<span className="font-medium">Min Temp.:</span>
				<span className="font-semibold text-zinc-200">
					{Math.round(main.temp_min)}°C
				</span>
			</div>
			<div className="flex items-center justify-between p-2 bg-zinc-950 rounded">
				<span className="font-medium">Max Temp.:</span>
				<span className="font-semibold text-zinc-200">
					{Math.round(main.temp_max)}°C
				</span>
			</div>
		</div>
	);
};

export default WeatherDetails;
