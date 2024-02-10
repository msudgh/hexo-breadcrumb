import type {
  Breadcrumb,
  DataCategory,
  Layout,
  LayoutData,
  Link,
  Links,
  LinksByToken,
} from "./global";

const packageName = "hexo-breadcrumb";
const config = hexo.config;
const breadcrumbConfig = hexo.config.breadcrumb as Breadcrumb;

/**
 * Gets the ordered links based on the templates.
 * @param {Layout} layout - The layout to match against in the templates array.
 * @param {LinksByToken} links - The object containing links indexed by token.
 * @throws {Error} - If the layout is not defined in the templates array.
 * @returns {Links} - The ordered array of links based on the detected layout.
 */
const getOrderedLinksByTemplates = (
  layout: Layout,
  links: LinksByToken,
): Links => {
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
 * @param {Links} links - The array of link objects.
 * @returns {string} - The HTML markup for the links.
 */
const toHTML = (links: Links): string => {
  const navId = `${packageName}`;
  const linkClassName = `${packageName}-item`;

  const navStyle = `<style>
    .${linkClassName} + .${linkClassName}::after {
      content: "${breadcrumbConfig.delimiter.content || "/"}";
      ${breadcrumbConfig.delimiter.style || ""}
    }
    .${linkClassName}:last-child::after {
      content: "";
    }
  </style>`;
  const linksLi = links
    .map((link) => {
      const span = `<span>${link.title}</span>`;
      const a = `<a href="${link.url}">${span}</a>`;
      return `<li class="${linkClassName}">${a}</li>`;
    })
    .join("");
  const navAriaLabel = breadcrumbConfig.aria.nav || "Breadcrumb";
  const navTag = `<nav id="${navId}" aria-label="${navAriaLabel}"><ol>${linksLi}</ol></nav>`;
  const htmlWithStyle = navStyle + navTag;

  return htmlWithStyle;
};

/**
 * Sets up the breadcrumb data for the given page or post.
 * @param {LayoutData} data - The page or post data.
 * @returns {string} - HTML content.
 */
const setupBreadcrumb = (data: LayoutData): string => {
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

  const homeLink: Link = {
    title: homepage.title || config.title,
    url: config.url,
  };

  const categoryLinks: Links = (data.categories.data as DataCategory).map(
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

  const links = getOrderedLinksByTemplates(layout, unorderedLinks);
  return toHTML(links);
};

/**
 * Registers the breadcrumb data for the given page or post.
 *
 * @param {LayoutData} data
 * @return {LayoutData | void}
 */
export const register = (data: LayoutData): LayoutData | void => {
  if (data.layout !== "post" && data.layout !== "page") {
    return data;
  }

  data.breadcrumb = setupBreadcrumb(data);

  return data;
};

/*
 * Register before_post_render filter
 * Ref: https://hexo.io/api/filter#before-post-render
 */
hexo.extend.filter.register("before_post_render", register);
