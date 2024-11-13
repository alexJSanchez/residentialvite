import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ message }) {
    // Default coordinates for the map
    const defaultCoordinates = [40.80933859455395, -73.95250302065439];
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) {
            // Initialize the map only once
            mapRef.current = L.map(mapContainerRef.current).setView(defaultCoordinates, 13);

            // Add the OpenStreetMap tile layer once
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(mapRef.current);
        }
    }, []);

    useEffect(() => {
        // Update marker and view based on message prop
        if (message && message.length >= 3) {
            const [lat, lng] = [message[1], message[2]];
            const marker = L.marker([lat, lng]).addTo(mapRef.current);
            marker.bindPopup(message[0]).openPopup();
            mapRef.current.setView([lat, lng], 13);

            // Clean up previous markers to avoid duplicates
            return () => {
                mapRef.current.removeLayer(marker);
            };
        }
    }, [message]);

    return (
        <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }}></div>
    );
}

export default Map;
