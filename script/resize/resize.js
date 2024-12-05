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
}

const resizeTo = {
    thumbs: { width: 446, height: 297 },
}

async function initDirectories(path) {
    await fs.mkdir(path, { recursive: true })
}

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

try {
    await fs.access(paths.productsDir)
} catch {
    throw new Error(`Non-existent ${paths.productsDir}`)
}

await initDirectories(paths.thumbsDir)

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
            allPhotos.push(data.photos[0])
        }
    })
)

;(async () => {
    const promises = allPhotos.flatMap(async (thumb) => {
        const thumbSource = path.join(paths.photosDir, thumb)

        try {
            await fs.access(thumbSource)
        } catch {
            console.error('Source file not found:', thumbSource)
            return
        }

        return await convertAndSave({
            source: thumbSource,
            target: path.join(paths.thumbsDir, thumb),
            dimensions: resizeTo.thumbs
        })
    })

    await Promise.all(promises)
})()
