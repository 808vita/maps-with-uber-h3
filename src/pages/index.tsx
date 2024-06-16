import dynamic from "next/dynamic";
// import MapComponent from "@/components/MapComponent";
const LazyMap = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="leaflet-container">
      {/* { <MapComponent />} */}
      <LazyMap />
    </main>
  );
}
