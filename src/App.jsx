import React, {useState, useEffect} from 'react';
import './App.css';

const URL_PATH = "https://raw.githubusercontent.com/joseluisq/pokemons/master/pokemons.json";

const App = () => {
const [search, setSearch] = useState("");
const [maxCP, setMaxCP] = useState(false);
const [results, setResults] = useState([]);
const [filtered, setFiltered] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
    setLoading(true);
    fetch(URL_PATH)
        .then(response => response.json())
        .then(data => {
            setResults(data.results);
            setLoading(false);
        });
}, []);

useEffect(() => {
    const newData = results.filter(
        (pokemon) => (pokemon.name.includes(search) || pokemon.type.some((t)=> t.includes(search)))
        );
    const sorted = newData.sort((pokemon1, pokemon2) => {
        if(!maxCP) {
            console.log('name');
            return pokemon1.name.includes(search) ? -1 : 1
        } else {
            console.log(pokemon1.total);
            return pokemon2.total - pokemon1.total;
        }
    }).slice(0,4);
    setFiltered(sorted);
}, [search, maxCP]);

const handleChange = ({target}) => setSearch(target.value);

const handleToggle = ({target}) => { console.log(target.checked); setMaxCP(target.checked)};

return (
    <>
        <label htmlFor="maxCP" className="max-cp">
            <input type="checkbox" id="maxCP" onChange={handleToggle}/>
            <small>
                Maximum Combat Points
            </small>
        </label>
        <input type="text" className="input" placeholder="Pokemon or type" onChange={handleChange}/>
        {loading && (<div className="loader"></div>)}
        <ul className="suggestions">
            {filtered.map((pokemon) => (
                <li key={pokemon.name}>
                    <img src={pokemon.sprites.normal} alt={pokemon.name} />
                    <div className="info">
                        <h1>{pokemon.name}</h1>
                        {pokemon.type.map((t) => <span key={t} className={`type ${t.toLowerCase()}`}>{t}</span>)}
                    </div>
                </li>
            ))}
            {filtered.length === 0 && !loading && (
                <li>
                    <img src="https://cyndiquil721.files.wordpress.com/2014/02/missingno.png" alt="" />
                    <div className="info">
                        <h1 className="no-results">
                            No results
                        </h1>
                    </div>
                </li>
            )}
        </ul>
    </>
);
};

export default App;
