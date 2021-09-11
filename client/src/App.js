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

const ResultsDisplay = ({ searchValue }) => {
  const minIdLength = 1;
  const [searchResults, setSearchResults] = useState("");

  useEffect(() => {
    codexService
      .getAll()
      .then((result) => {
        console.log("called search");
        console.log(result);
        setSearchResults(result);
      })
      .catch((error) => console.log(error));
  }, [searchValue]);

  if (searchValue >= minIdLength) {
  }

  return (
    <div className="resultsDisplay">
      {searchValue ? `Searching for id: ${searchValue}` : "Enter an Id"}
    </div>
  );
};

//props contains everything passed into <PersonForm onChange="test" spark=1337/>
// props.spark == 1337
const PersonForm = (props) => {
  return (
    <div>
      <form onSubmit={props.addName}>
        <div>
          Name <input value={props.newName} onChange={props.handleNameChange} />
        </div>
        <div>
          Number{" "}
          <input value={props.newNumber} onChange={props.handleNumberChange} />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
};

// const NumberDisplay = ({ personsFiltered, handleDelete }) => {
//   return (
//     <div>
//       <ul>
//         {personsFiltered.map((person) => (
//           <li className="person" key={person.name}>
//             {console.log("iddid", person.id)}
//             {person.name} {person.number}{" "}
//             <button onClick={() => handleDelete(person.id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    style: null,
  });

  //use effect is called after the site has rendered.

  //promise has 3 states: fullfiled, error, pending
  //
  useEffect(() => {
    let i = 0;
    console.log("effect ", i);
    codexService
      .getAll() //network request -> promise: pending
      //fullfiled = then()
      //error = catch()
      .then((response) => {
        setPersons(response);
      })
      .catch((error) => {
        console.log("error");
      });
  }, []);

  const Notification = ({ notificationDetails }) => {
    console.log(notificationDetails);
    const error = {
      color: "red",
      background: "lightgrey",
      fontSize: 20,
      borderStyle: "solid",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    };

    const success = {
      color: "green",
      background: "lightgrey",
      fontSize: 20,
      borderStyle: "solid",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    };
    if (notificationDetails.message === null) return null;
    let style = undefined;

    if (notificationDetails.style === "success") style = success;

    if (notificationDetails.style === "error") style = error;

    return <div style={style}>{notificationDetails.message}</div>;
  };

  const addName = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      let existingPerson = persons.find((person) => person.name === newName);
      if (
        window.confirm(
          `${existingPerson.name} already exists in the phonebook, replace the old with the new number?`
        )
      ) {
        codexService
          .change(existingPerson.id, { ...existingPerson, number: newNumber })
          .then((response) => {
            const changedPersons = persons.map((p) =>
              p.id !== existingPerson.id ? p : { ...p, number: newNumber }
            );

            setPersons(changedPersons);
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            setNotification({
              message: `${existingPerson.name} is not found on the server`,
              style: "error",
            });
            setTimeout(() => setNotification({ message: null }), 5000);
          });
      }
      return;
    }

    const person = {
      name: newName,
      number: newNumber,
    };

    console.log(newName);
    codexService.create(person).then((response) => {
      setPersons(persons.concat(response));
      setNewName("");
      setNewNumber("");
      setNotification({
        message: `Added ${response.name} to the Phonebook`,
        style: "success",
      });
      setTimeout(() => setNotification({ message: null }), 5000);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("hi")) {
      codexService.deletePerson(id);
      setPersons(persons.filter((person) => person.id !== id));
    }
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    console.log(event.target.value);
    setSearchValue(event.target.value);
  };

  const [searchValue, setSearchValue] = useState("");

  // const personsFiltered = searchValue
  //   ? searchValue.filter((person) =>
  //       person.name.toLowerCase().includes(searchValue.toLowerCase())
  //     )
  //   : persons;

  return (
    <div>
      <h1 className="header">Maple Codex</h1>
      <Search handleSearchChange={handleSearchChange} />
      <ResultsDisplay searchValue={searchValue} />
      {/* <Notification notificationDetails={notification} />

      <h2>Add a new</h2>
      <PersonForm
        addName={addName} //pass in function
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <NumberDisplay
        personsFiltered={personsFiltered}
        handleDelete={handleDelete}
      /> */}
    </div>
  );
};

// nodeserver handles the xml parsing on request
// if a request comes in, node parses the file, sends result back
// xml in static files

// user searches for id.
// our server checks the id
// in mapfile, itemfile, skillfile
// whatever match it finds
// send back map: id 1 == tria, item 1 = assassin star, skill 1 = gm strike

export default App;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// const api_key = process.env.REACT_APP_API_KEY;

// const Search = ({ handleSearchChange }) => {
//   return (
//     <div>
//       Search for a country
//       <input onChange={handleSearchChange} />
//     </div>
//   );
// };

