import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ message }) {
    // Default coordinates for the map (center of London for example)
    const defaultCoordinates = [40.80933859455395, -73.95250302065439]; // Your default coordinates
    const mark = message && message.length >= 3 ? [message[1], message[2]] : defaultCoordinates;

    // Ref to store the map instance
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null); // For map container reference

    useEffect(() => {
        // Check if the map already exists, so we don’t reinitialize it
        if (!mapRef.current) {
            // Initialize the map and set the view
            mapRef.current = L.map(mapContainerRef.current).setView(defaultCoordinates, 13);

            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(mapRef.current);
        }

        // Clear existing marker (if any)
        if (mapRef.current.markerLayer) {
            mapRef.current.removeLayer(mapRef.current.markerLayer);
        }

        // Add a new marker at the location from `message`
        const marker = L.marker(mark).addTo(mapRef.current);
        mapRef.current.markerLayer = marker;

        // Center the map on the new marker location
        mapRef.current.setView(mark, 13);

    }, [mark]); // Effect runs whenever `mark` changes

    return (
        <div>
            <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }}></div>
        </div>
    );
}

export default Map;
