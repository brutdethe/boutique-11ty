[![Netlify Status](https://api.netlify.com/api/v1/badges/0edcc928-d8f8-4f22-82a5-14cdd541fb8a/deploy-status)](https://app.netlify.com/sites/boutique-gongfucha/deploys)

# Boutique-11ty

Une petite boutique en ligne construite avec [11ty](https://www.11ty.dev/).

## Objectif

Créer une boutique simple et minimaliste pour vendre des objets ou des prestations sans complexité.

## Les fonctionnalités

### Terminées

- US-15 optimisation
  - [x] pétouille responsive et bug panier
  - [x] ajoute un sitemap et un robots.txt

- US-12 responsive
  - [x] passe l'interface en responsive 
  - [x] passe la liste des produits en responsive
  - [x] passe la fiche produit en responsive
  - [x] place les css en bundle
  - [x] passe le panier en responsive

- US-14 gérer les stocks manuellement
  - [x] affiche le stock sur le produit
  - [x] gère la quantité par rapport au stock

- US-08 Paiement
  - [x] installation sur netlify
  - [x] création des pages de succès et d'abandon
  - [x] gère les désactivation du panier
  - [x] création d'un fichier avec tous les pays
  - [x] création du ticket : total - s/total - transport
  - [x] passe les informations du panier à stripe 

- US-09 Gestion des frais de transport
  - [x] mise en place de la grille tarifaire
  - [x] affichage de la liste des pays
  - [x] calcul d'un produit par poids
  - [x] calcul d'un produit par type de colis
  - [x] calcul d'un produit par points d'encombrement
  - [x] gestion des "sans envoi"
  - [x] intégration css pour la mise en forme du ticket
  - [x] documentation

- US-07 Gestion du panier
  - [x] ajouter un produit
  - [x] gère les badges du panier
  - [x] récupérer les données sur la page panier
  - [x] changer la quantité et supprimer
  - [x] mettre en page
  - [x] gérer les boutons "déjà ajouté"
  - [x] mettre en forme aucun produit dans le panier et panier désactivé
  - [x] signaler le panier avec un bouton lors du premier article
  - [x] i18n pour le panier

- US-04 Carrousel
  - [x] retailler les photos automatiquement
  - [x] splide-core.min.css
  - [x] intégrer le slider dans la fiche
  - [x] gestion aria et tabindex
  - [x] utilisation de [Splide.js](https://splidejs.com/) pour les carrousels

- US-06 Présentation des produits
  - [x] Affiche les données des produits
  - [x] Gère les styles
  - [x] reprend le html et les styles

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

-- Version 1.0 - production

- US-10 passer en plugin
- US-11 currencies
- US-13 page accueil
- US-16 gère le stock avec stripe

## Outils utilisés

Pour garder les choses simples, nous essayons d'utiliser très peu d'outils.

- [Eleventy](https://www.11ty.dev/), un [générateur de site statique](https://fr.wikipedia.org/wiki/G%C3%A9n%C3%A9rateur_de_site_statique).
- [Splide.js](https://splidejs.com/), une bibliothèque légère pour créer des carrousels accessibles et élégants, utilisée pour la mise en œuvre des sliders de la boutique.
- [sharp](https://sharp.pixelplumbing.com/), une librairie légère pour retailler les images.

Jusqu'au panier (inclus), le site est statique et fonctionne côté client, directement dans le navigateur, et peut être hébergé gratuitement sur des plateformes comme [GitLab](https://gitlab.com) ou [GitHub](https://github.com) par exemple.

Reste quand même un pépin, pour les paiements en ligne. Une fois que la personne valide son panier en passant au paiement, nous avons choisi de passer par [stripe](stripe). Cette opération de paiement est sensible, une personne bizarrement intentionnée pourrait, par exemple, adapter les tarifs de ses achats. Nous avons donc un tout petit peu d'actions qui ne se font pas que dans le navigateur de la personne qui va commander. Nous utilisons donc un autre service dans sa version gratuite : [netlify](https://www.netlify.com).

### Installer le site sur netlify

Pour déployer le site *gitHub* sur *netlify*, connectez le dépôt via *import an existing project*. Ajouter la variable d'environnement STRIPE_SECRET_KEY dans *Site Settings > Environment variables*. Lancez le déploiement, et *netlify* s'occupera de cloner le dépôt, installer les dépendances et construire le projet. Une fois terminé, testez le site sur l'URL attribuée par *netlify*.

En local, ajouter un fichier *.env* avec :

```bash
STRIPE_SECRET_KEY = sk_test_***
```

La clé privée *stripe* (*STRIPE_SECRET_KEY*) est une donnée sensible qui ne doit jamais être exposée publiquement. Elle est stockée dans un fichier *.env*, qui est ignoré dans le *.gitignore*.

## Script de redimensionnement des images

Pour retailler et optimiser les images utilisées dans le carrousel, nous utilisons un script de redimensionnement :

```json
"resize": "node ./script/resize/resize.js"
```

Ce script permet de :

- Redimensionner et optimiser les images placées dans le dossier `photos`.
- Générer des versions optimisées pour les vignettes, les images du carrousel et les miniatures de celui-ci.
- Il est exécuté automatiquement via GitHub Actions dès qu'un changement est détecté dans le dossier `/photos`.

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

### Pour tester avec le paiement

#### Avec stripe

Pour tester *stripe* activer le mode test, puis récupérer la *clé secrète* de test (*sk_test_...*) et la configurer comme variable d’environnement sous le nom STRIPE_SECRET_KEY. Tester les paiements en utilisant les cartes de test : *4242 4242 4242 4242* pour un paiement réussi, ou d’autres pour simuler des erreurs. Puis vérifier les transactions dans le tableau de bord *stripe*.

#### Puis netlify

Dans un environnement simulant *netlify*, Installer :

```bash
$ npm install -g netlify-cli
$ netlify login
$ netlify dev
```

Ça démarre un serveur local qui applique les redirections, variables d'environnement (ex. *STRIPE_SECRET_KEY*), et permet de tester les *fonctions serverless* comme en production.

## Génération de Fichiers Markdown

Un [script](https://github.com/brutdethe/boutique-11ty/blob/main/script/import) est à disposition qui génère des fichiers Markdown pour chaque produit à partir d'un fichier JSON : [produits.json](https://github.com/brutdethe/boutique-11ty/blob/main/script/import/produit.json). Les fichiers générés sont organisés en deux répertoires : _/fr_ et _/en_.

Les noms de fichiers dans le répertoire _/en_ conservent les titres en français pour faciliter la gestion _i18n_ dans _11ty_.  
Les titres des fichiers sont normalisés pour éliminer les caractères spéciaux, les accents et les espaces, en remplaçant ces derniers par des tirets.

Pour générer les fichiers Markdown, exécutez le script suivant :

```bash
$ node generateMarkdown.js
```

## Gestion des Frais de Transport

### Fonctionnement

Le système de frais de transport est basé sur un fichier YAML : [`/src/_data/shipping_rate.yaml`](./src/_data/shipping_rate.yaml), qui contient une grille tarifaire organisée par zones géographiques, ainsi que les caractéristiques des types de colis disponibles.

### Les pays

Le menu des pays est généré à partir d'un fichier yaml : [`/src/_data/shipping_countries.yaml`](./src/_data/shipping_countries.yaml). 

Pour chaque pays, il y a la traduction, la zone pour le tarif postal applicable et l'abréviation ISO qui est passé à *stripe* et qui bloque *stripe checkout* sur le pays choisi dans le panier.

```yaml
- fr: Taïwan
  en: Taiwan
  zone: ZoneC
  iso: TW
```

### Grille Tarifaire

La grille tarifaire définit les frais de transport en fonction du poids total des colis et de la destination. Les zones géographiques sont :

- **France** : Inclut `France métropolitaine`, `Andorra`, `Monaco`.
- **Outre-mer** : `France Outre-mer`.
- **Zone A** : Union Européenne et Suisse.
- **Zone B** : Europe de l'Est, Norvège, Maghreb.
- **Zone C** : Reste du monde.

Chaque zone contient une liste de seuils de poids et les tarifs associés. Par exemple :

```yaml
France:
  tarifs:
    - poids_max: 250
      tarif: 5.25
    - poids_max: 500
      tarif: 7.35
    - poids_max: 1000
      tarif: 9.40
```

### Types de Colis

Les types de colis disponibles sont définis comme suit :

```yaml
types_colis:
  colis_base:
    poids_emballage: 260
    capacite_points: 10
  tube:
    poids_emballage: 120
    capacite_points: 5
  sans_envoi: null
```
- **colis_base** : Colis standard, avec un poids d'emballage de 260 g et une capacité maximale de 10 points d'encombrement.
- **tube** : Emballage léger (120 g), avec une capacité maximale de 5 points d'encombrement.
- **sans_envoi** : Articles dématérialisés, sans poids ni frais d'expédition.

### Calcul des Frais

1. **Regroupement des Articles par Type de Colis** :
   Les articles du panier sont regroupés selon leur type de colis (`colis_base`, `tube`, etc.).

2. **Détermination du Nombre de Colis** :
   Pour chaque type de colis, les points d'encombrement des articles sont additionnés. Si les points dépassent la capacité du colis, plusieurs colis sont nécessaires :
   \[
   \text{Nombre de colis} = \lceil \frac{\text{points totaux}}{\text{capacité}} \rceil
   \]

3. **Poids Total Par Colis** :
   Le poids total est calculé en additionnant le poids des articles et le poids des emballages requis.

4. **Frais Par Colis** :
   Le poids total est comparé à la grille tarifaire de la zone géographique sélectionnée. Le tarif correspondant est appliqué.

5. **Frais Totaux** :
   Les frais de tous les colis sont additionnés pour obtenir un montant total.

### Exemple de Calcul

#### Panier
- **Produit 1** :
  - Poids : 250 g.
  - Points : 11.
  - Type : `colis_base`.
- **Produit 2** :
  - Poids : 100 g.
  - Points : 2.
  - Type : `tube`.

#### Destination
- **France**.

#### Calcul
1. **Produit 1** :
   - 2 colis nécessaires (11 points > 10).
   - Poids total : \( 250 + (260 \times 2) = 770 \, \text{g} \).
   - Tarif : \( 9.40 \, \text{€} \).

2. **Produit 2** :
   - 1 colis nécessaire (2 points ≤ 5).
   - Poids total : \( 100 + 120 = 220 \, \text{g} \).
   - Tarif : \( 5.25 \, \text{€} \).

3. **Total Frais** :
   - \( 9.40 + 5.25 = 14.65 \, \text{€} \).


## Contribuer

Si vous souhaitez contribuer, contactez : [coucou@gongfucha.fr](mailto:&#99;&#111;&#117;&#99;&#111;&#117;&#64;&#103;&#111;&#110;&#103;&#102;&#117;&#99;&#104;&#97;&#46;&#102;&#114;)

## Crédit

Merci à :
- [newick](https://entre-quote.com) pour son aide sur l'intégeration
- [Antoine Vernois](https://blog.crafting-labs.fr/ensemble/) pour son "copilotage"

## Licence

Ce projet est sous licence [CC0 1.0 Universal](./LICENSE).
En bref : utilisez, modifiez, et distribuez sans restriction.

## Contact

Stéphane Langlois  
[coucou@gongfucha.fr](mailto:&#99;&#111;&#117;&#99;&#111;&#117;&#64;&#103;&#111;&#110;&#103;&#102;&#117;&#99;&#104;&#97;&#46;&#102;&#114;)
