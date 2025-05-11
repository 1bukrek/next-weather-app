import React from "react";

interface SunriseSunsetDetailsProps {
	sunrise: number;
	sunset: number;
	timezoneOffset: number;
}

const SunriseSunsetDetails: React.FC<SunriseSunsetDetailsProps> = ({
	sunrise,
	sunset,
	timezoneOffset,
}) => {
	const formatTime = (timestamp: number, offset: number): string => {
		const utcMilliseconds = timestamp * 1000;
		const cityOffsetMilliseconds = offset * 1000;

		const localDate = new Date(utcMilliseconds + cityOffsetMilliseconds);

		const hours = localDate.getUTCHours();
		const minutes = localDate.getUTCMinutes();

		const formattedHours = hours.toString().padStart(2, "0");
		const formattedMinutes = minutes.toString().padStart(2, "0");

		return `${formattedHours}:${formattedMinutes}`;
	};

	const dayLengthSeconds = sunset - sunrise;

	const hours = Math.floor(dayLengthSeconds / 3600);
	const minutes = Math.floor((dayLengthSeconds % 3600) / 60);

	return (
		<div className="w-full h-64 md:h-80 p-4 bg-black rounded-lg shadow-lg border border-zinc-800 text-zinc-200">
			<h3 className="text-xl font-semibold mb-3 text-zinc-300">
				Sunlight Details
			</h3>
			<div className="flex justify-between items-center mb-2">
				<p className="text-lg">Sunrise:</p>
				<p className="font-semibold text-lg">
					{formatTime(sunrise, timezoneOffset)}
				</p>
			</div>
			<div className="flex justify-between items-center mb-2">
				<p className="text-lg">Sunset:</p>
				<p className="font-semibold text-lg">
					{formatTime(sunset, timezoneOffset)}
				</p>
			</div>
			<div className="flex justify-between items-center">
				<p className="text-lg">Daytime:</p>
				<p className="font-semibold text-lg">{`${hours}h ${minutes}m`}</p>
			</div>
		</div>
	);
};

export default SunriseSunsetDetails;
