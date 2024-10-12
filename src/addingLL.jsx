const axios = require('axios'); // Or use fetch if preferred

const locations = [
    { Address: "100 Morningside Drive" },
    { Address: "110 Morningside Drive" },
    { Address: "124 La Salle Street" },
    { Address: "130 Morningside Drive" },
    { Address: "15 Claremont Avenue" },
    { Address: "150 Claremont Avenue" },
    { Address: "191 Claremont Avenue" },
    { Address: "195 Claremont Avenue" },
    { Address: "21 Claremont Avenue" },
    { Address: "25 Claremont Avenue" },
    { Address: "253 West 109th Street" },
    { Address: "259 West 109th Street" },
    { Address: "2700 Broadway" },
    { Address: "2828 Broadway" },
    { Address: "29 Claremont Avenue" },
    { Address: "3260 Henry Hudson Parkway" },
    { Address: "35 Claremont Avenue" },
    { Address: "362 Riverside Drive" },
    { Address: "39 Claremont Avenue" },
    { Address: "400 West 119th Street" },
];

async function getCoordinates(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
        const response = await axios.get(url);
        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return { lat, lon };
        } else {
            console.log(`No coordinates found for ${address}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching coordinates for ${address}:`, error);
        return null;
    }
}

async function fetchAllCoordinates() {
    const results = [];

    for (const location of locations) {
        const coords = await getCoordinates(location.Address);
        if (coords) {
            results.push({ Address: location.Address, ...coords });
        }
    }

    console.log(results);
}

fetchAllCoordinates();
