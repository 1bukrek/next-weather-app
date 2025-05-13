import Link from "next/link";

const Navbar = () => {
	return (
		<header className="bg-black border-1 border-zinc-800 text-neutral-200 py-2 shadow-xl rounded-xl mx-auto max-w-5xl my-8">
			<div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 py-2">
				{" "}
				<nav>
					<ul className="flex flex-wrap justify-center md:justify-end items-center gap-x-8 gap-y-2 text-lg">
						<li>
							<Link href="/weather" className="hover:underline">
								Cities
							</Link>
						</li>
						<li>
							<Link href="/maps" className="hover:underline">
								Maps
							</Link>
						</li>
						<li>
							<Link
								href="/documentation"
								className="hover:underline">
								Documentation
							</Link>
						</li>
						<li>
							<Link href="/contact" className="hover:underline">
								Contact
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Navbar;
