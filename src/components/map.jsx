import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "../App.css";
import locationImage from '../images/location.png'
import TrucklocationImage from '../images/truck.png'
import { Icon } from 'leaflet';
import "leaflet/dist/leaflet.css";

export default function Map({ message }) {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);

    //Custome icon for map markers
    const LocationCustomIcon = new Icon({
        iconUrl: locationImage, //icon url
        iconSize: [28, 28], //size of icon
    })
    const TruckCustomIcon = new Icon({
        iconUrl: TrucklocationImage, //icon url
        iconSize: [28, 28] //size of icon
    })

    // Get the user's location on mount
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    setError(error.message);
                }
            );
        } else {
            setError("Geolocation not available");
        }
    }, []);

    // Initial map center coordinates as a fallback
    const initialCenter = [40.80698919847072, -73.95888914053947];

    // Validate if a coordinate is a number
    const isValidCoordinate = (coord) => typeof coord === 'number' && !isNaN(coord);

    // Set markers if latitude and longitude are valid
    const markers = [];
    if (isValidCoordinate(message[2]) && isValidCoordinate(message[1])) {
        markers.push({
            geocode: [message[2], message[1]],
            popUp: message[0],
            image: LocationCustomIcon
        });
    }
    if (isValidCoordinate(location.latitude) && isValidCoordinate(location.longitude)) {
        markers.push({
            geocode: [location.latitude, location.longitude],
            popUp: 'MY TRUCK',
            image: TruckCustomIcon
        });
    }

    // Custom hook to update the map center when location changes
    const MapUpdater = ({ center }) => {
        const map = useMap();
        useEffect(() => {
            if (center) {
                map.setView(center, map.getZoom(), { animate: true });
            }
        }, [center, map]);
        return null;
    };

    // Determine the center: use selected location if valid, otherwise user location, and fallback to initial center
    const mapCenter = markers.length > 0 ? markers[0].geocode : initialCenter;

    return (
        <MapContainer center={mapCenter} zoom={16}>
            {/* Update map center dynamically */}
            <MapUpdater center={mapCenter} />

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render markers if they have valid coordinates */}
            {markers.map((marker, index) => (
                <Marker key={index} position={marker.geocode} icon={marker.image}>
                    <Popup>{marker.popUp}</Popup>
                </Marker>
            ))
            }
        </MapContainer >
    );
}
