import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "../App.css";
import "leaflet/dist/leaflet.css";

export default function Map({ message }) {
    // Initial map center coordinates
    const initialCenter = [40.80698919847072, -73.95888914053947];

    // Check if coordinates in the message are valid numbers
    const isValidCoordinate = (coord) => typeof coord === 'number' && !isNaN(coord);

    // Set markers if latitude and longitude are valid
    const markers = isValidCoordinate(message[2]) && isValidCoordinate(message[1]) ? [
        {
            geocode: [message[2], message[1]],
            popUp: message[0]
        }
    ] : [];

    // Custom hook to center the map when selected location changes
    const MapUpdater = ({ center }) => {
        const map = useMap();
        useEffect(() => {
            if (center) {
                map.setView(center, map.getZoom(), { animate: true });
            }
        }, [center, map]);
        return null;
    };

    // Determine the center: use selected location if valid; otherwise, use initial center
    const mapCenter = markers.length > 0 ? markers[0].geocode : initialCenter;

    return (
        <MapContainer center={initialCenter} zoom={14}>
            {/* This component will update the map's center dynamically */}
            <MapUpdater center={mapCenter} />

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render markers only if they have valid coordinates */}
            {markers.map((marker, index) => (
                <Marker key={index} position={marker.geocode}>
                    <Popup>{marker.popUp}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
