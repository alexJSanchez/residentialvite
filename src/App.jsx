import { useState, useCallback, useEffect } from 'react';
import residential from "./residentials";
import './App.css';

const phone = "\u{260E}";
const cellPhone = "\u{1F4F1}";

function App() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [selectedRoutes, setSelectedRoutes] = useState([]);

  // Search function for both address and name
  const searchProperties = useCallback((query) => {
    const lowerCaseQuery = query.toLowerCase();
    const uniqueProperties = new Set();

    return residential.filter(property => {
      const lowerCaseAddress = property.Address.toLowerCase();
      const lowerCaseSuper = property.Super.toLowerCase();

      const matchesAddress = lowerCaseAddress.includes(lowerCaseQuery);
      const matchesName = lowerCaseSuper.includes(lowerCaseQuery);

      const uniqueKey = `${property.Address}-${property.Super}`;

      if ((matchesAddress || matchesName) && !uniqueProperties.has(uniqueKey)) {
        uniqueProperties.add(uniqueKey);
        return true;
      }

      return false;
    });
  }, []);

  // Add address to the selected routes
  function addAddress(address) {
    if (!selectedRoutes.includes(address)) {
      setSelectedRoutes([...selectedRoutes, address]);
    } else {
      alert("This address is already in the route.");
    }
  }

  function HandleSubmit(e) {
    e.preventDefault();
    const searchQuery = e.target.searchName.value;
    const result = searchProperties(searchQuery);
    setSearchResult(result);
  }

  async function getDistanceMatrix(addresses) {
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your API key

    // Prepare the addresses for the API request
    const origins = addresses.join('|');
    const destinations = addresses.join('|');

    // URL for the Google Distance Matrix API
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}&mode=driving`;

    // Fetch the travel times between all addresses
    const response = await fetch(url);
    const data = await response.json();
    return data.rows.map(row => row.elements.map(element => element.duration.value)); // Return travel times in seconds
  }

  // Nearest Neighbor Algorithm to find the fastest path
  function findFastestPath(travelTimes) {
    const n = travelTimes.length;
    const visited = Array(n).fill(false);
    const path = [];
    let totalTravelTime = 0;

    let currentLocation = 0; // Start from the first address
    visited[currentLocation] = true;
    path.push(currentLocation);

    for (let step = 1; step < n; step++) {
      let nextLocation = -1;
      let shortestTime = Infinity;

      // Find the nearest unvisited location
      for (let i = 0; i < n; i++) {
        if (!visited[i] && travelTimes[currentLocation][i] < shortestTime) {
          nextLocation = i;
          shortestTime = travelTimes[currentLocation][i];
        }
      }

      visited[nextLocation] = true;
      path.push(nextLocation);
      totalTravelTime += shortestTime;
      currentLocation = nextLocation;
    }

    return { path, totalTravelTime };
  }

  async function getFastestRoute(addresses) {
    // 1. Get the distance matrix
    const travelTimes = await getDistanceMatrix(addresses);

    // 2. Find the optimal path using nearest neighbor algorithm
    const { path, totalTravelTime } = findFastestPath(travelTimes);

    // Convert path indices back to addresses
    const orderedAddresses = path.map(index => addresses[index]);

    return { orderedAddresses, totalTravelTime };
  }

  // Example usage
  const addresses = [...selectedRoutes];

  getFastestRoute(addresses).then(result => {
    console.log('Optimal Route:', result.orderedAddresses);
    console.log('Total Travel Time (in seconds):', result.totalTravelTime);
  });


  useEffect(() => {
    console.log('selected routes', selectedRoutes);
  }, [selectedRoutes]);

  return (
    <div>
      <form className="searchForm" onSubmit={HandleSubmit}>
        <label>Search</label>
        <input
          type="text"
          name="searchName"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <h2>Route</h2>
      {selectedRoutes.map((item, index) => (
        <p key={index}>{item}</p>
      ))}

      <div className="results-container">
        {searchResult.length > 0 ? (
          searchResult.map((item) => (
            <div key={`${item.Address}-${item.Super}`} className="result-card">
              <img src={item.image} alt={`Image of ${item.Super}`} className="result-image" />
              <h4>{item.Super}</h4>
              <button onClick={() => addAddress(item.Address)}>Add Address To Route</button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.Address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3>{item.Address}</h3>
              </a>
              <h4>{item.Shift}</h4>
              <h5>{item.Hours}</h5>
              <div>
                {cellPhone}
                <a href={`tel:${item.Super_Cell}`}>{item.Super_Cell}</a>
              </div>
              <div>
                {phone}
                <a href={`tel:${item.Super_Phone}`}>{item.Super_Phone}</a>
              </div>
              <hr></hr>
              <div>
                <h3>Backup Super</h3>
                <h4>{item.Backup_Super}</h4>
                <div>
                  {cellPhone}
                  <a href={`tel:${item.Backup_Super_Cell}`}>{item.Backup_Super_Cell}</a>
                </div>
                <div>
                  {phone}
                  <a href={`tel:${item.Backup_Super_Phone}`}>{item.Backup_Super_Phone}</a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
