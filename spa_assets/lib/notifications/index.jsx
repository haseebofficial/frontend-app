import React from "react";
import { consumeGlobals } from 'react_utils/globals';

import { removeNotification } from "./reducer";

export default consumeGlobals(Notifications, function(state) {
  return { notifications: state.notifications };
});

function Notifications(props) {
  let notifications = props.notifications;
  let close = () => props.dispatch(removeNotification());

  if (notifications.length > 0) {
    let text = props.i18n.t(`notifications.${notifications[0]}`);

    return (
      <div className="global-notification">
        <div testid="close-notification" onClick={close}>
          <div testid="notification-text">
            {text}
            <div className="cross">&times;</div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}