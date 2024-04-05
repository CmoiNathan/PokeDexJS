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



// Sélectionne l'élément avec l'ID "pokemon-card" pour plus tard afficher les cards
const PokemonList = document.getElementById("pokemon-card");

// Créer le modal boostrap pour les cards
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
                    
// Définit une fonction pour créer les cartes Pokémon
async function PokeCard() {
    try {
        // Récupère les données de tous les 151 premiers Pokémon
        const PokemonResponse = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const InfoPokemon = await PokemonResponse.json();

        // Parcours les données de chaque Pokémon
        for (const [index, pokemon] of InfoPokemon.results.entries()) {
        // On calcule l'ID du Pokémon en ajoutant 1 à l'index, car les index commencent à 0 mais les IDs commencent à 1.
            const pokemonId = index + 1;


            // Récupère les données spécifiques d'un Pokémon en utilisant son ID
            const PokemonResponseID = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const pokemonData = await PokemonResponseID.json();

            // Crée une nouvelle carte pour chaque Pokémon
            const Pokemoncard = document.createElement("div");
            Pokemoncard.classList.add("card");

            // Définit le fond de la carte en fonction du type du Pokémon
            //Si le pokémon à deux types, on vient prendre les deux types dans des variables pour les utiliser ensuite dans le background de la carte
            if (pokemonData.types.length === 2) {
                const type1 = pokemonData.types[0].type.name;
                const type2 = pokemonData.types[1].type.name;
                Pokemoncard.style.background = `linear-gradient(to bottom right, ${getTypeColor(type1)}, ${getTypeColor(type1)} 50%, ${getTypeColor(type2)} 50%, ${getTypeColor(type2)})`;
            } else {
                //Si il à qu'un type, on mets juste la couleur du type en fond
                Pokemoncard.style.background = getTypeColor(pokemonData.types[0].type.name);
            }

            // Crée une image du Pokémon
            const PokeImg = document.createElement("img");
            PokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
            PokeImg.style.width = "27vh";
            PokeImg.classList.add("imgPokemon");

            // Crée le contenu de la carte
            const PokeBody = document.createElement("div");
            PokeBody.classList.add("card-body");

            // Ajoute le numéro du Pokémon à la carte
            const PokeNumber = document.createElement("p");
            PokeNumber.classList.add("card-text");
            PokeNumber.innerHTML = `n° : ${String(pokemonId).padStart(3, '0')}`;

            // Ajoute le nom du Pokémon à la carte
            const PokeName = document.createElement("h5");
            PokeName.classList.add("card-title");
            PokeName.style.color = "white";
            PokeName.innerHTML = pokemonData.name;

            // Ajoute les types du Pokémon à la carte
            const PokeTypes = document.createElement("p");
            PokeTypes.classList.add("card-text");
            PokeTypes.style.backgroundColor = "black";
            PokeTypes.style.borderRadius = "10px";

            // Pour chaque type de Pokémon présent dans les données du Pokémon
            pokemonData.types.forEach(typePoke => {
                const type = typePoke.type.name;
                const typeIcon = document.createElement("i");
                typeIcon.classList.add("fa-solid", "fa-hurricane");
                typeIcon.style.color = getTypeColor(type);
                PokeTypes.appendChild(typeIcon);
                // On ajoute un espace et le nom du type à côté de l'icône
                PokeTypes.innerHTML += " " + type + " ";
            });

            // Assemble les éléments de la carte
            PokeBody.appendChild(PokeName);
            PokeBody.appendChild(PokeNumber);
            PokeBody.appendChild(PokeTypes);
            Pokemoncard.appendChild(PokeImg);
            Pokemoncard.appendChild(PokeBody);

            // Ajoute un événement de click pour afficher les détails du Pokémon dans un modal lorsque que l'on clique sur une carte de Pokémon
            Pokemoncard.addEventListener("click", async () => {
                // Crée un modal Bootstrap
                const pokemonModal = new bootstrap.Modal(document.getElementById('pokemonModal'));
                // Récupère la chaîne d'évolutions du Pokémon de la fonction PokemonEvolutions (voir plus bas)
                const ChainPokeEvolution = await PokemonEvolutions(pokemonId);
                // On utilise map pour mapper la chaîne d'évolutions pour créer une liste d'images représentant chaque évolution
                const PokeEvolution = ChainPokeEvolution.map(evolution => `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png" style="width: 170px;" > `);
                document.getElementById('pokemonModalTitle').innerHTML = pokemonData.name;
                document.getElementById('pokemonModalImg').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
                document.getElementById('pokemonModalNumber').innerHTML = `n° : ${String(pokemonId).padStart(3, '0')}`;
                document.getElementById('pokemonModalEvolution').innerHTML = `Evolutions : ${PokeEvolution.join('')}`;
                
                try {
                    // Récupère la description du Pokémon à partir de l'API en utilisant son ID
                    const PokeDescriptionResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
                    const PokeDescription = await PokeDescriptionResponse.json();
                    // Ici on filtre et on map pour obtenir la description en anglais, en éliminant les sauts de ligne et les tabulations
                    const description = PokeDescription.flavor_text_entries
                        .filter(PokeFilter => PokeFilter.language.name === "en")
                        .map(descriptionPokemon => descriptionPokemon.flavor_text.replace(/[\n\t\f]/g, ' '));
                    // Affiche la description
                    document.getElementById('pokemonModalDescription').innerHTML = `Description : ${description[0]}`;
                } catch (error) {
                    console.error("Erreur lors de la récupération de la description du Pokémon :", error);
                }                

                // Joue le cri du Pokémon quand le modal s'ouvre
                const PokemonCry = getPokemonCryUrl(pokemonId);
                const sound = new Audio(PokemonCry);
                sound.volume = 0.021;
                sound.play();
                pokemonModal.show();
            });

            // Ajoute la carte à la liste des Pokémon
            PokemonList.appendChild(Pokemoncard);
        }
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
    }
}

