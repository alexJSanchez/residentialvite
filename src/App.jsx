import { useState, useCallback, useEffect } from 'react';
import residential from "./residentials";
import './App.css';
import Map from './components/map.jsx';

// Unicode symbols for phone and cell phone icons
const phone = "\u{260E}";
const cellPhone = "\u{1F4F1}";

function App() {
  // State for the search query input
  const [search, setSearch] = useState('');
  // State to store search results
  const [searchResult, setSearchResult] = useState([]);
  // State to track selected routes (addresses added to route)
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  // State for a single selected location to be displayed on the map
  const [seletedLocation, setSelectedlocation] = useState([])

  // Function to search properties by address or super's name
  const searchProperties = useCallback((query) => {
    const lowerCaseQuery = query.toLowerCase();
    const uniqueProperties = new Set();

    // Filter residential data based on address or super's name
    return residential.filter((property) => {
      const lowerCaseAddress = property.Address.toLowerCase();
      const lowerCaseSuper = property.Super.toLowerCase();

      const matchesAddress = lowerCaseAddress.includes(lowerCaseQuery);
      const matchesName = lowerCaseSuper.includes(lowerCaseQuery);

      // Create a unique key to avoid duplicate properties in results
      const uniqueKey = `${property.Address}-${property.Super}`;

      // Add property if it matches the search and is unique
      if ((matchesAddress || matchesName) && !uniqueProperties.has(uniqueKey)) {
        uniqueProperties.add(uniqueKey);
        return true;
      }

      return false;
    });
  }, []);

  // Function to add an address to the selected routes
  const addAddress = useCallback((address, Longitude, Latitude) => {
    setSelectedRoutes((prevRoutes) =>
      // Prevent duplicate addresses in the route
      prevRoutes.includes(address)
        ? (alert("This address is already in the route."), prevRoutes)
        : [...prevRoutes, [address, Longitude, Latitude]]
    );
  }, []);

  // Handle form submission for search
  const handleSubmit = (e) => {
    e.preventDefault();
    // Check for an empty search input
    if (!search.trim()) {
      const result = searchProperties(search);
      setSearchResult(result);
      alert("Please enter a valid search query.");
      return;
    }
    // Perform the search and update results
    const result = searchProperties(search);
    setSearchResult(result);
  };
  // Function to scroll back to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // This makes the scroll smooth
    });
  };
  // Log selected routes in the console whenever they change
  useEffect(() => {
    console.log('Selected routes:', selectedRoutes);
  }, [selectedRoutes]);

  return (
    <div>
      {/* Back to Top Button */}
      <button className="back-to-top" onClick={scrollToTop}>
        ↑ Back to Top
      </button>
      {/* Search form for user input */}
      <form className="searchForm" onSubmit={handleSubmit}>
        <label htmlFor="searchName">Search</label>
        <input
          id="searchName"
          type="text"
          name="searchName"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      {/* Map component to show selected location */}
      <Map message={seletedLocation} />

      <h2>Route</h2>
      {/* Display selected routes with buttons to set each one as the active location */}
      {selectedRoutes.map((item, index) => (
        <div key={index}>
          <button onClick={(e) => setSelectedlocation([item[0], item[1], item[2]])}>{item[0]}</button>
        </div>
      ))}

      {/* Container for displaying search results */}
      <div className="results-container">
        {searchResult.length > 0 ? (
          searchResult.map((item) => (
            <div key={`${item.Address}-${item.Super}`} className="result-card">
              <img
                src={item.image}
                alt={`Image of ${item.Super}`}
                className="result-image"
              />
              <h4>{item.Super}</h4>
              {/* Button to add property address to route */}
              <button onClick={() => addAddress(item.Address, item.Longitude, item.Latitude)}>
                Add Address To Route
              </button>
              {/* Link to view address on Google Maps */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.Address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3>{item.Address}</h3>
              </a>
              <h4>{item.Shift}</h4>
              <h5>{item.Hours}</h5>
              {/* Contact details for Super */}
              <div>
                {cellPhone}
                <a href={`tel:${item.Super_Cell}`}>{item.Super_Cell}</a>
              </div>
              <div>
                {phone}
                <a href={`tel:${item.Super_Phone}`}>{item.Super_Phone}</a>
              </div>
              <hr />
              {/* Contact details for Backup Super */}
              <div>
                <h3>Backup Super</h3>
                <h4>{item.Backup_Super}</h4>
                <div>
                  {cellPhone}
                  <a href={`tel:${item.Backup_Super_Cell}`}>
                    {item.Backup_Super_Cell}
                  </a>
                </div>
                <div>
                  {phone}
                  <a href={`tel:${item.Backup_Super_Phone}`}>
                    {item.Backup_Super_Phone}
                  </a>
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
