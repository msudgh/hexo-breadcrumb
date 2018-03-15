const config = hexo.config
const breadcrumb = hexo.config.breadcrumb

hexo.extend.filter.register('before_post_render', function(data){
  // return data if breadcumb doesn't exist and data's layout isn't post
  if ((!breadcrumb || !breadcrumb.hasOwnProperty('display')) || data.layout !== 'post') return data

  const links = [{
    title: breadcrumb.homepage && breadcrumb.homepage.title ? breadcrumb.homepage.title : config.title ? config.title : 'Homepage',
    url: breadcrumb.homepage && breadcrumb.homepage.url ? breadcrumb.homepage.url : config.url ? config.url : '/', // should be absolute address
    position: breadcrumb.homepage && breadcrumb.homepage.position ? breadcrumb.homepage.position : 1
  }, {
    title: data.title !== '' ? data.title : data.slug,
    url: data.permalink, // should be absolute address
    position: 2
  }]

  data.breadcrumb = {
    html: nav_generator(links),
    links: links
  }
})

function nav_generator(list) {
  let result = ''
  list.forEach(link => {
    result += `<li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem"><a itemprop="item" href="${link.url}"><span itemprop="name">${link.title}</span></a><meta itemprop="position" content="${link.position}" /></li>`
  })

  return `<ol class="breadcrumb" ${breadcrumb.display ? '' : `style="display: none"`} itemscope itemtype="http://schema.org/BreadcrumbList">${result}</ol>`
}
