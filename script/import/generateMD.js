import fs from 'fs'
import path from 'path'

// Fonction pour normaliser le texte
function normalizeString(str) {
    return str
        .toLowerCase() // Convertir en minuscules
        .normalize('NFD') // Décomposer les caractères accentués
        .replace(/[̀-ͯ]/g, '') // Supprimer les marques de diacritiques
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
        .normalize('NFD') // Normaliser les caractères accentués
        .replace(/[̀-ͯ]/g, '') // Supprimer les marques de diacritiques
        .replace(/([A-Z])/g, '-$1') // Ajouter un tiret devant chaque majuscule
        .replace(/^-/, '') // Supprimer un tiret au début s'il y en a un
        .toLowerCase() // Convertir tout en minuscules
        .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
        .replace(/[^\w\s-]/g, '') // Supprimer les caractères non alphanumériques sauf les tirets
        .replace(/--+/g, '-') // Remplacer plusieurs tirets consécutifs par un seul
        .replace(/_-+/g, '_') // Remplacer _- par _
        .replace(/^-+|-+$/g, '') // Supprimer les tirets en début et fin
        .trim() // Supprimer les espaces en début et fin
}

// Obtient le chemin du répertoire courant
const __filename = new URL('', import.meta.url).pathname
const __dirname = path.dirname(__filename)

const dataFilePath = path.join(__dirname, 'produits.json')
const outputFrDir = path.join(__dirname, 'output/fr')
const outputEnDir = path.join(__dirname, 'output/en')

fs.mkdirSync(outputFrDir, { recursive: true })
fs.mkdirSync(outputEnDir, { recursive: true })

// Lecture du fichier JSON et traitement des produits
fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Erreur de lecture du fichier JSON:', err)
        return
    }

    const products = JSON.parse(data)

    products.forEach((product, index) => {
        if (!product.titre || !product.description || !product.tags) {
            console.error(
                `Produit à l'index ${index} est manquant des propriétés nécessaires:`,
                product
            )
            return
        }

        const {
            id,
            titre,
            tags,
            description,
            prix,
            poids,
            quantité_produite,
            photos,
            producteur,
            ...rest
        } = product
        delete rest.modification
        delete rest.création

        const titleSlugFr = /[^\x00-\x7F]/.test(titre.fr)
            ? transformPinyin(titre.fr)
            : normalizeString(titre.fr)
        const frFileName = path.join(outputFrDir, `${id}_${titleSlugFr}.md`)
        const enFileName = path.join(outputEnDir, `${id}_${titleSlugFr}.md`)

        const frOptions = getOptions(rest, producteur?.fr, false)
        const enOptions = getOptions(rest, producteur?.en, true)

        let frContent = createMarkdownContent(
            'product_card.njk',
            id,
            titre.fr,
            tags,
            description.fr,
            photos,
            prix,
            quantité_produite,
            poids,
            frOptions,
            false
        )

        let enContent = createMarkdownContent(
            'product_card.njk',
            id,
            titre.en,
            tags,
            description.en,
            photos,
            prix,
            quantité_produite,
            poids,
            enOptions,
            true
        )

        // Suppression des lignes vides superflues avant d'écrire les fichiers
        frContent = frContent.replace(/\n{2,}(?=---)/g, '\n---')
        enContent = enContent.replace(/\n{2,}(?=---)/g, '\n---')

        fs.writeFileSync(frFileName, frContent.trim(), 'utf8')
        fs.writeFileSync(enFileName, enContent.trim(), 'utf8')
    })

    console.log('Fichiers Markdown créés avec succès.')
})

// Fonction pour obtenir les options traduites
function getOptions(rest, producteur, isEnglish) {
    const options = []
    for (const [key, value] of Object.entries(rest)) {
        if (key !== 'photos' && value) {
            const translatedKey = isEnglish ? translateKey(key) : key
            options.push(`  ${translatedKey}: ${value}`)
        }
    }
    if (producteur)
        options.push(
            `  ${isEnglish ? 'producer' : 'producteur'}: ${producteur}`
        )
    return options
}

// Fonction pour traduire les clés
function translateKey(key) {
    return key
        .replace('récolte', 'harvest')
        .replace('producteur', 'producer')
        .replace('village', 'village')
        .replace('province', 'province')
        .replace('capacité', 'capacity')
}

// Fonction pour créer le contenu du fichier Markdown
function createMarkdownContent(
    layout,
    id,
    title,
    tags,
    description,
    photos,
    prix,
    quantité_produite,
    poids,
    options,
    isEnglish
) {
    const stock = quantité_produite
        ? `stock: ${quantité_produite}`
        : ''
    const weight = poids ? `weight: ${Math.round(poids * 1000)}` : ''
    const photosContent =
        photos?.map((photo) => `  - ${photo}`).join('\n') || ''

    return `---
layout: _layouts/${layout}
id: ${id}
name: ${title}
tags: ["${isEnglish ? 'product' : 'produit'}", "${tags}"]
description: >
  ${description}
photos:
${photosContent}
price: ${prix.toFixed(2)}
${stock ? stock : ''}
${weight ? weight : ''}
${
    options.length > 0
        ? `options:
${options.join('\n')}`
        : ''
}
eleventyComputed:
  title: "{{ tags }} - {{ name }}"
---`
}