// Appelle la fonction PokeCard pour afficher les cartes Pokémon
PokeCard();


// Fonction qui va prendre la chaine d'évolution du pokémon
async function PokemonEvolutions(pokemonId) {

    try {
        // On va venir obtenir des informations sur le(s) évolution(s) du Pokémon dans l'url
        const PokeEvolutionResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        const PokeEvolutionInfo = await PokeEvolutionResponse.json();
        // Obtenir l'URL de la chaîne d'évolutions à partir des informations dans la base de donnée de l'API
        const evolutionChainURL = PokeEvolutionInfo.evolution_chain.url;

        // Attendre la réponse de l'API
        const responseChain = await fetch(evolutionChainURL);
        const evolutionData = await responseChain.json();

        const chain = [];
        let chainData  = evolutionData.chain;

        // Tant que "chainData" existe, exécuter le code suivant
        while (chainData) {
            // Si le nom du pokemon est différent de celui de la carte, on push les infos car ici on veut que les évolutions du pokémon mais pas lui même
            if (chainData.species.name !== PokeEvolutionInfo.name) {
                chain.push({
                    id: chainData.species.url.split("/")[6]
                });
            }
            // On passe à l'évolution suivante dans la chaîne.
            chainData  = chainData.evolves_to[0];
        }
        return chain;
    } catch (error) {
        console.error("Erreur lors de la récupération des évolutions:", error);
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

// Appelle la fonction de défilement
Scroll();


//----------------------------------------|
//                                        |
//        CREATIONS DE LA RECHERCHE       |
//            PAR NOM ET                  |
//            TYPE DE POKEMON             |
//----------------------------------------|

// La fonction SearchPoke est la recherche des Pokémon en fonction du nom saisi dans le input
function SearchPoke() {
    // On récupère la valeur saisie dans le champ de recherche et on la met en minuscules.
    const pokeFoundName = document.getElementById("pokemon-name").value.toLowerCase();
    const pokemonCards = document.querySelectorAll(".card");

    pokemonCards.forEach(card => {
        // On récupère le nom du Pokémon de la carte et on le met en minuscules.
        const pokemonName = card.querySelector(".card-title").textContent.toLowerCase();
        // On affiche la carte si le nom du Pokémon correspond à la recherche, sinon on la cache.
        card.style.display = pokemonName.includes(pokeFoundName) ? "block" : "none";
    });
}

// recherche pour appeler la fonction SearchPoke à chaque fois qu'on écrit avec le clavier
document.getElementById("pokemon-name").addEventListener("input", SearchPoke);

SearchPoke();

// La fonction PokeSearchType est la recherche des Pokémon en fonction du type sélectionné avec le select
function PokeSearchType() {
    // Dans les options du select, on va venir inserer tous les types des pokemons
    let selectElement = document.getElementById("pokemon-type");
    let types = ["fire", "water", "grass", "electric", "normal", "fighting", "flying", "poison", "psychic", "ice", "ground", "rock", "bug", "ghost", "dragon", "fairy", "steel"];

    // On boucle à travers chaque type pour créer une option dans le menu déroulant.
    types.forEach(function(type) {
        let option = document.createElement("option");
        option.value = type;
        // On met la première lettre en majuscule pour chaque type.
        option.innerHTML = type.charAt(0).toUpperCase() + type.slice(1);
        selectElement.appendChild(option);
    });

    const select = document.getElementById("pokemon-type");

    select.addEventListener("change", function() {
        const selectedType = select.value.toLowerCase();
        const pokemonCards = document.querySelectorAll(".card");

        // On boucle à travers chaque carte de Pokémon.
        pokemonCards.forEach(card => {
            // On récupère les types du Pokémon de la carte et on les met en minuscules dans un tableau.
            const pokemonTypes = Array.from(card.querySelectorAll(".card-text")).slice(-1)[0].innerHTML.toLowerCase().trim().split(" ");
            // On affiche la carte si le type sélectionné est "tous" ou s'il correspond au type du Pokémon, sinon on la cache.
            card.style.display = (selectedType === "all" || pokemonTypes.includes(selectedType)) ? "block" : "none";
        });
    });
}

PokeSearchType();


//----------------------------------------|
//                                        |
//        GESTION DE L'AUDIO DE LA PAGE   |
//                                        |
//----------------------------------------|


const BackgroundMusicPoke = new Audio("images/pokemusic2.mp3");

BackgroundMusicPoke.volume = 0.021;

// Fonction pour démarrer la lecture de la musique
function playBackgroundMusic() {
    // Si la musique est en pause ou si elle a atteint la fin, réinitialisez et jouez-la
    if (BackgroundMusicPoke.paused || BackgroundMusicPoke.ended) {
        BackgroundMusicPoke.currentTime = 0;
        BackgroundMusicPoke.play();
    }
}

function handleClick() {
    playBackgroundMusic();
}

let PokeclickTitle3 = document.getElementById('poketitle');

PokeclickTitle3.addEventListener('click', handleClick);

// Ajouter un écouteur d'événement pour détecter lorsque la musique se termine
BackgroundMusicPoke.addEventListener('ended', function() {
    // Relancer la musique une fois qu'elle est terminée
    playBackgroundMusic();
});


// Définit une fonction pour obtenir l'URL du cri du Pokémon en fonction de son ID
function getPokemonCryUrl(pokemonId) {
    return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;
}

// Définit une fonction pour gérer le déclenchement du bruit
function PokeTitleClick() {
    const Pokeclick = new Audio('images/pokesoundclick.mp3');
    Pokeclick.volume = 0.1;
    Pokeclick.play();
    
}

// Sélectionne l'élément de fond d'écran Pokemon (le titre du Pokedex)
let PokeclickTitle = document.getElementById('poketitle');
let PokeclickTitle2 = document.getElementById('scrollArrow');

// Ajoute un écouteur d'événement au clic sur le fond d'écran Pokemon (le titre)
PokeclickTitle.addEventListener('click', PokeTitleClick);
PokeclickTitle2.addEventListener('click', PokeTitleClick);

