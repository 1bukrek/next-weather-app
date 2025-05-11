import Navbar from "./components/Navbar";

export const metadata = {
	title: "Hava Durumu Uygulaması - Ana Sayfa",
	description:
		"Anlık ve geleceğe yönelik hava durumu verileri sunan platform.",
};

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-gray-100 flex flex-col items-center pt-16 pb-8">
			{" "}
			<Navbar />
			<main className="flex-grow flex justify-center items-center w-full px-4 mt-8">
				{" "}
				<div className="container mx-auto max-w-4xl bg-gray-800 p-8 rounded-lg shadow-2xl text-center border border-gray-700">
					{" "}
					<h2 className="text-4xl font-extrabold text-blue-400 mb-6 leading-tight">
						Hava Durumu Uygulamasına Hoş Geldiniz!
					</h2>
					<p className="text-lg text-gray-200 leading-relaxed mb-6">
						Bu platform, size anlık ve geleceğe yönelik hava durumu
						verilerini sunar. Yukarıdaki menüyü kullanarak şehrinize
						özel bilgilere ulaşabilir, hava durumu haritalarını
						inceleyebilir veya uygulamanın nasıl çalıştığı hakkında
						detaylı bilgi edinebilirsiniz.
					</p>
					<p className="text-lg text-gray-200 leading-relaxed">
						Amacımız, size en doğru ve güncel hava durumu
						bilgilerini sağlamaktır. Keyifli kullanımlar dileriz!
					</p>
				</div>
			</main>
			<footer className="text-gray-400 py-6 text-center mt-12">
				{" "}
				<div className="container mx-auto px-4">
					<p>
						&copy; 2025 Hava Durumu Merkezi. Tüm hakları saklıdır.
					</p>
				</div>
			</footer>
		</div>
	);
}
