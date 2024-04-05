# README - Pokedex JS

Mon projet est un Pokedex web développée en JavaScript qui affiche les informations des 151 premiers Pokémon. Il utilise l'API PokeAPI pour récupérer les données des Pokémon, telles que leurs noms, types, descriptions et évolutions. L'interface utilisateur est conçue avec HTML et Bootstrap pour afficher les cartes des Pokémon de manière interactive.

/!\ Nom des pokémon en anglais

## Fonctionnalités

- Affichage des cartes des 151 premiers Pokémon avec leurs images, noms, numéros, types et évolutions.
- Recherche des Pokémon par leur nom, avec une correspondance en temps réel lors de la saisie.
- Filtrage des Pokémon par type à l'aide d'un menu déroulant.
- Lecture d'une musique de fond et de sons de clic pour une expérience immersive.
- Animation de défilement fluide vers une section spécifique de la page.

## Comment exécuter le projet

1. Clonez ce dépôt sur votre machine locale :
   ```bash
   git clone https://github.com/votre-utilisateur/votre-depot.git
   ```
2. Ouvrez le fichier `index.html` dans votre navigateur web.

3. Si vous voulez plus de pokémon que la première génération, changer la valeur à la ligne 42 en : const PokemonResponse = await fetch("https://pokeapi.co/api/v2/pokemon?limit=LIMITEAMETTRE_max 1025");
## Technologies utilisées

- JavaScript
- HTML
- Bootstrap
- PokeAPI

## Attribution des couleurs des types de Pokémon

Les couleurs des types de Pokémon sont attribuées comme suit :

- Feu : Orange
- Eau : Bleu
- Plante : Vert
- Électrique : Jaune
- Normal : Gris
- Combat : Marron
- Vol : Bleu ciel
- Poison : Violet
- Psy : Violet foncé
- Glace : Bleu clair
- Sol : Marron foncé
- Roche : Gris foncé
- Insecte : Olive
- Spectre : Indigo
- Dragon : Rouge foncé
- Fée : Rose
- Acier : Gris

## Auteur

Ce projet a été développé par Nathan MARTINET.

## Remarques

- Pour jouer le cri d'un Pokémon, assurez-vous d'avoir une connexion Internet active, car les fichiers audio sont chargés à partir d'Internet.
- Les images des Pokémon sont également chargées à partir d'Internet, donc une connexion Internet est requise pour les afficher correctement.
