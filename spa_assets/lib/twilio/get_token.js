import CacheableJwt from "utils/cacheable_jwt";
import TwilioToken from "resources/twilio_token";

export default function getToken() {
  return CacheableJwt.get("TWILIO_JWT", fetchNewToken);
}

function fetchNewToken() {
  return TwilioToken.find().then(json => json.twilio_token);
}