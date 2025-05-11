// components/container/CityMap.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet'ın CSS'ini import edin
import L from "leaflet"; // Marker ikonunu düzeltmek için

// Leaflet'ın varsayılan marker ikonunun düzgün yüklenmesi için çözüm
// Özellikle Next.js gibi bundler'larda bu gerekli olabilir.
// Eğer ikonlar görünmezse bu kodu kullanın.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
	iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface CityMapProps {
	lat: number;
	lon: number;
}

function ChangeView({ center }: { center: [number, number] }) {
	const map = useMap();
	map.setView(center);
	return null;
}

const CityMap: React.FC<CityMapProps> = ({ lat, lon }) => {
	const position: [number, number] = [lat, lon];

	return (
		// Harita için dış div ve boyutlandırma
		<div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border border-zinc-800 shadow-lg">
			<MapContainer
				center={position}
				zoom={10} // Başlangıç yakınlaştırma seviyesi (10-12 arası iyi bir başlangıç olabilir)
				scrollWheelZoom={false} // Fare tekerleği ile zoom'u devre dışı bırak
				dragging={false} // Haritayı sürüklemeyi devre dışı bırak (mini harita olduğu için)
				doubleClickZoom={false} // Çift tıklama ile zoom'u devre dışı bırak
				zoomControl={false} // Harita üzerindeki zoom butonlarını gizle
				style={{ height: "100%", width: "100%" }} // Konteyneri doldur
				className="z-0" // Diğer elementlerin üzerinde çıkmaması için z-index ayarlayın
			>
				{/* Harita merkezini prop değiştikçe günceller */}
				<ChangeView center={position} />

				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={position}></Marker>
			</MapContainer>
		</div>
	);
};

export default CityMap;
