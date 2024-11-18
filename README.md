# Boutique-11ty

Une petite boutique en ligne construite avec [11ty](https://www.11ty.dev/).

## Objectif

Créer une boutique simple et minimaliste pour vendre des objets ou des prestations sans complexité.

## Les fonctionnalités

### Terminées

-   US-07 Gestion du panier

    -   [x] ajouter un produit
    -   [x] gère les badges du panier
    -   [x] récupérer les données sur la page panier
    -   [x] changer la quantité et supprimer
    -   [x] mettre en page
    -   [x] gérer les boutons "déjà ajouté"
    -   [x] mettre en forme aucun produit dans le panier et panier désactivé
    -   [x] signaler le panier avec un bouton lors du premier article
    -   [x] i18n pour le panier

-   US-04 Carrousel
    -   [x] retailler les photos automatiquement
    -   [x] splide-core.min.css
    -   [x] intégrer le slider dans la fiche
    -   [x] gestion aria et tabindex
    -   [x] utilisation de [Splide.js](https://splidejs.com/) pour les carrousels
-   US-06 Présentation des produits

    -   [x] Affiche les données des produits
    -   [x] Gère les styles
    -   [x] reprend le html et les styles

-   US-05 Migration des fiches

    -   [x] Générer des fiches .md à partir du JSON de la boutique
    -   [x] Adapter les titres des fiches
    -   [x] Adapter le .gitignore pour ne pas enregistrer tous les produits
    -   [x] Tester l'import
    -   [x] Documenter le script de migration

-   US-03 Fiche produit
    -   [x] Reprend une fiche produit
    -   [x] Affiche les données
    -   [x] Ajout une 404 et un favicon
    -   [x] Améliore l'accessibilité Aria
    -   [x] Gère l'i18n
    -   [x] Simplifie le CSS
-   US-02 Gestion de l'i18n

    -   [x] Organisation des fichiers
    -   [x] Menu de sélection de la langue
    -   [x] Pages traduites
    -   [x] Traduction de l'interface

-   US-01 Création de pages
    -   [x] Header
    -   [x] Footer
    -   [x] Déploiement sur GitHub Pages

### À venir

-   US-07 Gestion du panier
-   US-08 Paiements
-   US-09 Gestion des frais de transport
-   US-10 Gestion du responsive

## Outils utilisés

Pour garder les choses simples, nous utilisons peu d'outils.

-   [Eleventy](https://www.11ty.dev/), un [générateur de site statique](https://fr.wikipedia.org/wiki/G%C3%A9n%C3%A9rateur_de_site_statique).
-   [Splide.js](https://splidejs.com/), une bibliothèque légère pour créer des carrousels accessibles et élégants, utilisée pour la mise en œuvre des sliders de la boutique.

Le site fonctionne côté client, directement dans le navigateur, et peut être hébergé gratuitement sur des plateformes comme [GitLab](https://gitlab.com) ou [GitHub](https://github.com).

## Script de redimensionnement des images

Pour retailler et optimiser les images utilisées dans le carrousel, nous utilisons un script de redimensionnement :

```json
"resize": "node ./script/resize/resize.js"
```

Ce script permet de :

-   Redimensionner et optimiser les images placées dans le dossier `photos`.
-   Générer des versions optimisées pour les vignettes, les images du carrousel et les miniatures de celui-ci.
-   Il est exécuté automatiquement via GitHub Actions dès qu'un changement est détecté dans le dossier `/photos`.

## Installation

Ouvrez un terminal et assurez-vous que **Node.js** est installé :

```bash
$ mkdir boutique-11ty
$ cd boutique-11ty
$ git clone git@github.com:brutdethe/boutique-11ty.git .
$ npm install
$ npx @11ty/eleventy --serve
```

Le site devient accessible à l'adresse suivante : [http://localhost:8080/](http://localhost:8080/)

## Génération de Fichiers Markdown

Un [script](https://github.com/brutdethe/boutique-11ty/blob/main/script/import) est à disposition qui génère des fichiers Markdown pour chaque produit à partir d'un fichier JSON : [produits.json](https://github.com/brutdethe/boutique-11ty/blob/main/script/import/produit.json). Les fichiers générés sont organisés en deux répertoires : _/fr_ et _/en_.

Les noms de fichiers dans le répertoire _/en_ conservent les titres en français pour faciliter la gestion _i18n_ dans _11ty_.  
Les titres des fichiers sont normalisés pour éliminer les caractères spéciaux, les accents et les espaces, en remplaçant ces derniers par des tirets.

Pour générer les fichiers Markdown, exécutez le script suivant :

```bash
$ node generateMarkdown.js
```

## Contribuer

Si vous souhaitez contribuer, contactez-nous.

Merci à :

-   [newick](https://entre-quote.com) pour son aide sur l'intégeration.
-   [Antoine Vernois](https://blog.crafting-labs.fr/ensemble/) pour son "copilotage".

## Licence

Ce projet est sous licence [CC0 1.0 Universal](./LICENSE).
En bref : utilisez, modifiez, et distribuez sans restriction.

## Contact

[coucou@gongfucha.fr](mailto:coucou@gongfucha.fr)
