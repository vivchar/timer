'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "7009591128b005350656eb0bbc4598c1",
"assets/assets/fonts/Shrikhand-Regular.ttf": "68cc776bdd925c39995527bb2fc5765c",
"assets/assets/privacy-policy.md": "60f8b0f803ee949840e8d78d6cb630e7",
"assets/assets/sounds/sound_bell_boxing_1.wav": "0faec93f7212dafc7a5afe33aeb78965",
"assets/assets/sounds/sound_bell_boxing_3.wav": "2efae6d85a3bb90a6437ab1cb0f3b94f",
"assets/assets/sounds/sound_click.wav": "94f0f74edc3195ab742018bc5928c5db",
"assets/assets/sounds/sound_whistle_01.wav": "fec36d1963c9bf3043086861e3699bdf",
"assets/assets/terms-of-service.md": "3dbce96c9a8dd5145eba46aff3a8cdeb",
"assets/FontManifest.json": "d564ab81c2e49ab9268be0f1ef93bfff",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/LICENSE": "44ed14543a8a4777da5762376acef859",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/packages/flutter_markdown/assets/logo.png": "67642a0b80f3d50277c44cde8f450e50",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "5a37ae808cf9f652198acde612b5328d",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "2bca5ec802e40d3f4b60343e346cedde",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "2aa350bd2aeab88b601a593f793734c0",
"favicon.png": "4262468ff1012464beb4c19acb585d5e",
"icons/Icon-192.png": "e3f9c1b62a4b599c3ac11fddd19df082",
"icons/Icon-512.png": "608333fe4fac00b538025a5608d9e110",
"index.html": "5a32f8ccf2809d326ff274e20d71dc39",
"/": "5a32f8ccf2809d326ff274e20d71dc39",
"main.dart.js": "f5fd1527ebad32dce0e777a511e90244",
"manifest.json": "e459dd7e8f76b87116b82825e6308d49"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
