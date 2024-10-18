import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ message }) {
    const mapRef = useRef(null); // Create a ref to hold the map instance

    useEffect(() => {
        // Initialize map only once
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([40.8105, -73.9535], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(mapRef.current);
        }

        // Update map view if message prop is a valid LatLng
        if (message) {
            const [lat, lon] = typeof message === 'string' ? getLatLonFromAddress(message) : message;

            if (typeof lat === 'number' && typeof lon === 'number') {
                mapRef.current.setView([lat, lon], 13);
            } else {
                console.error('Invalid coordinates provided:', message);
            }
        }

        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [message]); // Effect depends on the message prop

    return <div id="map" style={{ height: '400px', width: '100%' }} />;
}

// Dummy function to mimic address geocoding
function getLatLonFromAddress(address) {
    // You'd typically call a geocoding API here.
    // For now, return example coordinates if address matches
    if (address === "124 La Salle Street") {
        return [40.8105, -73.9604]; // Example coordinates
    }
    return [null, null]; // Invalid
}

export default Map;
