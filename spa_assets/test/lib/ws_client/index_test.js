import test from "test/browser_tape";
import { storeValidToken } from "./token_helpers";
import buildStore from "store";
import { getConfig } from "config";
import WebSocket from "ws_client/web_socket";
import WsClient from "ws_client";

function setupWsClient(overwriteExpectations) {
  WebSocket.expects("connect");
  WebSocket.expects("onMessage");

  window.localStorage.setItem("current_user_id", 1);
  let token = storeValidToken();
  let store = buildStore();

  overwriteExpectations({ token });

  return new WsClient(store).setup().then(val => {
    return { store, setupResult: val };
  });
}

test("WsClient#setup", function(t) {
  t.test("resolves false without current_user_id", function(t) {
    let client = new WsClient("stub_store");

    client.setup().then(val => {
      t.equal(val, false);

      t.end();
    });
  });

  t.test("connects WS client", async function(t) {
    let { setupResult } = await setupWsClient(({ token }) => {
      let wsUrl = getConfig("ws_url");

      WebSocket.resetExpectation("connect");
      WebSocket.expects("connect").withExactArgs(wsUrl, token);
    });
    
    t.equal(setupResult, true);

    t.end();
  });

  t.test("adds message listener for auth_success once", async function(t) {
    let onMessage;
    let offMessage;

    await setupWsClient(() => {
      WebSocket.resetExpectation("onMessage");
      onMessage = WebSocket.expects("onMessage").twice();

      offMessage = WebSocket.expects("offMessage");
    });
  
    let sendMessage = onMessage.firstCall.args[0];
    let data = JSON.stringify({message: "auth_success"});
    sendMessage({data: data});

    let removedListener = offMessage.firstCall.args[0];

    t.equal(removedListener, sendMessage);

    t.end();
  });

  t.test("ignores other messages before auth", async function(t) {
    let onMessage;

    await setupWsClient(() => {
      WebSocket.resetExpectation("onMessage");
      onMessage = WebSocket.expects("onMessage");
    });
  
    let sendMessage = onMessage.firstCall.args[0];
    let data = JSON.stringify({message: "other"});
    sendMessage({data: data});

    t.end();
  });

  t.end();
});

async function setupAuthenticatedConnection() {
  let onMessage;

  let { store } = await setupWsClient(() => {
    WebSocket.resetExpectation("onMessage");
    onMessage = WebSocket.expects("onMessage").twice();

    WebSocket.expects("offMessage");
  });

  let sendAuth = onMessage.firstCall.args[0];
  let data = JSON.stringify({message: "auth_success"});
  sendAuth({data: data});

  let sendMessage = onMessage.secondCall.args[0];

  return { store, sendMessage };
}

test("WsClient messages", function(t) {
  t.test("unsupported messages don't change state", async function(t) {
    let { store, sendMessage } = await setupAuthenticatedConnection();
    let oldState = store.getState();

    let data = JSON.stringify({data: {}, message: "not_supported"});
    sendMessage({data});

    t.same(oldState, store.getState());
  
    t.end();
  });

  t.end();
});

test("WsClient call_requests messages", function(t) {
  t.test("call_requests#confirmed adds offer to state", async function(t) {
    let { store, sendMessage } = await setupAuthenticatedConnection();

    let interpreter = {a: 1};
    let data = JSON.stringify({data: {interpreter, search_id: 123}, message: "call_requests#confirmed"});
    sendMessage({data});

    let offers = store.getState().callSearches["123"].offers;
    t.same(offers, [interpreter]);
  
    t.end();
  });

  t.end();
});

import { updateCurrentCall } from "twilio/reducer";

test("WsClient twilio_conference messages", function(t) {
  t.test("twilio_conference#conference_started updates call duration", async function(t) {
    let { store, sendMessage } = await setupAuthenticatedConnection();

    store.dispatch(updateCurrentCall({id: 123}));
    let data = JSON.stringify({data: {duration: 100, call_id: 123}, message: "twilio_conference#conference_started"});
    sendMessage({data});

    let duration = store.getState().twilioCall.call.duration;
    t.equal(duration, 100);
  
    t.end();
  });

  t.end();
});