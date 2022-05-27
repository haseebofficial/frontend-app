import test from "test/browser_tape";
import { validToken, storeValidToken } from "./helpers/token";
import getToken from "twilio/get_token";
import TwilioToken from "resources/twilio_token";

test("twilio getToken", function(t) {
  t.test("gets token from localStorage", async function(t) {
    let token = storeValidToken();

    t.equal(await getToken(), token);
  
    t.end();
  });

  t.test("gets token from TwilioToken resource", async function(t) {
    let token = validToken();
    TwilioToken.find.mockOnce([], {twilio_token: token});

    t.equal(await getToken(), token);
  
    t.end();
  });

  t.end();
});