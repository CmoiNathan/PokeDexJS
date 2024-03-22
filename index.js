//----------------------------------------|
//                                        |
//        POKEDEX JS                      |
//        Nathan MARTINET                 |
//----------------------------------------|



//----------------------------------------|
//                                        |
//        CREATIONS DES CARDS             |
//                                        |
//----------------------------------------|



// Créer le modal boostrap
document.getElementById('pokemon-modal').innerHTML = `<div class="modal fade" id="pokemonModal" tabindex="-1" aria-labelledby="pokemonModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="pokemonModalTitle"></h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <img src="" class="modal-img" id="pokemonModalImg" alt="Pokemon Image">
                                    <p class="modal-text" id="pokemonModalNumber"></p>
                                    <p class="modal-text" id="pokemonModalDescription"></p>
                                    <p class="modal-text" id="pokemonModalEvolution"></p>
                                </div>
                            </div>  
                        </div>
                    </div>`
                    
// Sélectionne l'élément HTML avec l'ID "pokemon-card"
const PokemonList = document.getElementById("pokemon-card");

// Définit une fonction pour créer les cartes Pokémon
async function PokeCard() {
    try {
        const PokemonResponse = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const InfoPokemon = await PokemonResponse.json();

        for (const [index, pokemon] of InfoPokemon.results.entries()) {
            const pokemonId = index + 1;

            const PokemonResponseID = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const pokemonData = await PokemonResponseID.json();

            const Pokemoncard = document.createElement("div");
            Pokemoncard.classList.add("card");

            if (pokemonData.types.length === 2) {
                const type1 = pokemonData.types[0].type.name;
                const type2 = pokemonData.types[1].type.name;
                Pokemoncard.style.background = `linear-gradient(to bottom right, ${getTypeColor(type1)}, ${getTypeColor(type1)} 50%, ${getTypeColor(type2)} 50%, ${getTypeColor(type2)})`;
            } else {
                Pokemoncard.style.background = getTypeColor(pokemonData.types[0].type.name);
            }

            const PokeImg = document.createElement("img");
            PokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
            PokeImg.style.width = "27vh";
            PokeImg.classList.add("imgPokemon");

            const PokeBody = document.createElement("div");
            PokeBody.classList.add("card-body");

            const PokeNumber = document.createElement("p");
            PokeNumber.classList.add("card-text");
            PokeNumber.innerHTML = `n° : ${String(pokemonId).padStart(3, '0')}`;

            const PokeName = document.createElement("h5");
            PokeName.classList.add("card-title");
            PokeName.style.color = "white";
            PokeName.innerHTML = pokemonData.name;

            const PokeTypes = document.createElement("p");
            PokeTypes.classList.add("card-text");
            PokeTypes.style.backgroundColor = "black";
            PokeTypes.style.borderRadius = "10px";

            pokemonData.types.forEach(typePoke => {
                const type = typePoke.type.name;
                const typeIcon = document.createElement("i"); 
                typeIcon.classList.add("fa-solid", "fa-hurricane");
                typeIcon.style.color = getTypeColor(type);
                PokeTypes.appendChild(typeIcon);
                PokeTypes.appendChild(document.createTextNode(" " + type + " "));
            });

            PokeBody.appendChild(PokeName);
            PokeBody.appendChild(PokeNumber);
            PokeBody.appendChild(PokeTypes);
            Pokemoncard.appendChild(PokeImg);
            Pokemoncard.appendChild(PokeBody);

            Pokemoncard.addEventListener("click", async () => {
                const pokemonModal = new bootstrap.Modal(document.getElementById('pokemonModal'));
                const ChainPokeEvolution = await PokemonEvolutionsChain(pokemonId);
                const PokeEvolution = ChainPokeEvolution.map(evolution => `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png" alt="${evolution.name}" > `).join(" ");
                document.getElementById('pokemonModalTitle').innerHTML = pokemonData.name;
                document.getElementById('pokemonModalImg').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
                document.getElementById('pokemonModalNumber').innerHTML = `n° : ${String(pokemonId).padStart(3, '0')}`;
                document.getElementById('pokemonModalEvolution').innerHTML = `Evolutions : ${PokeEvolution}`;
                
                try {
                    const PokeDescriptionResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
                    const PokeDescription = await PokeDescriptionResponse.json();
                    const description = PokeDescription.flavor_text_entries
                        .filter(PokeFilter => PokeFilter.language.name === "en")
                        .map(descriptionPokemon => descriptionPokemon.flavor_text.replace(/[\n\t\f]/g, ' '));
                    document.getElementById('pokemonModalDescription').innerHTML = `Description : ${description[0]}`;
                } catch (error) {
                    console.error("Erreur lors de la récupération de la description du Pokémon :", error);
                }

                const PokemonCry = getPokemonCryUrl(pokemonId);
                const sound = new Audio(PokemonCry);
                sound.volume = 0.021;
                sound.play();
                pokemonModal.show();
            });

            PokemonList.appendChild(Pokemoncard);
        }
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
    }
}

// Appelle la fonction PokeCard pour afficher les cartes Pokémon
PokeCard();


async function PokemonEvolutionsChain(pokemonId) {
    try {
        const PokeEvolutionResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        const data = await PokeEvolutionResponse.json();
        const evolutionChainURL = data.evolution_chain.url;

        const responseChain = await fetch(evolutionChainURL);
        const evolutionData = await responseChain.json();

        const chain = [];
        let current = evolutionData.chain;

        while (current) {
            if (current.species.name !== data.name) {
                chain.push({
                    name: current.species.name,
                    id: current.species.url.split("/")[6]
                });
            }
            current = current.evolves_to[0];
        }

        return chain;
    } catch (error) {
        console.error("Erreur lors de la récupération de la chaîne d'évolution:", error);
        return [];
    }
}

