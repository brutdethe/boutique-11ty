# Boutique-11ty

Une petite boutique en ligne construite avec [11ty](https://www.11ty.dev/).

## Objectif

Créer une boutique simple et minimaliste pour vendre des objets ou des prestations sans complexité.

## Les fonctionnalités

### Terminées

- US-01 Création de pages
  - [x] Header
  - [x] Footer
  - [x] Déploiement sur GitHub Pages

- US-02 Gestion de l'i18n
  - [x] Organisation des fichiers
  - [x] Menu de sélection de la langue
  - [x] Pages traduites
  - [x] Traduction de l'interface

### À venir

- US-03 Fiche produit
- US-04 Présentation des produits
- US-05 Gestion du panier
- US-06 Paiement
- US-07 Gestion des frais de transport

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

## Contribuer

Si vous souhaitez contribuer, contactez-nous, nous serons ravis d'examiner vos suggestions. Consultez aussi [CONTRIBUTING.md](./CONTRIBUTING.md) pour plus de détails.

## Licence

Ce projet est sous licence [CC0 1.0 Universal](./LICENSE). Utilisez, modifiez, et distribuez sans restriction.

## Contact

[coucou@gongfucha.fr](mailto:coucou@gongfucha.fr)
