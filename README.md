# PWA PoC
Stack to be used:
- React
- PWA
    - Offline resources
    - Location fetching using service-worker

## Extending Webpack
This app is built on top of the [create-react-app-typescript](https://github.com/wmonk/create-react-app-typescript) package. This normally means that editing the webpack file is not possible. Though we have a solution for that, at least for the development environment. 

We took the `start.js` file and reused it in our project under `/scripts/start.js`. This way we can manipulate the webpack file before loading it. We added 2 functions in our `/scripts/start.js`:
- `extendWebpackConfig(config)`
- `extendServerConfig(config)`

Inside `extendWebpackConfig(config)` it's possible to extend the webpack config, just like the function name says. This config is only used in the developent env. This way you can add loaders, aliases etc. 

The `extendServerConfig(config)` function make it possible for us to use ServiceWorkers on our localhost, by removing the `noopServiceWorkerMiddleware()` function which is added by `create-react-app` by default.

# Useful links
- [The Service Worker Lifecycle](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle)
- [Service Worker cookbook](https://serviceworke.rs/)
- [PWA rocks (Popular PWA apps)](https://pwa.rocks/)