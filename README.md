# webpack-proxy-all-but-bundle-example

Demonstrates how to do something much requested:

1. webpack-dev-server running at something like : `http://localhost:3000`
    1. builds and serves assets to `publicPath` of something like `/static/`
    1. forwards any path that isn't a webpack asset path onto the server in step 2.

2. another server running at something like : `http://localhost:80`
    1. serves pages for anything: `http://localhost:80/index.html` or `http://localhost:80/` or `http://localhost:80/foo/bar/baz.html` etc
    1. pages here have static (or dynamic references as per WebpackManifestPlugin json file) like `<script src="/static/main.js"></script>`


## Demo

1. `git clone`
2. `npm install`
3. `npm run start`

