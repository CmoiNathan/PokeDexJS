// Sélectionne l'élément HTML avec l'ID "pokemon-card"
const PokemonList = document.getElementById("pokemon-card");

// Définit une fonction pour créer les cartes Pokémon
function PokeCard() {
    // Effectue une requête pour récupérer les données des 151 premiers Pokémon
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
        .then((response) => response.json()) // Convertit la réponse en JSON
        .then((Info) => {

            // Boucle à travers les résultats des Pokémon
            Info.results.forEach((pokemon, index) => {
                const pokemonId = index + 1 //Ajoute 1 à chaque pokémon = ID du pokemon

                // Effectue une requête pour récupérer les détails du Pokémon
                fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
                    .then((response) => response.json()) // Convertit la réponse en JSON
                    .then((pokemonData) => {
                        // Crée un élément div pour la carte Pokémon
                        const Pokemoncard = document.createElement("div");
                        Pokemoncard.classList.add("card"); // Ajoute la classe "card"
                        Pokemoncard.style.background = getTypeColor(pokemonData.types[0].type.name);
                        
                        // Crée une classe CSS spéciale pour diviser le fond en diagonale pour les Pokémon ayant deux types
                        if (pokemonData.types.length === 2) {
                            const type1 = pokemonData.types[0].type.name;
                            const type2 = pokemonData.types[1].type.name;    
                            Pokemoncard.style.background = `linear-gradient(to bottom right, ${getTypeColor(type1)}, ${getTypeColor(type1)} 50%, ${getTypeColor(type2)} 50%, ${getTypeColor(type2)})`;
                        } else {
                            // Pour les Pokémon avec un seul type
                            Pokemoncard.style.background = getTypeColor(pokemonData.types[0].type.name);
                        }

                        // Crée un élément img pour l'image du Pokémon
                        const PokeImg = document.createElement("img");
                        PokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`; // Définit la source de l'image
                        PokeImg.style.width = "27vh" // Mets la taille à 27
                        PokeImg.classList.add("imgPokemon"); // Ajoute la classe "imgPokemon"

                        // Crée un élément div pour le corps de la carte
                        const PokeBody = document.createElement("div");
                        PokeBody.classList.add("card-body"); // Ajoute la classe "card-body"

                        // Crée un paragraphe pour afficher le numéro du Pokémon
                        const PokeNumber = document.createElement("p");
                        PokeNumber.classList.add("card-text"); // Ajoute la classe "card-text"
                        PokeNumber.innerHTML = `n° : ${String(pokemonId).padStart(3, '0')}`;

                        // Crée un titre pour afficher le nom du Pokémon
                        const PokeName = document.createElement("h5");
                        PokeName.classList.add("card-title"); // Ajoute la classe "card-title"
                        PokeName.style.color = "white" // Mets le nom du pokemon en blanc
                        PokeName.innerHTML = pokemonData.name; // Définit le contenu du titre

                        // Crée un paragraphe pour afficher les types du Pokémon
                        const PokeTypes = document.createElement("p");
                        PokeTypes.classList.add("card-text"); // Ajoute la classe "card-text"
                        PokeTypes.style.backgroundColor = "black" // Ajoute un fond noir
                        PokeTypes.style.borderRadius = "10px" // Arrondi les bords

                        // Ajouter l'icône à la couleur appropriée pour chaque type du Pokémon
                        pokemonData.types.forEach(typePoke => {
                            const type = typePoke.type.name;
                            const typeIcon = document.createElement("i");
                            typeIcon.classList.add("fa-solid", "fa-hurricane");
                            typeIcon.style.color = getTypeColor(type);
                            PokeTypes.appendChild(typeIcon);
                            PokeTypes.appendChild(document.createTextNode(" " + type + " "));
                        });

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

// Fonction pour obtenir la couleur en fonction du type
function getTypeColor(types) {
    switch (types) {
        case "fire":
            return "orange";
        case "water":
            return "#4366e6";
        case "grass":
            return "green";
        case "electric":
            return "#d6d060";
        case "normal":
            return "#dededc";
        case "fighting":
            return "brown";
        case "flying":
            return "skyblue";
        case "poison":
            return "purple";
        case "psychic":
            return "#94539e";
        case "ice":
            return "lightblue";
        case "ground":
            return "saddlebrown";
        case "rock":
            return "darkgray";
        case "bug":
            return "olive";
        case "ghost":
            return "indigo";
        case "dragon":
            return "darkred";
        case "fairy":
            return "pink";
        case "steel":
            return "#aca4ac"
        default:
            return "black";
    }
}

function Scroll() {
    let scrollBackground = document.getElementById('poketitle');
    let pokemonTo = document.getElementById('label');

    scrollBackground.addEventListener('click', function() {
        pokemonTo.scrollIntoView({ behavior: 'smooth' });
    });

    let scrollArrow = document.getElementById('scrollArrow');

    scrollArrow.addEventListener('click', function() {
        window.scrollTo({
            top: 600,
            behavior: 'smooth'
        });
    });
}

Scroll();

function SearchPoke() {
    const pokeFound = document.getElementById("pokemon-name").value.toLowerCase();
    const inputField = document.getElementById("pokemon-name");

    inputField.addEventListener("input", SearchPoke);
    const pokemonCards = document.querySelectorAll(".card");

    pokemonCards.forEach(card => {
        const pokemonName = card.querySelector(".card-title").textContent.toLowerCase();
        
        if (pokemonName.includes(pokeFound)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

SearchPoke();
