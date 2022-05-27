// https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md
let { JSDOM } = require('jsdom');
let fetch = require("test/support/fetch_mock").default;
let jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://interpreters.travel' });
let { window } = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};

window.fetch = fetch;
global.fetch = fetch;
copyProps(window, global);