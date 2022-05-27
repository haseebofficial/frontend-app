import TwilioClient from "./client";
import getToken from "./get_token";
import { subscribe } from "store";
import { showNoMicNotification, showMicAccessDeniedNotification } from "notifications/reducer";
import { ringing, disconnect, toggleMuted } from "./reducer";

export default class Twilio {
  constructor(store) {
    this._client = new TwilioClient;
    this._store = store;
    this._onCallRequest = this._onCallRequest.bind(this);
  }

  setup() {
    let doSetup = () => getToken().then(token => this._client.setup(token));
    this._client.onOffline(doSetup);

    return doSetup().then(() => {
      this._setupTwilioEventListeners();
      this._setupStoreEventListeners();
      
      this._client.onError(e => this._handleTwilioError(e));
      this._checkDevices();
    });

  }

  _setupTwilioEventListeners() {
    this._client.onConnect(() => {
      this._store.dispatch(ringing())
    });
    this._client.onDisconnect(() => this._store.dispatch(disconnect()));
  }

  _setupStoreEventListeners() {
    subscribe(this._store, "twilioCallRequest", this._onCallRequest);
  }

  _onCallRequest(request) {
    if (request.state === "connect_requested") {
      if (!this._client.isConnected()) {
        let params;
        if (request.call_type) {
          params = {call_type: request.call_type};
        } else {
          params = { call_id: request.call.id };
        }
        this._client.connect(params);
      }
    } else if (request.state === "disconnect_requested") {
      if (this._client.isConnected()) {
        this._client.disconnect();
      }
    } else if (request.state === "toggle_mute_requested") {
      if(this._client.isConnected()) {      
        this._client.toggleMuted(request.isMuted);
        this._store.dispatch(toggleMuted(request.isMuted));
      }
    }
  }

  async _handleTwilioError(error) {
    let isMicAvailable = await this._isMicAvailable();

    if (isMicAvailable && error.message.includes("NotAllowedError")) {
      this._store.dispatch(showMicAccessDeniedNotification());
    } else if (!isMicAvailable) {
      this._store.dispatch(showNoMicNotification());
    }
  }

  async _checkDevices() {
    let isMicAvailable = await this._isMicAvailable();

    if (!isMicAvailable) {
      this._store.dispatch(showNoMicNotification());
    }
  }

  async _isMicAvailable() {
    let devices = await this._client.enumerateDevices();

    return devices.some(d => d.kind === "audioinput");
  }
}