import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ message }) {
    const mapRef = useRef(null); // Create a ref to hold the map instance

    useEffect(() => {
        // Initialize map only once
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([40.81050798203119, -73.9535329417601], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(mapRef.current);
        }

        // Update map view if message prop changes
        if (message && message.length === 2) {
            const [Longitude, Latitude] = message;
            mapRef.current.setView([Latitude, Longitude], 13);
        }
        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove(); // Clean up the map instance
                mapRef.current = null;
            }
        };
    }, [message]); // Effect depends on the message prop

    return <div id="map" style={{ height: '400px', width: '100%' }} />; // Ensure the map has dimensions
}

export default Map;
