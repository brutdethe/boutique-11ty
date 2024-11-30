import { EleventyI18nPlugin } from '@11ty/eleventy'
import yaml from 'js-yaml'

export const config = {
    dir: {
        input: 'src',
        output: 'dist'
    },

    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', 'html'],
    pathPrefix: '/',
    langs: { default: 'fr', others: ['en'] }
}

export default function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy('src/_assets')
    eleventyConfig.addPassthroughCopy('bundle.css')

    eleventyConfig.addPlugin(EleventyI18nPlugin, {
        defaultLanguage: 'fr',
        errorMode: 'never'
    })
    
    eleventyConfig.addDataExtension('yaml, yml', (contents) =>
        yaml.load(contents)
    )
    
    eleventyConfig.addFilter("excerptFromDescription", function(description) {
        if (!description) return ""
        const separator = "<!--more-->"
        const parts = description.split(separator)
        return parts[0]
    })


    eleventyConfig.addFilter('customLocaleUrl', function (path, lang) {
        if (lang === config.langs.default) {
            return path.replace(/^\/(fr|en)/, '')
        }

        for (let otherLang of config.langs.others) {
            const langPattern = new RegExp(`^/${otherLang}`)

            if (langPattern.test(path)) {
                return path
            }
        }

        return `/${lang}${path}`
    })

    eleventyConfig.addFilter("sortCountries", (countries, lang) => {
        return countries.sort((a, b) => {
          return a[lang].localeCompare(b[lang])
        })
    })

    eleventyConfig.addFilter("with", function (str, vars) {
        return str.replace(/{{\s*([\w]+)\s*}}/g, function (match, p1) {
          return vars[p1] || match
        })
    })

    eleventyConfig.addCollection('allTags', function (collectionApi) {
        const tagSet = new Set()

        collectionApi.getAll().forEach((item) => {
            if ('tags' in item.data) {
                let tags = item.data.tags

                if (typeof tags === 'string') {
                    tags = [tags]
                }

                tags.forEach((tag) => tagSet.add(tag))
            }
        })

        return [...tagSet]
    })
}
