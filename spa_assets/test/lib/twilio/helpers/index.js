import { setupTwilio } from "./client";
import TwilioClient from "twilio/client";

export async function setupSupportCallTwilio() {
  return await setupTwilio(() => {
    TwilioClient.expects("isConnected").returns(false);
    TwilioClient.expects("connect");
  });
}