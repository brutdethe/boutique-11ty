import { EleventyI18nPlugin } from "@11ty/eleventy"

export const config = {
  dir: {
  	input: 'src',
  	output: 'dist',
	},

  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  dataTemplateEngine: "njk",
  templateFormats: ["njk", "md", "html"],
  pathPrefix: "/boutique-11ty/",
  langs: { default: 'fr', others: ['en']},
}

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/_assets");
  eleventyConfig.addPassthroughCopy("bundle.css")
  
  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: "fr",
  })

  eleventyConfig.addFilter("customLocaleUrl", function(path, lang) {
   
    if (lang === config.langs.default) {
      return path.replace(/^\/(fr|en)/, "")
    }
  
    for (let otherLang of config.langs.others) {
      const langPattern = new RegExp(`^/${otherLang}`)
  
      if (langPattern.test(path)) {
        return path
      }
    }
  
    return `/${lang}${path}`
  })
}