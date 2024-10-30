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
}

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/_assets");
  eleventyConfig.addPassthroughCopy("bundle.css")
  
  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: "fr",
  })
}