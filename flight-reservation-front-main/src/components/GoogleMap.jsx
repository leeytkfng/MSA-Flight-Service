// GoogleMapInternational.jsx
import { GoogleMap, useLoadScript, OverlayView } from "@react-google-maps/api";
import { useRef, useState } from "react";
import { allAirports } from "../data/allAirports.js";
import "../pages/FlightOverlay.css";
import { filterAirportsByDistance } from "../data/fucntionDistance.js";

const containerStyle = {
    width: "100%",
    height: "100%",
};

const softDarkStyle = [
    { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
    { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#223a5e" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6f9ba5" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1e3d59" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#76cfa6" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c4a74" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4e6d94" }] },
    { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4e6d94" }] },
];

const center = { lat: 35, lng: 130 };
const continentHubCodes = ["ICN", "SIN", "DXB", "LHR", "JFK", "GRU", "JNB", "SYD"];

function GoogleMapInternational() {
    const [departure, setDeparture] = useState(null);
    const [arrival, setArrival] = useState(null);
    const [visibleAirports, setVisibleAirports] = useState([]);
    const [zoomLevel, setZoomLevel] = useState(2);
    const mapRef = useRef(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    const handleClick = (airport) => {
        if (!departure) setDeparture(airport.name);
        else if (!arrival && airport.name !== departure) setArrival(airport.name);
        else {
            setDeparture(null);
            setArrival(null);
        }
    };

    const updateVisibleAirports = (map) => {
        const bounds = map.getBounds();
        const zoom = map.getZoom();
        setZoomLevel(zoom);
        if (!bounds) return;

        const inBounds = allAirports.filter((airport) => {
            const pos = new window.google.maps.LatLng(airport.lat, airport.lng);
            return bounds.contains(pos);
        });

        const minDistance = zoom >= 6 ? 50 : zoom >= 4 ? 100 : 200;
        const filtered = filterAirportsByDistance(inBounds, minDistance, continentHubCodes);
        setVisibleAirports(filtered);
    };

    if (!isLoaded) return <div>지도 로딩 중...</div>;

    return (
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={2.7}
                onLoad={(map) => {
                    mapRef.current = map;
                    updateVisibleAirports(map);
                }}
                onIdle={() => updateVisibleAirports(mapRef.current)}
                options={{
                    minZoom: 2,
                    maxZoom: 10,
                    styles: softDarkStyle,
                }}
            >
                {visibleAirports.map((airport) => (
                    <OverlayView
                        key={airport.code}
                        position={{ lat: airport.lat, lng: airport.lng }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        {continentHubCodes.includes(airport.code) || zoomLevel >= 6 ? (
                            <div
                                className={`flight-overlay ${airport.name === departure || airport.name === arrival ? 'active' : ''}`}
                                onClick={() => handleClick(airport)}
                                title={airport.name}
                            >
                                <div className="airport-name">{airport.name}</div>
                                <div className="airport-price">₩{airport.price.toLocaleString()}~</div>
                            </div>
                        ) : (
                            <div
                                className="airport-dot"
                                onClick={() => handleClick(airport)}
                                title={airport.name}
                            />
                        )}
                    </OverlayView>
                ))}
            </GoogleMap>
        </div>
    );
}

export default GoogleMapInternational;
