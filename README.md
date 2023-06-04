# hexo-breadcrumb
![MIT License](https://img.shields.io/npm/l/hexo-breadcrumb?style=social)
![NPM Version](https://img.shields.io/npm/v/hexo-breadcrumb?style=social)

Generate breadcrumb for a Hexo page

# Install

**NPM**
```bash
$ npm install hexo-breadcrumb --save-dev
```

**Yarn**
```bash
$ yarn add hexo-breadcrumb --dev
```

# Usage
#### Config
```yaml
breadcrumb:
  matrix:
    - name: Home
      format:
        - title
    - name: Category
      format:
        - home
        - title
    - name: Post
      format:
        - home
        - category
        - title
```

Add the following snippet to your layout file (e.g. `layout/_partial/post.ejs`):
```ejs
<%- post.breadcrumb.html %>
```

# License
The project is licensed under the MIT License. See the data's [LICENSE](LICENSE) file for more information.
