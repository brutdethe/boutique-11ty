import fs from 'fs'
import path from 'path'

// Fonction pour normaliser le texte
function normalizeString(str) {
    return str
        .toLowerCase() // Convertir en minuscules
        .normalize('NFD') // Décomposer les caractères accentués
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les marques de diacritiques
        .replace(/[€]/g, '') // Supprimer le symbole euro
        .replace(/[^\w\s-]/g, '') // Supprimer les caractères non alphanumériques sauf les tirets
        .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
        .replace(/--+/g, '-') // Remplacer plusieurs tirets consécutifs par un seul
        .replace(/^-+|-+$/g, '') // Supprimer les tirets en début et fin
        .trim() // Supprimer les espaces en début et fin
}

// Fonction pour transformer le pinyin
function transformPinyin(pinyin) {
    return pinyin
        .normalize('NFD') // Normalise les caractères accentués
        .replace(/[\u0300-\u036f]/g, '') // Supprime les marques de diacritiques
        .replace(/([A-Z])/g, '-$1') // Ajoute un tiret devant chaque majuscule
        .replace(/^-/, '') // Supprime un tiret au début s'il y en a un
        .toLowerCase() // Convertit tout en minuscules
        .replace(/\s+/g, '-') // Remplace les espaces par des tirets
        .replace(/[^\w\s-]/g, '') // Supprime les caractères non alphanumériques sauf les tirets
        .replace(/--+/g, '-') // Remplacer plusieurs tirets consécutifs par un seul
        .replace(/_-+/g, '_') // Remplace _- par _
        .replace(/^-+|-+$/g, '') // Supprime les tirets en début et fin
        .trim() // Supprime les espaces en début et fin
}

// Obtient le chemin du répertoire courant
const __filename = new URL('', import.meta.url).pathname // Chemin absolu du fichier
const __dirname = path.dirname(__filename) // Répertoire du fichier courant

const dataFilePath = path.join(__dirname, 'produits.json') // Chemin vers le fichier JSON
const outputFrDir = path.join(__dirname, 'output/fr')
const outputEnDir = path.join(__dirname, 'output/en')

fs.mkdirSync(outputFrDir, { recursive: true })
fs.mkdirSync(outputEnDir, { recursive: true })

// Lecture du fichier JSON
fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Erreur de lecture du fichier JSON:', err)
        return
    }

    const products = JSON.parse(data)

    products.forEach((product, index) => {
        // Vérification de la structure de l'objet produit
        if (!product.titre || !product.description || !product.catégorie) {
            console.error(
                `Produit à l'index ${index} est manquant des propriétés nécessaires:`,
                product
            )
            return // Ignorez ce produit
        }

        const {
            id,
            titre,
            catégorie,
            description,
            prix,
            quantité_produite,
            poids,
            capacité,
            dimension,
            photos
        } = product

        let frFileName
        let enFileName

        // Gestion des titres chinois
        if (/[^\x00-\x7F]/.test(titre.fr)) {
            // Si le titre contient des caractères chinois
            frFileName = path.join(
                outputFrDir,
                `${id}_${transformPinyin(titre.fr)}.md`
            )
            enFileName = path.join(
                outputEnDir,
                `${id}_${transformPinyin(titre.fr)}.md`
            ) // Utiliser le titre français
        } else {
            // Normalisation pour les titres français normaux
            const titleSlug = normalizeString(titre.fr)
            frFileName = path.join(outputFrDir, `${id}_${titleSlug}.md`)

            // Utiliser le titre français pour le fichier anglais
            enFileName = path.join(outputEnDir, `${id}_${titleSlug}.md`)
        }

        // Contenu en français
        const frOptions = []
        if (dimension) frOptions.push(`    dimension: ${dimension}`)
        if (capacité) frOptions.push(`    capacité: ${capacité}`)
        if (poids) frOptions.push(`    poids: ${Math.round(poids * 1000)} g`)
        if (quantité_produite)
            frOptions.push(
                `    stock: il reste ${quantité_produite} article${
                    quantité_produite > 1 ? 's' : ''
                }`
            )

        // Générer la section photos
        const frPhotos = photos.map((photo) => `    - ${photo}`).join('\n')

        const frContent = `---
layout: product.njk
titre: ${titre.fr}
catégorie: ${catégorie}
description: >
    ${description.fr}
photos:
${frPhotos}
price: ${prix.toFixed(2)} €
options:
${frOptions.join('\n')}
---
`

        // Contenu en anglais
        const enOptions = []
        if (dimension) enOptions.push(`    dimension: ${dimension}`)
        if (capacité) enOptions.push(`    capacity: ${capacité}`)
        if (poids) enOptions.push(`    weight: ${Math.round(poids * 1000)} g`)
        if (quantité_produite)
            enOptions.push(
                `    stock: ${quantité_produite} item${
                    quantité_produite > 1 ? 's' : ''
                } left`
            )

        // Générer la section photos en anglais
        const enPhotos = photos.map((photo) => `    - ${photo}`).join('\n')

        const enContent = `---
layout: product.njk
titre: ${titre.en}
category: ${catégorie}
description: >
    ${description.en}
photos:
${enPhotos}
price: ${prix.toFixed(2)} €
options:
${enOptions.join('\n')}
---
`

        // Écriture des fichiers Markdown
        fs.writeFileSync(frFileName, frContent.trim(), 'utf8')
        fs.writeFileSync(enFileName, enContent.trim(), 'utf8')
    })

    console.log('Fichiers Markdown créés avec succès.')
})
