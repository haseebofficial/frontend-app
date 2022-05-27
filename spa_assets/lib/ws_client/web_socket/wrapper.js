export default class WebSocketWrapper {
  connect(url, jwt) {
    this._socket = new WebSocket(url, jwt);
  }

  onMessage(callback) {
    this._socket.addEventListener("message", callback);
  }

  offMessage(callback) {
    this._socket.removeEventListener("message", callback);
  }
}