import TwilioClientWrapper from "./wrapper";

let Client;

if (process.env.NODE_ENV === "test") {
  let { defmock } = require("test/shared/mocks");
  
  Client = defmock(TwilioClientWrapper);
} else {
  Client = TwilioClientWrapper;
}

export default Client;