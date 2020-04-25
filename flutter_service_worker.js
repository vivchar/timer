'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "3dbbcff92944459d7a5fd5ced132c2cf",
"/": "3dbbcff92944459d7a5fd5ced132c2cf",
"main.dart.js": "ac7e2a8f467bccb91a222e863265ebee",
"favicon.png": "4262468ff1012464beb4c19acb585d5e",
"icons/Icon-192.png": "e3f9c1b62a4b599c3ac11fddd19df082",
"icons/Icon-512.png": "608333fe4fac00b538025a5608d9e110",
"manifest.json": "7645c5133fbe2555405588bd19bf44e9",
"assets/LICENSE": "a86dbd2ea3318a9b7bd1d8f14c44041f",
"assets/AssetManifest.json": "854bff5fcfbdd32dcca759624a7a1afb",
"assets/FontManifest.json": "d564ab81c2e49ab9268be0f1ef93bfff",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "2aa350bd2aeab88b601a593f793734c0",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "2bca5ec802e40d3f4b60343e346cedde",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "5a37ae808cf9f652198acde612b5328d",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/assets/sounds/clock-tick.wav": "f8ead5c930f6693ab96b2b15ee1e8471",
"assets/assets/sounds/voice_five.ogg": "c0c31288fd822e2e62b424e67637e2fc",
"assets/assets/sounds/voice_finish.ogg": "511ce65e11c474cdd8d949375c6edd68",
"assets/assets/sounds/sound_gong_01.wav": "91c2c3c803ef92d30d83a2bf0c366535",
"assets/assets/sounds/voice_one.ogg": "f84b55ca1bf3412af7e290e2b81f30d3",
"assets/assets/sounds/sound_water_drop.wav": "fb4d7cb5d0c9dbfd16562f0bb1587b7e",
"assets/assets/sounds/sound_bell_boxing_1.wav": "0faec93f7212dafc7a5afe33aeb78965",
"assets/assets/sounds/sound_boxing_10_seconds_left.ogg": "c87f2df33a5158a75a4af2b6943e3b68",
"assets/assets/sounds/sound_bell_boxing_3.wav": "2efae6d85a3bb90a6437ab1cb0f3b94f",
"assets/assets/sounds/synthetic-shot-timer.wav": "55c14c6cf441357422a38397a0406b29",
"assets/assets/sounds/sound_bell_boxing_3.ogg": "a7f0016675a889ca26b1cac34acde89a",
"assets/assets/sounds/voice_rest.ogg": "74c743df2857c68b0531d22c8d2715a5",
"assets/assets/sounds/sound_water_drop.ogg": "bcf37d91cdabb0923fbf7b79a81b126b",
"assets/assets/sounds/sound_bell_boxing_1.ogg": "da4ecb9cb32afb57a7936e4c62d64061",
"assets/assets/sounds/gong.wav": "b266560310dc0eb3e265d127b62691fb",
"assets/assets/sounds/sound_gong_01.ogg": "22ccb237ce54e829388fed1048b103ee",
"assets/assets/sounds/sound_click.wav": "94f0f74edc3195ab742018bc5928c5db",
"assets/assets/sounds/voice_two.ogg": "3196d9dc08a06fed071ed9c8243241b6",
"assets/assets/sounds/metal-tick-3.wav": "dfa867e3e46a844a49da24cef33bf380",
"assets/assets/sounds/sound_electronic_stab.wav": "22fda472497e19f148493f968c6db1fa",
"assets/assets/sounds/sound_electronic_stab.ogg": "a54bc5c718e66a6c2032886ad45cf24c",
"assets/assets/sounds/voice_work.ogg": "b2806c1c2fdab807ca2db770940cebe8",
"assets/assets/sounds/sound_click.ogg": "b6904de095eb981c6f881418a253dfe6",
"assets/assets/sounds/sound_whistle_01.ogg": "f8fe0c2ffa8cdc3f5da6e7a38072ec59",
"assets/assets/sounds/sound_glass.wav": "01acf77c1d9bb7e6bc7e67ef7817e2ca",
"assets/assets/sounds/voice_three.ogg": "f062a683a9251951a6506f7dc5934183",
"assets/assets/sounds/voice_four.ogg": "21a58eb6dbffbf61e7a85a56e823192c",
"assets/assets/sounds/sound_xylophone.wav": "791b0b3331ab541a3d8a648ca2076792",
"assets/assets/sounds/sound_gong_metal.wav": "f3f6e085d30d84e3324c683579ce25d9",
"assets/assets/sounds/sound_gong_metal.ogg": "49d406780d449d54e8b079317af49b7b",
"assets/assets/sounds/sound_xylophone.ogg": "0305987ea0a427ad89710eb472f00914",
"assets/assets/sounds/sound_glass.ogg": "04eaeaa7f346bc6ab65ba2a1a48d890c",
"assets/assets/sounds/sound_whistle_01.wav": "fec36d1963c9bf3043086861e3699bdf",
"assets/assets/fonts/Shrikhand-Regular.ttf": "68cc776bdd925c39995527bb2fc5765c"
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
