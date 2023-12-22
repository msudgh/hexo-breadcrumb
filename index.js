"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const config = hexo.config;
const breadcrumbConfig = hexo.config.breadcrumb;
/**
 * Registers the breadcrumb data for the given page or post.
 *
 * @param {LayoutData} data
 * @return {LayoutData | void}
 */
const register = (data) => {
  if (data.layout !== "post" && data.layout !== "page") {
    return data;
  }
  data.breadcrumb = setupBreadcrumb(data);
  return data;
};
exports.register = register;
/**
 * Sets up the breadcrumb data for the given page or post.
 * @param {LayoutData} data - The page or post data.
 * @returns {string} - HTML content.
 */
const setupBreadcrumb = (data) => {
  if (!breadcrumbConfig) {
    throw new Error("breadcrumb is not defined");
  }
  if (!breadcrumbConfig.homepage) {
    throw new Error("breadcrumb.homepage is not defined");
  }
  if (!breadcrumbConfig.templates) {
    throw new Error("breadcrumb.templates is not defined");
  }
  const { layout } = data;
  const { homepage } = breadcrumbConfig;
  const homeLink = {
    title: homepage.title || config.title,
    url: config.url,
  };
  const categoryLinks = data.categories.data.map((category) => ({
    title: category.name,
    url: category.permalink,
  }));
  const titleLink = {
    title: data.title || data.slug,
    url: data.permalink,
  };
  const unorderedLinks = {
    home: homeLink,
    category: categoryLinks,
    title: titleLink,
  };
  const links = getOrderedLinksByTemplates(layout, unorderedLinks);
  return toHTML(links);
};
/**
 * Gets the ordered links based on the templates.
 * @param {string} layout - The layout to match against in the templates array.
 * @param {LinksByToken} links - The object containing links indexed by token.
 * @throws {Error} - If the layout is not defined in the templates array.
 * @returns {Array<Link>} - The ordered array of links based on the detected layout.
 */
const getOrderedLinksByTemplates = (layout, links) => {
  const { templates } = breadcrumbConfig;
  const detectedLayout = templates.find((item) => item.layout === layout);
  if (!detectedLayout) {
    throw new Error(
      `Layout "${layout}" is not defined in breadcrumb.templates`,
    );
  }
  return detectedLayout.tokens.map((token) => links[token]).flat();
};
/**
 * Converts the links to HTML markup.
 * @param {Array<Link>} links - The array of link objects.
 * @returns {string} - The HTML markup for the links.
 */
const toHTML = (links) => {
  const linksHTML = links
    .map(
      (link) => `<li><a href="${link.url}"><span>${link.title}</span></a></li>`,
    )
    .join("");
  return `<ul id="hexo-breadcrumb">${linksHTML}</ul>`;
};
/*
 * Register before_post_render filter
 * Ref: https://hexo.io/api/filter#before-post-render
 */
hexo.extend.filter.register("before_post_render", exports.register);
