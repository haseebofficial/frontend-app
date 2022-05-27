export default class TwilioClientWrapper {
  constructor() {
    this._device = new Twilio.Device();
  }

  get _connection() {
    return this._device.activeConnection();
  }

  setup(jwt) {
    this._device.setup(jwt);
  }

  connect(params) {
    this._device.connect(params);
  }

  onOffline(callback) {
    this._device.on("offline", callback);
  }

  onConnect(callback) {
    this._device.on("connect", callback);
  }

  onDisconnect(callback) {
    this._device.on("disconnect", callback);
  }

  onError(callback) {
    this._device.on("error", callback);
  }

  isConnected() {
    return !!this._connection;
  }

  disconnect() {
    this._connection.disconnect();
  }

  toggleMuted(isMuted) {
    this._connection.mute(isMuted);
  }

  enumerateDevices() {
    return navigator.mediaDevices.enumerateDevices();
  }
}