import WebSocketWrapper from "./wrapper";

let WebSocket;

if (process.env.NODE_ENV === "test") {
  let { defmock } = require("test/shared/mocks");
  
  WebSocket = defmock(WebSocketWrapper);
} else {
  WebSocket = WebSocketWrapper;
}

export default WebSocket;