//----------------------------------------|
//                                        |
//        CREATION DES COULEURS           |
//        SELON TYYPES                    |
//----------------------------------------|

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

//----------------------------------------|
//                                        |
//        CREATIONS DES ANIMATIONS        |
//                SCROLL                  |
//----------------------------------------|

// Définit une fonction pour gérer le défilement sur la page
function Scroll() {
    // Sélectionne l'élément de fond d'écran Pokemon
    let scrollBackground = document.getElementById('poketitle');
    // Sélectionne l'élément cible de défilement
    let pokemonTo = document.getElementById('label');

    // Ajoute un écouteur d'événement au clic sur le fond d'écran Pokemon
    scrollBackground.addEventListener('click', function() {
        // Défile jusqu'à l'élément cible de façon fluide
        pokemonTo.scrollIntoView({ behavior: 'smooth' });
    });

    // Sélectionne la flèche de défilement
    let scrollArrow = document.getElementById('scrollArrow');

    // Ajoute un écouteur d'événement au clic sur la flèche de défilement
    scrollArrow.addEventListener('click', function() {
        // Défile jusqu'à la position spécifiée de façon fluide
        window.scrollTo({
            top: 600,
            behavior: 'smooth'
        });
    });
}

// Appelle la fonction de défilement
Scroll();

//----------------------------------------|
//                                        |
//        CREATIONS DE LA RECHERCHE       |
//            PAR NOM DE POKEMON          |
//----------------------------------------|

// Définit une fonction pour la recherche de Pokémon
// Définit une fonction pour la recherche de Pokémon
function SearchPoke() {
    // Récupère la valeur saisie dans le champ de recherche et la met en minuscules
    const searchString = document.getElementById("pokemon-name").value.trim().toLowerCase();
    // Récupère le type sélectionné dans la liste déroulante
    const selectedType = document.getElementById("pokemon-type").value.toLowerCase();
    // Sélectionne le champ de recherche
    const inputField = document.getElementById("pokemon-name");

    // Ajoute un écouteur d'événement pour surveiller les saisies dans le champ de recherche
    inputField.addEventListener("input", SearchPoke);
    // Sélectionne toutes les cartes Pokémon
    const pokemonCards = document.querySelectorAll(".card");

    // Parcourt chaque carte Pokémon
    pokemonCards.forEach(card => {
        // Récupère les types du Pokémon associé à la carte
        const pokemonTypes = Array.from(card.querySelectorAll(".card-text")).map(type => type.textContent.trim().toLowerCase());
        
        // Vérifie si le type sélectionné est "Tous les types" ou si le type du Pokémon correspond au type sélectionné
        if (selectedType === 'all' || pokemonTypes.includes(selectedType)) {
            // Récupère le nom du Pokémon associé à la carte et le met en minuscule
            const pokemonName = card.querySelector(".card-title").textContent.trim().toLowerCase();
            // Récupère l'ID du Pokémon associé à la carte
            const pokemonId = card.querySelector(".card-number").textContent.trim();
            // Vérifie si le nom ou l'ID du Pokémon correspond à la recherche
            if (pokemonName.includes(searchString) || pokemonId === searchString) {
                // Affiche la carte si le nom ou l'ID correspond et que le type correspond
                card.style.display = "block";
            } else {
                // Masque la carte si le nom ou l'ID ne correspond pas mais que le type correspond
                card.style.display = "none";
            }
        } else {
            // Masque la carte si le type du Pokémon ne correspond pas au type sélectionné
            card.style.display = "none";
        }
    });
}


// Appelle la fonction de recherche de Pokémon
SearchPoke();


//----------------------------------------|
//                                        |
//        GESTION DE L'AUDIO DE LA PAGE   |
//                                        |
//----------------------------------------|


// Déclarez la variable BackgroundMusicPoke en dehors de la fonction DOMContentLoaded
const BackgroundMusicPoke = document.getElementById("background-music");

// Attendez que le DOM soit entièrement chargé
document.addEventListener("DOMContentLoaded", function() {
    // Démarrez la lecture de l'audio ici
    BackgroundMusicPoke.volume = 0.021;
    BackgroundMusicPoke.play();
});



// Définit une fonction pour réinitialiser et lire la musique en boucle
function playBackgroundMusic() {
    BackgroundMusicPoke.currentTime = 0; // Réinitialise la musique au début
    BackgroundMusicPoke.play(); // Joue la musique
}

// Écoute l'événement 'ended' pour réinitialiser et lire à nouveau la musique en boucle
BackgroundMusicPoke.addEventListener('ended', playBackgroundMusic);

// Joue la musique pour la première fois
playBackgroundMusic();


// Définit une fonction pour obtenir l'URL du cri du Pokémon en fonction de son ID
function getPokemonCryUrl(pokemonId) {
    return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;
}

// Définit une fonction pour gérer le déclenchement du bruit
function PokeTitleClick() {
    const Pokeclick = new Audio('images/pokesoundclick.mp3'); // Remplacez 'chemin_vers_le_son.mp3' par le chemin vers votre fichier audio
    Pokeclick.volume = 0.1;
    Pokeclick.play();
    
}

// Sélectionne l'élément de fond d'écran Pokemon (le titre du Pokedex)
let PokeclickTitle = document.getElementById('poketitle');

// Ajoute un écouteur d'événement au clic sur le fond d'écran Pokemon (le titre)
PokeclickTitle  .addEventListener('click', PokeTitleClick);

