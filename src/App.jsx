import { useState, useCallback, useEffect } from 'react';
import residential from "./residentials";
import './App.css';
import Map from './components/map.jsx';


const phone = "\u{260E}";
const cellPhone = "\u{1F4F1}";

function App() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [seletedLocation, setSelectedlocation] = useState("")
  // Search function for both address and name
  const searchProperties = useCallback((query) => {
    const lowerCaseQuery = query.toLowerCase();
    const uniqueProperties = new Set();

    return residential.filter((property) => {
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
  const addAddress = useCallback((address, Longitude) => {
    setSelectedRoutes((prevRoutes) =>
      prevRoutes.includes(address)
        ? (alert("This address is already in the route."), prevRoutes)
        : [...prevRoutes, [address, Longitude]]
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      const result = searchProperties(search);
      setSearchResult(result);
      alert("Please enter a valid search query.");
      return;
    }
    const result = searchProperties(search);
    setSearchResult(result);
  };

  useEffect(() => {
    console.log('Selected routes:', selectedRoutes);
  }, [selectedRoutes]);

  return (
    <div>
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

      <Map message={seletedLocation} />

      <h2>Route</h2>
      {selectedRoutes.map((item, index) => (
        <div>
          <p key={index}>{item}</p>

        </div>
      ))}

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
              <button onClick={() => addAddress(item.Address, item.Longitude)}>
                Add Address To Route
              </button>
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
              <hr />
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
