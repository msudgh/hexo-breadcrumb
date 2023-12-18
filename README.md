# hexo-breadcrumb

![MIT License](https://img.shields.io/npm/l/hexo-breadcrumb?style=social)
![NPM Version](https://img.shields.io/npm/v/hexo-breadcrumb?style=social)

A Hexo plugin to generate breadcrumbs for your posts and pages.

## Installation

### Using NPM
Install `hexo-breadcrumb` via NPM:

```bash
npm install hexo-breadcrumb --save-dev
```

### Using Yarn
Alternatively, use Yarn to add the package:

```bash
yarn add hexo-breadcrumb --dev
```

## Usage

### Configuration
In your `_config.yml` file, specify the breadcrumb settings:

```yaml
breadcrumb:
  homepage:
    # Customize the title for the homepage in the breadcrumb.
    title: Home
  formats:
    - layout: post
      tokens:
        - home
        - category
        - title
    - layout: page
      tokens:
        - home
        - title
```

### Integration
Add the following snippets to a layout file in order to display the breadcrumb.

```ejs
<%- page.breadcrumb %>
```

## License
This project is licensed under the [MIT License](LICENSE).
