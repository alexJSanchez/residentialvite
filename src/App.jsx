import { useState } from 'react';
import residential from "./residentials"; // Assuming this is your data
import './App.css';
const phone = "\u{260E}";
const cellPhone = "\u{1F4F1}"
function App() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]); // Initialize as an empty array

  // Search function for both address and name
  function searchProperties(query) {
    const lowerCaseQuery = query.toLowerCase();
    const uniqueProperties = new Set();

    const filteredResults = residential.filter(property => {
      const lowerCaseAddress = property.Address.toLowerCase();
      const lowerCaseSuper = property.Super.toLowerCase(); // Assuming 'Super' is the name field

      const matchesAddress = lowerCaseAddress.includes(lowerCaseQuery);
      const matchesName = lowerCaseSuper.includes(lowerCaseQuery);

      const uniqueKey = `${property.Address}-${property.Super}`;

      if ((matchesAddress || matchesName) && !uniqueProperties.has(uniqueKey)) {
        uniqueProperties.add(uniqueKey); // Add the unique key to the Set
        return true; // Include in filtered result
      }

      return false; // Exclude if it's a duplicate
    });

    return filteredResults; // Return the filtered results
  }

  function HandleSubmit(e) {
    e.preventDefault();
    const searchQuery = e.target.searchName.value;
    const result = searchProperties(searchQuery); // Use the updated search function
    setSearchResult(result); // Set searchResult with the result of the search
  }

  console.log(searchResult);

  return (
    <div>
      <form className="searchForm" onSubmit={HandleSubmit}>
        <label>Search</label>
        <input
          type="text"
          name="searchName"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Updates state for input value
        />
        <button type="submit">Submit</button>
      </form>

      {/* Display search results */}
      <div className="results-container">
        {searchResult.length > 0 ? (
          searchResult.map((item) => (
            <div key={`${item.Address}-${item.Super}`} className="result-card"> {/* Use a unique key */}
              <img src={item.image} alt={`Image of ${item.Super}`} className="result-image" />
              <h4>{item.Super}</h4>
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
                <a href={`tel:${item.Super_Cell}`}>{item.Super_Cell}</a> {/* Clickable phone link */}
              </div>
              <div>
                {phone}
                <a href={`tel:${item.Super_Phone}`}>{item.Super_Phone}</a> {/* Clickable phone link */}
              </div>
              <hr></hr>
              <div>
                <h3>Backup Super</h3>
                <h4>{item.Backup_Super}</h4>
                <div>
                  {phone}
                  <a href={`tel:${item.Super_Phone}`}>{item.Backup_Super_Cell}</a> {/* Clickable phone link */}
                </div>
                <div>
                  {phone}
                  <a href={`tel:${item.Super_Phone}`}>{item.Backup_Super_Phone}</a> {/* Clickable phone link */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No results found.</p> // Display message if no results are found
        )}
      </div>
    </div>
  );
}

export default App;
