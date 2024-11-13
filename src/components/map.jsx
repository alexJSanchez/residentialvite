import React, { useEffect, useRef } from 'react';

import { MapContainer, TileLayer } from "react-leaflet"
import "../App.css";
import "leaflet/dist/leaflet.css";


export default function Map(message) {
    console.log(message)
    return (
        <MapContainer center={[40.80698919847072, -73.95888914053947]} zoom={14}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            >
            </TileLayer>
        </MapContainer >
    )
}
