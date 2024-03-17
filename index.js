const PokemonList = document.getElementById("pokemon-card");

function PokeCard() {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((response) => response.json())
    .then((Info) => {
        PokemonList.innerHTML = ""; 
        Info.results.forEach((pokemon) => {
            const pokemonId = pokemon.url.split("/")[6];
            
            // Récupérer les informations sur le type du Pokémon
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
            .then((response) => response.json())
            .then((pokemonData) => {
                // Extraire les types du Pokémon
                const types = pokemonData.types.map((type) => type.type.name).join(", ");
                
                // Créer la carte Pokémon avec les informations sur le type
                const Pokemoncard = document.createElement("div");
                Pokemoncard.classList.add("card"); 
                Pokemoncard.style.width = "15rem";

                const PokeImg = document.createElement("img");
                PokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
                PokeImg.classList.add("imgPokemon"); 

                const PokeBody = document.createElement("div");
                PokeBody.classList.add("card-body"); 

                const PokeNumber = document.createElement("p");
                PokeNumber.classList.add("card-text");
                PokeNumber.textContent = `n° : ${pokemonId}`;

                const PokeName = document.createElement("h5");
                PokeName.classList.add("card-title");
                PokeName.textContent = pokemon.name;

                const PokeTypes = document.createElement("p");
                PokeTypes.classList.add("card-text"); 
                PokeTypes.textContent = `Type(s) : ${types}`;

                // Ajoute les éléments à la carte
                PokeBody.appendChild(PokeName);
                PokeBody.appendChild(PokeNumber);
                PokeBody.appendChild(PokeTypes);
                Pokemoncard.appendChild(PokeImg);
                Pokemoncard.appendChild(PokeBody);

                // Ajoute la carte au conteneur principal PokemonList
                PokemonList.appendChild(Pokemoncard);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des détails du Pokémon:", error);
            });
        });
    })
    .catch((error) => {
        console.error("Erreur lors de la récupération des détails:", error);
    });
}

PokeCard();
