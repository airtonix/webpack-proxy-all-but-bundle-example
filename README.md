# webpack-proxy-all-but-bundle-example

Demonstrates how to do something much requested:

1. webpack-dev-server running at something like : `http://localhost:3000`
    1. builds and serves assets to `publicPath` of something like `/static/`
    1. forwards any path that isn't a webpack asset path onto the server in step 2.

2. another server running at something like : `http://localhost:80`
    1. serves pages for anything: `http://localhost:80/index.html` or `http://localhost:80/` or `http://localhost:80/foo/bar/baz.html` etc
    1. pages here have static (or dynamic references as per WebpackManifestPlugin json file) like `<script src="/static/main.js"></script>`

3. You access server in step 2 via webpack-dev-server in step 1:

    1. open http://localhost:3000/foo/bar/baz.html
        1. html file request passes through the proxy to the server in step 2 because it doesn't match a local pattern.
        2. browser sees `/statiic/main.js` requests it.
        3. `/static/main.js` matches a local pattern, therefore the request is not passed through the proxy, but instead just served from webpack-dev-server memoryfs.
        
        
# Why 

- hot module reloading is much better than livereload.
    - server in step 2 doesn't have to recompute stuff
    - anything required by the server to render the page are only required when we actually need to re-render the page.


## Demo

1. `git clone`
2. `npm install`
3. `npm run start`

