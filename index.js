const { config } = hexo;
const { breadcrumb } = hexo.config;

/**
 * Convert links to HTML
 *
 * @param {Array<Record<number, { url: string, title: string, position: number }>>} links - Array of link objects
 * @return {string} links_ol - HTML markup for the links
 */
function toHTML(links) {
  const links_li = links
    .map(function (link) {
      return `<li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem"><a itemprop="item" href="${link.url}"><span itemprop="name">${link.title}</span></a><meta itemprop="position" content="${link.position}" /></li>`;
    })
    .join("");

  const links_ol = `<ol class="breadcrumb" itemscope itemtype="http://schema.org/BreadcrumbList">${links_li}</ol>`;

  return links_ol;
}

// Register before_post_render filter
// Ref: https://hexo.io/api/filter#before-post-render
hexo.extend.filter.register("before_post_render", function (data) {
  const { homepage } = breadcrumb;

  const homepageLink = {
    title: homepage?.title || config.title,
    url: homepage?.url || config.url,
    position: homepage?.position || 1,
  };

  const postLink = {
    title: data?.title || data.slug,
    url: data.permalink,
    position: 2,
  };

  const links = [homepageLink, postLink];

  data.breadcrumb = {
    html: toHTML(links),
  };
});
