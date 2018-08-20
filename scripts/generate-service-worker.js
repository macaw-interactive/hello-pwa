const path = require('path');
const {injectManifest} = require('workbox-build');

injectManifest({
    swSrc: path.resolve(__dirname, '../public/service-worker.js'),
    swDest: path.resolve(__dirname, '../build/service-worker.js'),
    globDirectory: './build',
    globPatterns: [
        '**/*.{png,json,xml,ico,html,svg,js,css,map,eot,ttf,woff,woff2,jpg}'
    ]
}).then(({count, size}) => {
  console.log(`Generated Service Worker, which will precache ${count} files, totalling ${size} bytes.`);
});