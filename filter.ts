import type { Locals } from "hexo";
import type { Breadcrumb, Link, LinksByToken, Formats } from "./global";

const config = hexo.config;
const breadcrumb = hexo.config.breadcrumb;

export const register = (data: Locals.Page | Locals.Post) => {
  if (data.layout !== "post" && data.layout !== "page") {
    return data;
  }

  data.breadcrumb = setupBreadcrumb(data);
};

/**
 * Sets up the breadcrumb data for the given page or post.
 * @param {Locals.Page | Locals.Post} data - The page or post data.
 * @returns {string} - HTML content.
 */
function setupBreadcrumb(data: Locals.Page | Locals.Post): string {
  if (!breadcrumb) {
    throw new Error("breadcrumb is not defined");
  }

  if (!breadcrumb.homepage) {
    throw new Error("breadcrumb.homepage is not defined");
  }

  if (!breadcrumb.formats) {
    throw new Error("breadcrumb.formats is not defined");
  }

  const { layout } = data;
  const { homepage, formats } = breadcrumb as Breadcrumb;

  const homeLink: Link = {
    title: homepage.title || config.title,
    url: config.url,
  };

  const categoryLinks: Link[] = (data.categories.data as Locals.Category[]).map(
    (category): Link => ({
      title: category.name,
      url: category.permalink,
    })
  );

  const titleLink: Link = {
    title: data.title || data.slug,
    url: data.permalink,
  };

  const unorderedLinks: LinksByToken = {
    home: homeLink,
    category: categoryLinks,
    title: titleLink,
  };

  const links = getOrderedLinksByFormats(layout, formats, unorderedLinks);

  return toHTML(links);
}

/**
 * Gets the ordered links based on the formats.
 * @param {string} layout - The layout to match against in the formats array.
 * @param {Formats} formats - The array of formats containing layout and tokens.
 * @param {LinksByToken} links - The object containing links indexed by token.
 * @throws {Error} - If the layout is not defined in the formats array.
 * @returns {Array<Link>} - The ordered array of links based on the detected layout.
 */
function getOrderedLinksByFormats(layout: string, formats: Formats, links: LinksByToken): Link[] {
  const detectedLayout = formats.find((item) => item.layout === layout);

  if (!detectedLayout) {
    throw new Error(`Layout "${layout}" is not defined in breadcrumb.formats`);
  }

  return detectedLayout.tokens.map((token) => links[token]).flat();
}

/**
 * Converts the links to HTML markup.
 * @param {Array<Link>} links - The array of link objects.
 * @returns {string} - The HTML markup for the links.
 */
function toHTML(links: Link[]): string {
  const linksHTML = links
    .map((link) => `<li><a href="${link.url}"><span>${link.title}</span></a></li>`)
    .join("");

  return `<ul id="hexo-breadcrumb">${linksHTML}</ul>`;
}
