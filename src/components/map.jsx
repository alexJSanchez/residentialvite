import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ message }) {
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    // Default coordinates
    const defaultCoordinates = [40.80933859455395, -73.95250302065439];
    const mark = message && message.length >= 3 ? [message[1], message[2]] : defaultCoordinates;

    useEffect(() => {
        // Initialize the map only once
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView(mark, 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(mapRef.current);
        } else {

            // Update map view if the coordinates change
            mapRef.current.setView(mark);
        }

        // Add marker if not already added
        if (!markerRef.current) {
            markerRef.current = L.marker(mark).addTo(mapRef.current);
        } else {
            // Update marker position
            markerRef.current.setLatLng(mark);
        }

        // Cleanup on unmount
        return () => {
            if (markerRef.current) {
                mapRef.current.removeLayer(markerRef.current);
                markerRef.current = null;
            }
        };
    }, [message]); // Run effect whenever `message` changes

    return <div id="map" style={{ height: '400px', width: '100%' }} />;
}

export default Map;
