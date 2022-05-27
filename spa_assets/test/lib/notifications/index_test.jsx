import test from "tape";
import React from "react";
import render from "test/shared/react_renderer";
import { testTranslations } from "test/shared/react_renderer/test_cases";

import Notifications from "notifications";
import { showNoMicNotification, showMicAccessDeniedNotification } from "notifications/reducer";

test("Notifications", function(t) {
  t.test("without notifications", function(t) {
    let instance = render(<Notifications/>, {provideGlobals: true});

    t.true(instance.isEmpty());
  
    t.end();
  });

  // t.test("removing notification", function(t) {
  //   let instance = render(<Notifications/>, {provideGlobals: true});
  //   let store = instance.globals.store;

  //   store.dispatch(showNoMicNotification());
  //   console.log(instance);
  //   instance.click("close-notification");

  //   t.true(instance.isEmpty());
  
  //   t.end();
  // });

  t.end();
});

test("Notifications showNoMicNotification", function(t) {
  t.test("translations", function(t) {
    testTranslations(t, <Notifications/>, ["en", "ru"], instance => {
      let store = instance.globals.store;

      store.dispatch(showNoMicNotification());
    });
  
    t.end();
  });

  t.end();
});

test("Notifications showMicAccessDeniedNotification", function(t) {
  t.test("translations", function(t) {
    testTranslations(t, <Notifications/>, ["en", "ru"], instance => {
      let store = instance.globals.store;

      store.dispatch(showMicAccessDeniedNotification());
    });
  
    t.end();
  });

  t.end();
});