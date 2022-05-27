import test from "test/browser_tape";
import { finishAsyncActions } from "test/shared/promises";
import TwilioClient from "twilio/client";
import { requestConnect, requestDisconnect, requestToggleMuted, requestSupportCallConnect } from "twilio/reducer";
import { setupTwilio } from "./helpers/client";

test("Twilio#setup", function(t) {
  t.test("sets up TwilioClient", async function(t) {
    await setupTwilio(({token}) => {
      TwilioClient.resetExpectation("setup");
      TwilioClient.expects("setup").withExactArgs(token);
    });

    t.end();
  });

  t.test("adds TwilioClient.onOffline callback", async function(t) {
    let onOffline;

    await setupTwilio(({token}) => {
      TwilioClient.resetExpectation("onOffline");
      onOffline = TwilioClient.expects("onOffline");

      TwilioClient.resetExpectation("setup");
      TwilioClient.expects("setup").twice().withExactArgs(token);
    });

    let twilioOffline = onOffline.firstCall.args[0];
    twilioOffline();

    await finishAsyncActions();

    t.end();
  });
  
  t.end();
});

test("Twilio store: `requestConnect` action", function(t) {
  t.test("initiates connection", async function(t) {
    let { store } = await setupTwilio(() => {
      TwilioClient.expects("isConnected").returns(false);
      TwilioClient.expects("connect").withExactArgs({call_id: 2});
    });

    store.dispatch(requestConnect({id: 2}));
  
    t.end();
  });

  t.test("doesn't connect if a connection is active", async function(t) {
    let { store } = await setupTwilio(() => {
      TwilioClient.expects("isConnected").returns(true);
    });

    store.dispatch(requestConnect({id: 2}));
  
    t.end();
  });

  t.end();
});

test("Twilio store: `requestSupportCallConnect` action", function(t) {
  t.test("initiates connection", async function(t) {
    let { store } = await setupTwilio(() => {
      TwilioClient.expects("isConnected").returns(false);
      TwilioClient.expects("connect").withExactArgs({call_type: "support_call"});
    });

    store.dispatch(requestSupportCallConnect({}));
  
    t.end();
  });

  t.end();
});

test("Twilio requestDisconnect action", function(t) {
  t.test("closes connection", async function(t) {
    let { store } = await setupTwilio(() => {
      TwilioClient.expects("isConnected").returns(true);
      TwilioClient.expects("disconnect");
    });

    store.dispatch(requestDisconnect());
  
    t.end();
  });

  t.test("doesn't disconnect if not connected", async function(t) {
    let { store } = await setupTwilio(() => {
      TwilioClient.expects("isConnected").returns(false);
    });

    store.dispatch(requestDisconnect());
  
    t.end();
  });

  t.end();
});

test("Twilio requestToggleMuted action", function(t) {
  t.test("mutes active connection", async function(t) {
    let { store } = await setupTwilio(() => {
      TwilioClient.expects("isConnected").returns(true);
      TwilioClient.expects("toggleMuted").withExactArgs(true);
    });

    store.dispatch(requestToggleMuted(true));

    t.equal(store.getState().twilioCall.isMuted, true);
  
    t.end();
  });

  t.test("does nothing without active connection", async function(t) {
    let { store } = await setupTwilio(() => {
      TwilioClient.expects("isConnected").returns(false);
    });

    store.dispatch(requestToggleMuted(true));

    t.equal(store.getState().twilioCall.isMuted, false);
  
    t.end();
  });

  t.end();
});

test("Twilio event listeners", function(t) {
  t.test("onConnect changes twilioCall state", async function(t) {
    let onConnect;

    let { store } = await setupTwilio(() => {
      TwilioClient.resetExpectation("onConnect");
      onConnect = TwilioClient.expects("onConnect");
    });

    let twilioConnected = onConnect.firstCall.args[0];

    twilioConnected();

    let twilioCall = store.getState().twilioCall;
    t.equal(twilioCall.state, "ringing");
  
    t.end();
  });

  t.test("onDisconnect changes twilioCall state", async function(t) {
    let onDisconnect;

    let { store } = await setupTwilio(() => {
      TwilioClient.resetExpectation("onDisconnect");
      onDisconnect = TwilioClient.expects("onDisconnect");
    });

    let twilioDisconnected = onDisconnect.firstCall.args[0];

    twilioDisconnected();

    let twilioCall = store.getState().twilioCall;
    t.equal(twilioCall.state, "finished");
  
    t.end();
  });

  t.end();
});