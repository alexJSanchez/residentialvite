import React, { useEffect } from 'react';
import L from 'leaflet'; // Ensure leaflet is installed: `npm install leaflet`
import 'leaflet/dist/leaflet.css'; // Leaflet CSS is required

function Map() {
    useEffect(() => {
        // Initialize the map only once
        const map = L.map('map', {
            center: [51.505, -0.09],
            zoom: 13,
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        return () => {
            map.remove(); // Cleanup on component unmount to prevent memory leaks
        };
    }, []);

    return (
        <div style={{ height: '400px', width: '100%' }} id="map"></div>
    );
}

export default Map;
