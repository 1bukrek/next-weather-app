"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
	iconRetinaUrl: iconRetinaUrl.src,
	iconUrl: iconUrl.src,
	shadowUrl: shadowUrl.src,
});

export default function CityMap({
	lat,
	lon,
	cityName,
}: {
	lat: number;
	lon: number;
	cityName?: string;
}) {
	const position: LatLngExpression = [lat, lon];

	return (
		<div className="p-4 bg-black rounded-lg shadow-lg border border-zinc-800 text-zinc-200 h-80">
			{" "}
			<MapContainer
				center={position}
				zoom={13}
				scrollWheelZoom={true}
				className="h-full w-full rounded-md">
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={position}>
					<Popup>
						{cityName ? `${cityName}` : "City Location"} <br />{" "}
						Latitude: {lat}, Longitude: {lon}
					</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
}
