# hexo-breadcrumb

![MIT License](https://img.shields.io/npm/l/hexo-breadcrumb?style=social)
![NPM Version](https://img.shields.io/npm/v/hexo-breadcrumb?style=social)

Generate breadcrumb for a Hexo post/page.

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
  homepage:
    # Override the default homepage title in breadcrumb.
    title: Home
  matrix:
    - layout: post
      format:
        - home
        - category
        - title
    - layout: page
      format:
        - home
        - title
```

Links are ordered based on the determined `matrix` array per layout in `_config.yml` file.

After configuration, Add the following snippet to your post/page layout file to render breadcrumb in layouts.

**post**:

```ejs
<%- post.breadcrumb %>
```

**page**:

```ejs
<%- page.breadcrumb %>
```

# License

The project is licensed under the MIT [License](LICENSE).
