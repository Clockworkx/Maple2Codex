import React, { useState, useEffect } from "react";
import codexService from "./services/codexService";

const Search = ({ handleSearchChange }) => {
  return (
    <div className="search">
      Search Id
      <input onChange={handleSearchChange} />
    </div>
  );
};

const ResultsDisplay = ({ searchValue, searchResults }) => {
  return (
    <div className="resultsDisplay">
      {searchValue ? `Searching for id: ${searchValue}` : "Enter an Id"}
      <p>
        Results:
        {console.log("SeARCH", searchResults)}
        {searchResults.map((item) => `${item.id} ${item.itemInfo}`)}
      </p>
    </div>
  );
};

const App = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchValue.length === 0) return;
    codexService
      .getItem(searchValue)
      .then((result) => {
        console.log("called search");
        console.log("from callbac", result);
        setSearchResults((s) => s.concat(result));
      })
      .catch((error) => console.log(error));
  }, [searchValue]);

  const handleSearchChange = (event) => {
    // console.log(event.target.value);
    setSearchValue(event.target.value);
  };

  return (
    <div>
      <h1 className="header">Maple Codex</h1>
      <Search handleSearchChange={handleSearchChange} />
      <ResultsDisplay searchResults={searchResults} />
    </div>
  );
};

export default App;