// const Country = ({ country, setShowCountry, showCountry }) => {
//   console.log("call to country", country);
//   const handleShowClick = (event) => {
//     setShowCountry(showCountry.concat(country));
//     console.log("bttn clicked", country.name, showCountry);
//   };

//   return (
//     <div>
//       {country.name}
//       <button onClick={handleShowClick}>show</button>
//     </div>
//   );
// };

// const WeatherInfo = ({ countryName, weather }) => {
//   if (weather.length > 0) {
//     // console.log('wheether', weather.main.temp)
//     return (
//       <div>
//         <h3>Weather for {weather[0].name}</h3>
//         <img
//           alt="weather"
//           title={weather[0].weather[0].description}
//           height="100"
//           src={`http://openweathermap.org/img/wn/${weather[0].weather[0].icon}@4x.png`}
//         />
//         <p>Temperature {weather[0].main.temp} Celsius</p>
//         <p>Feels like: {weather[0].main.feels_like} Celsius</p>
//         <p>Humidity {weather[0].main.humidity}%</p>
//         <p>Wind Speed {weather[0].wind.speed}mph</p>
//       </div>
//     );
//   } else
//     return (
//       <div>
//         <h3>Weather</h3>Weather data not ready yet
//       </div>
//     );
// };

// const CountryInfo = ({ country }) => {
//   const [weather, setWeather] = useState([]);

//   useEffect(() => {
//     //console.log(countryName)
//     console.log("EFFECTOO", country.capital);
//     axios
//       .get(
//         "http://api.openweathermap.org/data/2.5/weather?q=" +
//           country.capital +
//           "&appid=" +
//           api_key +
//           "&units=metric"
//       )
//       .then((response) => {
//         console.log("weather", response.data);
//         setWeather([].concat(response.data));
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }, [country.capital]);

//   return (
//     <div>
//       <img className="photo" height="150" alt="flag" src={country.flag} />
//       <h2>{country.name} </h2>
//       <p>
//         <b>Population</b> {country.population}{" "}
//       </p>
//       <p>
//         <b>Capital</b> {country.capital}{" "}
//       </p>
//       <div>
//         <h3>Languages</h3>
//         {country.languages.map((language) => (
//           <p key={language.name}>{`${language.name}`}</p>
//         ))}
//       </div>
//       <WeatherInfo countryName={country.name} weather={weather} />
//     </div>
//   );
// };
// const CountryDisplay = ({
//   countries,
//   searchValue,
//   showCountry,
//   setShowCountry,
// }) => {
//   console.log("SHOWCOUNTRY", showCountry);
//   if (showCountry) console.log("showcountry is true");
//   let countriesFiltered = countries.filter((country) =>
//     country.name.toLowerCase().includes(searchValue.toLowerCase())
//   );

//   if (searchValue === "undefined")
//     return <div>please enter a country to search for</div>;

//   if (countriesFiltered.length === 1) {
//     // && countriesFiltered[0].name.toLowerCase() === searchValue.toLowerCase())
//     console.log("=1");

//     let country = countriesFiltered[0];
//     return <CountryInfo country={country} />;
//   }

//   if (showCountry.length > 0) {
//     console.log("showcountry.length >0");
//     return <CountryInfo country={showCountry[0]} />;
//   }
//   if (countriesFiltered.length >= 10) {
//     console.log("> 10");
//     return <div>please further specify your search</div>;
//   }

//   if (countriesFiltered.length <= 10) {
//     console.log("< 10");
//     return (
//       <div>
//         {countriesFiltered.map((country) => {
//           return (
//             <Country
//               key={country.name}
//               country={country}
//               setShowCountry={setShowCountry}
//               showCountry={showCountry}
//             />
//           );
//         })}
//       </div>
//     );
//   }
// };

// const App = () => {
//   const [countries, setCountries] = useState([]);
//   const [searchValue, setSearchValue] = useState("undefined");
//   const [showCountry, setShowCountry] = useState([]);

//   const handleSearchChange = (event) => {
//     // console.log(event.target.value)
//     setSearchValue(event.target.value);
//     if (showCountry.length > 0) setShowCountry([]);
//   };

//   useEffect(() => {
//     console.log("effect");
//     axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
//       setCountries(response.data);
//       console.log("response received", response);
//     });
//   }, []);
//   console.log("render", countries.length, "countries");

//   //console.log('counteries filtered', countriesFiltered)

//   return (
//     <div>
//       <h1>Countries</h1>

//       <Search handleSearchChange={handleSearchChange} />
//       <CountryDisplay
//         countries={countries}
//         searchValue={searchValue}
//         showCountry={showCountry}
//         setShowCountry={setShowCountry}
//       />
//     </div>
//   );
// };

// export default App;
