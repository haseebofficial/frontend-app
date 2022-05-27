import test from "test/browser_tape";
import { finishAsyncActions } from "test/shared/promises";
import TwilioClient from "twilio/client";
import { setupTwilio, audioInputDevice } from "./helpers/client";
import {
  testAnyNotificationDisplayed, 
  testZeroNotificationsDisplayed,
  testNotificationsNotChanged
} from "test/lib/notifications/helpers";

test("Twilio#setup user notifications", function(t) {
  t.test("creates notification without available microphone", async function(t) {
    let { store } = await setupTwilio(() => {
      TwilioClient.resetExpectation("enumerateDevices");
      TwilioClient.expects("enumerateDevices").resolves([]);
    });

    await finishAsyncActions();

    testAnyNotificationDisplayed(t, store);
  
    t.end();
  });

  t.test("doesn't create notification if microphone is available", async function(t) {
    let { store } = await setupTwilio(() => {
      TwilioClient.resetExpectation("enumerateDevices");
      TwilioClient.expects("enumerateDevices").resolves([audioInputDevice]);
    });

    await finishAsyncActions();

    testZeroNotificationsDisplayed(t, store);
  
    t.end();
  });

  t.test("NotAllowedError with available microphone creates notification", async function(t) {
    let { store, onError } = await setupTwilioDoubleDeviceCheck(audioInputDevice);

    let triggerError = onError.firstCall.args[0];
    triggerError({message: "foobar NotAllowedError test"});
    await finishAsyncActions();

    testAnyNotificationDisplayed(t, store);
  
    t.end();
  });

  t.test("NotAllowedError without available microphone doesn't change notification", async function(t) {
    let { store, onError } = await setupTwilioDoubleDeviceCheck();

    await testNotificationsNotChanged(t, store, async function() {    
      let triggerError = onError.firstCall.args[0];
      triggerError({message: "foobar NotAllowedError test"});

      await finishAsyncActions();
    });
  
    t.end();
  });

  t.test("any other error with available microphone doesn't create notification", async function(t) {
    let { store, onError } = await setupTwilioDoubleDeviceCheck(audioInputDevice);

    let triggerError = onError.firstCall.args[0];
    triggerError({message: "other"});
    await finishAsyncActions();

    testZeroNotificationsDisplayed(t, store);
  
    t.end();
  });

  t.end();
});

async function setupTwilioDoubleDeviceCheck(device) {
  let onError;
  let devices = device ? [device] : [];

  let { store } = await setupTwilio(() => {
    TwilioClient.resetExpectation("enumerateDevices");
    TwilioClient.expects("enumerateDevices").resolves(devices).twice();

    TwilioClient.resetExpectation("onError");
    onError = TwilioClient.expects("onError");
  });

  return { onError, store };
}