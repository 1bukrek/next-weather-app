import React from "react";

interface WeatherDetailsProps {
	name: string;
	country: string;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ name, country }) => {
	return (
		<div>
			<h2 className="text-2xl font-bold">
				<a
					href={`https://www.google.com/maps/search/${name},${country}`}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`Open ${name} on Google Maps`}
					className="hover:underline-offset-1 hover:underline hover:text-blue-500">
					<div className="flex items-center gap-1">
						<span>
							{name}, {country}
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
	);
};

export default WeatherDetails;
