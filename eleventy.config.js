export const config = {
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  dataTemplateEngine: "njk",
  templateFormats: ["njk", "md", "html"],
  pathPrefix: "/boutique-11ty/",
}

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("bundle.css")
}

