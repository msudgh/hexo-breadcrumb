# hexo-breadcrumb
An useful tool for generate breadcrumb navigation with microdata markup for hexo posts

# Install
```bash
$ npm install hexo-breadcrumb --save-dev
```

# Usage
#### Config
| Property | Type    | Value                                              |
|----------|---------|----------------------------------------------------|
| display  | boolean | hidden breadcrumb html list or not by css property |
| homepage | record  | Overwrite homepage link context                    |


First add configuration in **`_config.yml`** from your hexo project.
```yaml
breadcrumb:
  display: true
```

Second, print out the breadcrumb in post layout
```ejs
<%- post.breadcrumb.html %>
```

# Tips
* To overwrite homepage link do same as below:
  ```yaml
  breadcrumb:
    display: true
    homepage:
      title: Home
      url: http://example.com # should be absolute address
  ```
* To hide breadcrumb html list in css way just set `display` property to `false`

# License
[MIT](https://msudgh.mit-license.org/)
