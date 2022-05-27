export function testAnyNotificationDisplayed(t, store) {
  let notifications = getNotifications(store);

  t.notSame(notifications, [], "displays at least one notification");
}

export function testZeroNotificationsDisplayed(t, store) {
  let notifications = getNotifications(store);

  t.same(notifications, [], "doesn't display any notifications");
}

export function testNotificationsNotChanged(t, store, doSomething) {
  let oldNotifications = getNotifications(store);

  return executeInOrder(doSomething, () => {
    let newNotifications = getNotifications(store);

    t.same(oldNotifications, newNotifications, "doesn't change notifications after action");
  });
}

function getNotifications(store) {
  return store.getState().notifications;
}

function executeInOrder(func1, func2) {
  let result = func1();

  if (result.then) {
    return result.then(func2);
  } else {
    return func2();
  }
}