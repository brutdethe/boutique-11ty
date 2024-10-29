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
    errorMode: "strict",
  })

  eleventyConfig.addFilter("removeLocalePrefix", function(filePathStem) {
    return filePathStem.replace(/^\/(fr|en|es)/, "");
  })
}

