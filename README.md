# Réponses au TP sur la PokéAPI

## Nathan MARTINET

### 1. Création d'une Page Web Simple

Pour structurer une page HTML affichant une liste de Pokémon et un formulaire de recherche, nous avons utilisé des balises `<div>` pour deux sections principales : une pour la liste de Pokémon et une autre pour le formulaire de recherche. Le formulaire contient un champ de saisie `<input>` pour le numéro du Pokémon et un bouton `<button>` pour soumettre la recherche.

```html
<div id="pokemon-card"></div>
<form method="post" class="form-pokedex">
    <div class="mb-3">
        <label for="pokemon-name" class="label-poke" id="label"></label>
        <input type="text" id="pokemon-name" name="pokemon-name" class="input-poke" placeholder="Pikachu...">
    </div>
</form>
```

### 2. Affichage de Plusieurs Pokémon Issus d'une Liste

Pour afficher une liste initiale de Pokémon, nous avons utilisé l'endpoint `/pokemon` de l'API PokeAPI avec la requête fetch. Nous avons traité la réponse avec `.json()` et parcouru les données pour extraire les informations nécessaires, telles que le nom du Pokémon et son image, puis nous les avons affichées dans le HTML.

```javascript
fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((response) => response.json())
    .then((Info) => {
        Info.results.forEach((pokemon, index) => {
            const pokemonId = index + 1;
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
                .then((response) => response.json())
                .then((pokemonData) => {
                    // Crée et affiche les cartes Pokémon
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des détails du Pokémon:", error);
                });
        });
    })
    .catch((error) => {
        console.error("Erreur lors de la récupération des détails:", error);
    });
```

### 4. Recherche de Pokémon Grâce à un Formulaire

Pour implémenter la fonctionnalité de recherche de Pokémon par leur numéro, nous avons ajouté un écouteur d'événements `input` au champ de saisie du formulaire. Nous avons ensuite parcouru toutes les cartes Pokémon et affiché celles dont le nom correspond à la recherche en modifiant leur style pour les rendre visibles ou invisibles.

```javascript
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
```

### 5. Gestion d'Erreur

Pour gérer les erreurs, comme une recherche qui ne retourne aucun résultat, nous avons utilisé un bloc try/catch autour de notre appel fetch pour gérer les erreurs de réseau. Nous avons également vérifié le statut de la réponse et affiché un message d'erreur à l'utilisateur si nécessaire.

### 6. Manipulation d'Objet et de Tableau en JS

Nous avons utilisé des méthodes telles que `.forEach()` pour parcourir les tableaux de données retournés par l'API PokeAPI et accédé aux propriétés des objets pour extraire les informations nécessaires, telles que le nom du Pokémon, ses types et son image.

### 7. Utilisation de Fetch et Résolution de Promesses

Nous avons utilisé fetch pour faire des requêtes asynchrones à l'API PokeAPI et traité les données retournées en utilisant les méthodes `.then()` pour traiter la réponse une fois que la promesse est résolue.

### 8. Usage du Format JSON

Après avoir reçu la réponse de fetch, nous avons utilisé la méthode `.json()` pour convertir la réponse en un objet JavaScript. Nous avons exploré la structure de l'objet JSON dans la console pour comprendre comment accéder aux différentes valeurs dont nous avions besoin.