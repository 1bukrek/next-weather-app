import React from "react";

export default function SunriseSunsetDetails({
	sunrise,
	sunset,
	timezoneOffset,
}: {
	sunrise: number;
	sunset: number;
	timezoneOffset: number;
}) {
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
			<div className="grid grid-cols-1 gap-1 text-sm">
				<div className="flex justify-between items-center mb-2 p-2 bg-zinc-950 rounded text-zinc-200">
					<p className="text-lg">Sunrise:</p>
					<p className="font-semibold text-lg">
						{formatTime(sunrise, timezoneOffset)}
					</p>
				</div>
				<div className="flex justify-between items-center mb-2 p-2 bg-zinc-950 rounded text-zinc-200">
					<p className="text-lg">Sunset:</p>
					<p className="font-semibold text-lg">
						{formatTime(sunset, timezoneOffset)}
					</p>
				</div>
				<div className="flex justify-between items-center gap-2 p-2 bg-zinc-950 rounded text-zinc-200">
					<p className="text-lg">Length of Day:</p>
					<p className="font-semibold text-lg">{`${hours}h ${minutes}m`}</p>
				</div>
			</div>
		</div>
	);
}
