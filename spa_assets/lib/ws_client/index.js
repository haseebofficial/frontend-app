import WebSocket from "./web_socket";
import { getConfig } from "config";
import getToken from "./get_token";

import callSearchWsActions from "call_search/ws_actions";
import interpretationCallWsActions from "interpretation_call/ws_actions";
import supportCallWsActions from "support_call/ws_actions";

export default class WsClient {
  constructor(store) {
    this._store = store;
    this._socket = new WebSocket();

    this._awaitAuth = this._awaitAuth.bind(this);
    this._processMessage = this._processMessage.bind(this);

    this.wsActions = [ callSearchWsActions, interpretationCallWsActions, supportCallWsActions ];
  }

  async setup(_is_newFE=false) {
    if (this._isUserLoggedIn()) {
      return getToken(_is_newFE).then(jwt => {      
        return this._connect(jwt);
      });
    } else {
      return Promise.resolve(false);
    }
  }

  _isUserLoggedIn() {
    return !! (window.localStorage.getItem("current_user_id")!=null || window.localStorage.getItem("user")!=null);

  }

  _connect(jwt) {
    let wsUrl = getConfig("ws_url");

    this._socket.connect(wsUrl, jwt);
    this._socket.onMessage(this._awaitAuth);

    return true;
  }

  _awaitAuth(e) {
    let data = JSON.parse(e.data);

    if (data.message === "auth_success") {
      this._socket.offMessage(this._awaitAuth);
      this._socket.onMessage(this._processMessage);
    }
  }

  _processMessage(e) {
    let data = JSON.parse(e.data);

    this.wsActions.forEach(wsAction => {
      let action = wsAction(data);
      if (action) { this._store.dispatch(action); }
    });
  }
}