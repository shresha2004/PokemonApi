import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const url = 'https://pokeapi.co/api/v2/pokemon?limit=50';

  useEffect(() => {
    getPokemons();
  }, []);

  useEffect(() => {
    filterPokemons();
  }, [searchInput, pokemonData]);

  const getPokemons = async () => {
    try {
      const response = await axios.get(url);
      const pokemons = response.data.results;

      const pokemonDetails = await Promise.all(
        pokemons.map(async (pokemon) => {
          const details = await axios.get(pokemon.url);
          return details.data;
        })
      );

      setPokemonData(pokemonDetails);
    } catch (err) {
      console.error('Error in fetching:', err);
    }
  };

  const filterPokemons = () => {
    const filtered = pokemonData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div>
      <h1>Pokemon List</h1>

      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="search-input"
      />

      <div className="container">
        {filteredData.map((pokemon) => (
          <div className="card">
          <div key={pokemon.id} className='card-body' >
            <h2 className='card-title'>{pokemon.name}</h2>
            <img className='card-img-top'
              src={pokemon.sprites.front_default}
              alt={`${pokemon.name} image`}
            />
          </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}

export default App;
