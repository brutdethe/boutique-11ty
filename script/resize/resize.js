import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const paths = {
    productsDir: path.resolve(__dirname, '../../src/products'),
    photosDir: path.resolve(__dirname, '../../photos'),
    thumbsDir: path.resolve(__dirname, '../../src/_assets/thumbs'),
    carouselsImagesDir: path.resolve(
        __dirname,
        '../../src/_assets/carousels_images'
    ),
    carouselsThumbsDir: path.resolve(
        __dirname,
        '../../src/_assets/carousels_thumbs'
    )
}

const resizeTo = {
    thumbs: { width: 446, height: 297 },
    carouselsThumbs: { width: 100, height: 60 },
    carouselsImages: { width: 926, height: 612 }
}

// Vérifie et initialise les répertoires de sortie
async function initDirectories(paths) {
    await Promise.all(
        Object.values(paths).map((dirPath) =>
            fs.mkdir(dirPath, { recursive: true })
        )
    )
}

// Fonction générique pour convertir une image selon les dimensions spécifiées et l'optimiser
async function convertAndSave({ source, target, dimensions }) {
    try {
        console.log(`Processing ${source} to ${target}`)
        await sharp(source)
            .resize(dimensions.width, dimensions.height)
            .jpeg({ quality: 80, mozjpeg: true }) // Optimisation pour JPEG
            .toFile(target)
        console.log('File successfully created:', target)
    } catch (error) {
        console.error(
            `Error during conversion: ${error.message} - File: ${source}`
        )
    }
}

// Vérifie que le dossier des produits existe
try {
    await fs.access(paths.productsDir)
} catch {
    throw new Error(`Non-existent ${paths.productsDir}`)
}

// Initialise les répertoires de sortie
await initDirectories([
    paths.thumbsDir,
    paths.carouselsImagesDir,
    paths.carouselsThumbsDir
])

// Lit toutes les fiches produits du répertoire source
const productFiles = (await fs.readdir(paths.productsDir)).filter(
    (file) => path.extname(file).toLowerCase() === '.md'
)

// Récupère les images listées dans le frontmatter des fiches produits
let allPhotos = []
await Promise.all(
    productFiles.map(async (file) => {
        const filePath = path.join(paths.productsDir, file)
        const fileContent = await fs.readFile(filePath, 'utf8')
        const { data } = matter(fileContent)
        if (
            data.photos &&
            Array.isArray(data.photos) &&
            data.photos.length > 0
        ) {
            // Prend la première photo pour les thumbs, et toutes les photos pour les carousels
            allPhotos.push({
                thumb: data.photos[0],
                carousels: data.photos
            })
        }
    })
)

// Parcourt chaque produit et crée les différentes tailles requises
;(async () => {
    const promises = allPhotos.flatMap(async ({ thumb, carousels }) => {
        const thumbSource = path.join(paths.photosDir, thumb)

        try {
            await fs.access(thumbSource)
        } catch {
            console.error('Source file not found:', thumbSource)
            return
        }

        // Crée la vignette pour la première image
        await convertAndSave({
            source: thumbSource,
            target: path.join(paths.thumbsDir, thumb),
            dimensions: resizeTo.thumbs
        })

        // Crée les versions pour le carrousel pour toutes les images
        return Promise.all(
            carousels.map(async (photo) => {
                const source = path.join(paths.photosDir, photo)

                try {
                    await fs.access(source)
                } catch {
                    console.error('Source file not found:', source)
                    return
                }

                return Promise.all([
                    convertAndSave({
                        source,
                        target: path.join(paths.carouselsImagesDir, photo),
                        dimensions: resizeTo.carouselsImages
                    }),
                    convertAndSave({
                        source,
                        target: path.join(paths.carouselsThumbsDir, photo),
                        dimensions: resizeTo.carouselsThumbs
                    })
                ])
            })
        )
    })

    await Promise.all(promises)
})()
