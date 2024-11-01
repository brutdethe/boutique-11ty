# Boutique-11ty

Une petite boutique en ligne construite avec [11ty](https://www.11ty.dev/).

## Objectif

Créer une boutique simple et minimaliste pour vendre des objets ou des prestations sans complexité.

## Les fonctionnalités

### Terminées

- US-05 Migration des fiches
  - [x] Générer des fiches .md à partir du JSON de la boutique
  - [x] Adapter les titres des fiches
  - [x] Adapter le .gitignore pour ne pas enregistrer tous les produits
  - [x] Tester l'import
  - [x] Documenter le script de migration

- US-03 Fiche produit
  - [x] Reprend une fiche produit
  - [x] Affiche les données
  - [x] Ajout une 404 et un favicon
  - [x] Améliore l'accessibilité Aria
  - [x] Gère l'i18n
  - [x] Simplifie le CSS
  
- US-02 Gestion de l'i18n
  - [x] Organisation des fichiers
  - [x] Menu de sélection de la langue
  - [x] Pages traduites
  - [x] Traduction de l'interface

- US-01 Création de pages
  - [x] Header
  - [x] Footer
  - [x] Déploiement sur GitHub Pages

### À venir

- US-04 Carrousel
- US-06 Présentation des produits
- US-07 Gestion du panier
- US-08 Paiements
- US-09 Gestion des frais de transport

## Outils utilisés

Pour garder les choses simples, nous utilisons le minimum d'outils nécessaire.

- [Eleventy](https://www.11ty.dev/), un [générateur de site statique](https://fr.wikipedia.org/wiki/G%C3%A9n%C3%A9rateur_de_site_statique).

Le site fonctionne côté client, directement dans le navigateur, et peut être hébergé gratuitement sur des plateformes comme [GitLab](https://gitlab.com) ou [GitHub](https://github.com).

## Installation

Ouvrez un terminal et assurez-vous que **Node.js** est installé :

```bash
$ mkdir boutique-11ty
$ cd boutique-11ty
$ git clone git@github.com:brutdethe/boutique-11ty.git .
$ npm install @11ty/eleventy
$ npx @11ty/eleventy --serve
```

Le site sera accessible à l'adresse suivante : [http://localhost:8080/](http://localhost:8080/)

## Génération de Fichiers Markdown

Un [script](https://github.com/brutdethe/boutique-11ty/blob/main/script/import) est à disposition qui génère des fichiers Markdown pour chaque produit à partir d'un fichier JSON : [produits.json](https://github.com/brutdethe/boutique-11ty/blob/main/script/import/produit.json). Les fichiers générés sont organisés en deux répertoires : _/fr_ et _/en_.

Les noms de fichiers dans le répertoire _/en_ conservent les titres en français pour faciliter la gestion _i18n_ dans _11ty_.  
Les titres des fichiers sont normalisés pour éliminer les caractères spéciaux, les accents et les espaces, en remplaçant ces derniers par des tirets.

Pour générer les fichiers Markdown, exécutez le script suivant :

```bash
$ node generateMarkdown.js
```

## Contribuer

Si vous souhaitez contribuer, contactez-nous, nous serons ravis d'examiner vos suggestions. Consultez aussi [CONTRIBUTING.md](./CONTRIBUTING.md) pour plus de détails.

## Licence

Ce projet est sous licence [CC0 1.0 Universal](./LICENSE). Utilisez, modifiez, et distribuez sans restriction.

## Contact

[coucou@gongfucha.fr](mailto:coucou@gongfucha.fr)
