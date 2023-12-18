import type { Locals } from "hexo";
import type { Breadcrumb, Link, LinksByToken, Templates } from "./global";

const config = hexo.config;
const breadcrumbConfig = hexo.config.breadcrumb as Breadcrumb;

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
  const { homepage, templates } = breadcrumbConfig;

  const homeLink: Link = {
    title: homepage.title || config.title,
    url: config.url,
  };

  const categoryLinks: Link[] = (data.categories.data as Locals.Category[]).map(
    (category): Link => ({
      title: category.name,
      url: category.permalink,
    }),
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

  const links = getOrderedLinksByTemplates(layout, templates, unorderedLinks);
  const x = toHTML(links);
  console.log({ x });
  return x;
}

/**
 * Gets the ordered links based on the templates.
 * @param {string} layout - The layout to match against in the templates array.
 * @param {Templates} templates - The array of templates containing layout and tokens.
 * @param {LinksByToken} links - The object containing links indexed by token.
 * @throws {Error} - If the layout is not defined in the templates array.
 * @returns {Array<Link>} - The ordered array of links based on the detected layout.
 */
function getOrderedLinksByTemplates(
  layout: string,
  templates: Templates,
  links: LinksByToken,
): Link[] {
  const detectedLayout = templates.find((item) => item.layout === layout);

  if (!detectedLayout) {
    throw new Error(`Layout "${layout}" is not defined in breadcrumb.templates`);
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
    .map(
      (link) => `<li><a href="${link.url}"><span>${link.title}</span></a></li>`,
    )
    .join("");

  return `<ul id="hexo-breadcrumb">${linksHTML}</ul>`;
}

/*
 * Register before_post_render filter
 * Ref: https://hexo.io/api/filter#before-post-render
 */
hexo.extend.filter.register("before_post_render", register);
