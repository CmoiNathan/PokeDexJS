const PokemonList = document.getElementById("pokemon-card");



function PokeCard() {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((response) => response.json())
    .then((data) => {
        PokemonList.innerHTML = ""; 
        data.results.forEach((pokemon) => {
            
            const card = document.createElement("div");
            card.classList.add("card"); 
            card.style.width = "18rem";

            const imageElement = document.createElement("img");
            imageElement.src = "https://pokeapi.co/api/v2/pokemon/sprites/";
            imageElement.classList.add("imgPokemon"); 

            const bodyElement = document.createElement("div");
            bodyElement.classList.add("card-body"); 

            const titleElement = document.createElement("h5");
            titleElement.classList.add("card-title");
            titleElement.textContent = pokemon.name;

            const textElement = document.createElement("p");
            textElement.classList.add("card-text"); 
            textElement.textContent = pokemon.url;

            // Ajoute les éléments à la carte
            bodyElement.appendChild(titleElement);
            bodyElement.appendChild(textElement);
            card.appendChild(imageElement);
            card.appendChild(bodyElement);

            // Ajoute la carte au conteneur principal PokemonList
            PokemonList.appendChild(card);
        });
    })
    .catch((error) => {
        console.error("Erreur lors de la récupération des détails:", error);
    });
}

PokeCard();