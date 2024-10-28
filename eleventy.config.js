export const config = {
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  dataTemplateEngine: "njk",
  templateFormats: ["njk", "md", "html"],
}

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("bundle.css")
}

