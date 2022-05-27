import test from "enhanced-tape";
import { configure as configureRenderer, cleanup as unmountRenderedComponents } from "test/support/react_renderer";
import { cleanup as unmountRenderedHooks } from '@testing-library/react-hooks';
import { inspect } from "utils/inspect_utils";
import sinon from "sinon";
import createBluesnapStub from "test/lib/credit_card/modal/bluesnap_stub";
import { buildStore } from "new_store";

let currentFakeClock;
function fakeClock() {
  currentFakeClock = currentFakeClock || sinon.useFakeTimers(...arguments);
  return currentFakeClock;
}

// DOM setup is done in test/browser_tape/setup_dom.js file 
// which is required in test.sh script before any tests are loaded
setupReactRenderer();
setupGlobals();

function setupReactRenderer() {
  configureRenderer({testIdAttribute: "testid"});
}

function setupGlobals() {
  window.bluesnap = createBluesnapStub();
}

function resetGlobals() {
  currentFakeClock && currentFakeClock.restore();
  currentFakeClock = undefined;
  unmountRenderedComponents();
  unmountRenderedHooks();
  fetch.resetAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  clearCookies();
}

function clearCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

function applyNewTest(createTest, thisArg, [name, opts, doTest]) {
  doTest = doTest === undefined ? opts : doTest;

  doTest = new Proxy(doTest, { apply: applyAndResetGlobals });
  return createTest.apply(thisArg, [name, opts, doTest]);
}

function applyAndResetGlobals(doTest, thisArg, [t]) {
  resetGlobals();
  t.test = new Proxy(t.test, { apply: applyNewTest });
  t.end = new Proxy(t.end, { apply: applyEndTest });

  let context = {store: buildStore(), fakeClock};
  return doTest.apply(thisArg, [t, context]);
}

function applyEndTest(doEnd, t, args) {
  let unusedMocks = fetch.listUnusedMocks();
  if (unusedMocks.length !== 0) {
    t.fail(`Not all fetch mocks were used during a test. Remaining ones were: ${inspect(unusedMocks)}`);
  }

  return doEnd.apply(t, args);
}

export default new Proxy(test, { apply: applyNewTest });