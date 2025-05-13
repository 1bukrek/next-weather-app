export default function RecommendedCities({
	recommendedCities,
	handle_recommended_click,
}: {
	recommendedCities: string[];
	handle_recommended_click: (city: string) => void;
}) {
	return (
		<div className="w-full max-w-3xl mx-auto mb-6">
			<p className="text-zinc-400 text-sm mb-2">Recommended Cities:</p>
			<div className="flex flex-wrap gap-2">
				{recommendedCities.map((city, index) => (
					<button
						key={index}
						onClick={() => handle_recommended_click(city)}
						className="px-3 py-1 text-sm rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
						{city}
					</button>
				))}
			</div>
		</div>
	);
}
