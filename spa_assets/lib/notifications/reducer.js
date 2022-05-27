const SHOW_NOTIFICATION = "SHOW_NOTIFICATION";
const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";

export function showNotification(text) {
  return {type: SHOW_NOTIFICATION, notification: text};
}

export function removeNotification() {
  return {type: REMOVE_NOTIFICATION};
}

export function showNoMicNotification() {
  return showNotification("no_microphone_detected");
}

export function showMicAccessDeniedNotification() {
  return showNotification("microphone_access_denied");
}

export default {notifications: function(notifications, action) {
  notifications = notifications || [];

  switch(action.type) {
    case SHOW_NOTIFICATION: {
      notifications = [action.notification];
      break;
    }
    case REMOVE_NOTIFICATION: {
      notifications = [];
      break;
    }
  }

  return notifications;
}};