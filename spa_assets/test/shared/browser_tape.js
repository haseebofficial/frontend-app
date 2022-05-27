import tape from "tape";
import createBluesnapStub from "test/lib/credit_card/modal/bluesnap_stub";
import TwilioClient from "twilio/client";
import WebSocket from "ws_client/web_socket";
import testHttpClient from "resources/http_client";

export default function test(message, func) {
  return tape(message, function(t) {
    t.test = test;

    t.oldEnd = t.end;
    t.end = function() {
      deleteGlobalStubs();

      try {
        testHttpClient.validateAllMocksUsed();
        TwilioClient.verifyAll();
        WebSocket.verifyAll();
      } catch(e) {
        t.fail(e);
      }

      return t.oldEnd(...arguments);
    };

    createGlobalStubs();

    func(t);
  });
}

function createGlobalStubs() {
  createWindowStub();
  createDocumentStub();
}

function deleteGlobalStubs() {
  delete global.window;
  delete global.document;
}

function createWindowStub() {
  let storage = {};
  let getItem = (id) => storage[id];
  let setItem = (id, name) => storage[id] = name;

  global.window = { 
    location: {}, 
    localStorage: { getItem, setItem },
    confirm: () => {},
    bluesnap: createBluesnapStub()
  };
}

function createDocumentStub() {
  global.document = {
    addEventListener: () => {},
    removeEventListener: () => {}
  };
}