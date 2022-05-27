import { storeValidToken } from "./token";
import Twilio from "twilio";
import TwilioClient from "twilio/client";
import buildStore from "store";

export let audioInputDevice = {kind: "audioinput"};

export async function setupTwilio(overwriteExpectations) {
  TwilioClient.expects("setup");
  TwilioClient.expects("onOffline");
  TwilioClient.expects("onConnect");
  TwilioClient.expects("onDisconnect");
  TwilioClient.expects("enumerateDevices").resolves([audioInputDevice]);
  TwilioClient.expects("onError");

  let token = storeValidToken();
  let store = buildStore();

  overwriteExpectations({ token });

  await new Twilio(store).setup();

  return { store };
}