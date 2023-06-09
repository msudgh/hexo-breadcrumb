/*global hexo*/
const { config } = hexo;
const { breadcrumb } = hexo.config;

/**
 * Convert links to HTML
 *
 * @param {Array<{ url: string, title: string}>} links - Array of link objects
 * @return {string} links_ol - HTML markup for the links
 */
function toHTML(links) {
  const links_li = links
    .map(function(link) {
      return `<li><a href="${link.url}"><span>${link.title}</span></a></li>`;
    })
    .join("");

  return `<ul id="hexo-breadcrumb">${links_li}</ul>`;
}

/**
 * Get ordered links by matrix
 *
 * @param {string} layout
 * @param {Array<Record<number, { layout: string }>>} matrix
 * @param {Array<{ url: string, title: string}>} links - Array of link objects
 * @return {Array<string>}
 */
function getOrderedLinksByMatrix(layout, matrix, links) {
  const detectedLayout = matrix.find(function(item) {
    return item.layout === layout;
  });

  return detectedLayout.format
    .map(function(key) {
      return links[key];
    })
    .flat();
}

function setupBreadcrumb(data) {
  if (!breadcrumb && !breadcrumb.homepage) {
    return data;
  }

  const { layout } = data;
  const { homepage, matrix } = breadcrumb;

  const homeLink = {
    title: homepage?.title || config.title,
    url: config.url
  };

  const categoryLinks = data.categories.data.map(function(category) {
    return {
      title: category.name,
      url: category.permalink
    };
  });

  const titleLink = {
    title: data?.title || data.slug,
    url: data.permalink
  };

  const unorderedLinks = {
    home: homeLink,
    category: categoryLinks,
    title: titleLink
  };

  const links = getOrderedLinksByMatrix(layout, matrix, unorderedLinks);

  console.log({ links });

  return toHTML(links);
}

// Register before_post_render filter
// Ref: https://hexo.io/api/filter#before-post-render
hexo.extend.filter.register("before_post_render", function(data) {
  if (data.layout !== "post" && data.layout !== "page") {
    return data;
  }

  data.breadcrumb = setupBreadcrumb(data);
});
