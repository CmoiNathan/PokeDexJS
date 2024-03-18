// Sélectionne l'élément HTML avec l'ID "pokemon-card"
const PokemonList = document.getElementById("pokemon-card");

// Définit une fonction pour créer les cartes Pokémon
function PokeCard() {
    // Effectue une requête pour récupérer les données des 151 premiers Pokémon
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((response) => response.json()) // Convertit la réponse en JSON
    .then((Info) => {
        PokemonList.innerHTML = ""; // Efface le contenu précédent

        // Boucle à travers les résultats des Pokémon
        Info.results.forEach((pokemon) => {
            const pokemonId = pokemon.url.split("/")[6]; // Récupère l'ID du Pokémon à partir de l'URL

            // Effectue une requête pour récupérer les détails du Pokémon
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
            .then((response) => response.json()) // Convertit la réponse en JSON
            .then((pokemonData) => {
                // Extraire les types du Pokémon
                const types = pokemonData.types.map((type) => type.type.name).join(", ");

                // Crée un élément div pour la carte Pokémon
                const Pokemoncard = document.createElement("div");
                Pokemoncard.classList.add("card"); // Ajoute la classe "card"
                Pokemoncard.style.width = "15rem"; // Définit la largeur de la carte

                // Crée un élément img pour l'image du Pokémon
                const PokeImg = document.createElement("img");
                PokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`; // Définit la source de l'image
                PokeImg.classList.add("imgPokemon"); // Ajoute la classe "imgPokemon"

                // Crée un élément div pour le corps de la carte
                const PokeBody = document.createElement("div");
                PokeBody.classList.add("card-body"); // Ajoute la classe "card-body"

                // Crée un paragraphe pour afficher le numéro du Pokémon
                const PokeNumber = document.createElement("p");
                PokeNumber.classList.add("card-text"); // Ajoute la classe "card-text"
                PokeNumber.innerHTML = `n° : ${pokemonId}`; // Définit le contenu du paragraphe

                // Crée un titre pour afficher le nom du Pokémon
                const PokeName = document.createElement("h5");
                PokeName.classList.add("card-title"); // Ajoute la classe "card-title"
                PokeName.innerHTML = pokemon.name; // Définit le contenu du titre

                // Crée un paragraphe pour afficher les types du Pokémon
                const PokeTypes = document.createElement("p");
                PokeTypes.classList.add("card-text"); // Ajoute la classe "card-text"
                PokeTypes.innerHTML = `<i class="fa-solid fa-hurricane"></i> : ${types}`; // Définit le contenu du paragraphe

                // Ajoute les éléments à la carte Pokémon
                PokeBody.appendChild(PokeName);
                PokeBody.appendChild(PokeNumber);
                PokeBody.appendChild(PokeTypes);
                Pokemoncard.appendChild(PokeImg);
                Pokemoncard.appendChild(PokeBody);

                // Ajoute la carte au conteneur principal PokemonList
                PokemonList.appendChild(Pokemoncard);
            })
            .catch((error) => {
                // Gère les erreurs lors de la récupération des détails du Pokémon
                console.error("Erreur lors de la récupération des détails du Pokémon:", error);
            });
        });
    })
    .catch((error) => {
        // Gère les erreurs lors de la récupération des détails
        console.error("Erreur lors de la récupération des détails:", error);
    });
}

// Appelle la fonction PokeCard pour afficher les cartes Pokémon
PokeCard();


let scrollBackground = document.getElementById('poketitle');
let pokemonTo = document.getElementById('label');

scrollBackground.addEventListener('click', function() {
    pokemonTo.scrollIntoView({ behavior: 'smooth' });
});
