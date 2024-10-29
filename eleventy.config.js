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
}

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("bundle.css")
  
  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: "fr",
  })

  eleventyConfig.addFilter("customLocaleUrl", function(path, lang) {
    if (lang === 'fr') {
      return path.replace(/^\/(fr|en)/, "")
    }
    return `${path}${lang}`
  })
}

