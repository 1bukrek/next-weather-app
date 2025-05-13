import Navbar from "./components/Navbar";

export const metadata = {
	title: "Weather App - Home Page",
	description: "The platform that provides current and future weather data.",
};

export default function Home() {
	return (
		<div className="min-h-screen bg-black flex flex-col items-center justify-between pt-16 pb-8">
			{" "}
			<main>
				<Navbar />
			</main>
			<footer className="text-neutral-300 py-6 text-center mt-12">
				<div className="container mx-auto px-4">
					<p>Developed by 1bukrek</p>
				</div>
			</footer>
		</div>
	);
}
