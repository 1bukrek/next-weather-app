// components/container/AirQualityDetails.tsx
import React from "react";

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

interface AirQualityDetailsProps {
	data: AirPollutionData;
}

const getAqiDescription = (aqi: number) => {
	switch (aqi) {
		case 1:
			return { text: "Good", color: "text-green-500" };
		case 2:
			return { text: "Fair", color: "text-yellow-500" };
		case 3:
			return {
				text: "Moderate",
				color: "text-orange-500",
			};
		case 4:
			return { text: "Poor", color: "text-red-500" };
		case 5:
			return {
				text: "Very Poor",
				color: "text-purple-500",
			};
		default:
			return { text: "N/A", color: "text-zinc-500" };
	}
};

const AirQualityDetails: React.FC<AirQualityDetailsProps> = ({ data }) => {
	if (!data || !data.list || data.list.length === 0) return null;

	const { main, components } = data.list[0];
	const aqiInfo = getAqiDescription(main.aqi);

	return (
		<div className="mt-4 p-4 bg-black rounded-lg shadow-lg border border-zinc-800 text-zinc-200">
			<div className="flex justify-between">
				<h3 className="text-xl font-semibold mb-2 text-zinc-300">
					Air Quality:
				</h3>
				<p className={`text-2xl font-bold mb-2 ${aqiInfo.color}`}>
					{aqiInfo.text}
				</p>
			</div>
			<hr className="mt-0 mb-3" />

			<div className="grid grid-cols-2 gap-4 text-sm text-zinc-400">
				<div className="flex justify-between items-center p-2 bg-zinc-950 rounded">
					<p>PM2.5:</p>
					<p className="font-semibold text-zinc-200">
						{components.pm2_5.toFixed(2)} μg/m³
					</p>
				</div>
				<div className="flex justify-between items-center p-2 bg-zinc-950 rounded">
					<p>PM10:</p>
					<p className="font-semibold text-zinc-200">
						{components.pm10.toFixed(2)} μg/m³
					</p>
				</div>
				<div className="flex justify-between items-center p-2 bg-zinc-950 rounded">
					<p>CO:</p>
					<p className="font-semibold text-zinc-200">
						{components.co.toFixed(2)} μg/m³
					</p>
				</div>
				<div className="flex justify-between items-center p-2 bg-zinc-950 rounded">
					<p>SO2:</p>
					<p className="font-semibold text-zinc-200">
						{components.so2.toFixed(2)} μg/m³
					</p>
				</div>
				<div className="flex justify-between items-center p-2 bg-zinc-950 rounded">
					<p>NO2:</p>
					<p className="font-semibold text-zinc-200">
						{components.no2.toFixed(2)} μg/m³
					</p>
				</div>
				<div className="flex justify-between items-center p-2 bg-zinc-950 rounded">
					<p>O3:</p>
					<p className="font-semibold text-zinc-200">
						{components.o3.toFixed(2)} μg/m³
					</p>
				</div>
				{components.nh3 !== undefined && (
					<div className="flex justify-between items-center p-2 bg-zinc-950 rounded">
						<p>NH3:</p>
						<p className="font-semibold text-zinc-200">
							{components.nh3.toFixed(2)} μg/m³
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default AirQualityDetails;
