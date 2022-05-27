import test from "test/browser_tape";
import React from "react";
import { addDays, subDays } from "date-fns";
import { render } from "test/support/react_renderer";
import { usePickedDate } from "calendar";

test("usePickedDate hook", function(t) {
  function extractUsedDate(initialDate) {
    let dateAndActions = {};
    function ExtractDate() {
      let { date, actions } = usePickedDate(initialDate);
      dateAndActions.date = date;
      dateAndActions.actions = actions;
      return null;
    }
    render(<ExtractDate/>);
    return dateAndActions;
  }

  t.test("basic usage", function(t) {
    t.test("returns date", function(t) {
      let now = new Date();
      let {date} = extractUsedDate(now);

      t.equal(date, now);
  
      t.end();
    });

    t.test("always returns same actions object", function(t) {
      let used = extractUsedDate(new Date());
      let initialActions = used.actions;

      used.actions.overwriteDate(new Date());
      t.equal(initialActions, used.actions);
    
      t.end();
    });
  });

  t.test("overwriteDate action", function(t) {
    t.test("replaces date with provided one", function(t) {
      let used = extractUsedDate(new Date());
      let newDate = new Date();
      used.actions.overwriteDate(newDate);
      t.same(used.date, newDate);
    
      t.end();
    });
  });

  t.test("setDateFrom", function(t) {
    t.test("sets y/m/d from provided date", function(t) {
      let now = new Date();
      let used = extractUsedDate(now);

      used.actions.setDateFrom(new Date(2015, 3, 21));

      let date = used.date;
      t.equal(date.getFullYear(), 2015);
      t.equal(date.getMonth(), 3);
      t.equal(date.getDate(), 21);
      t.equal(date.getMilliseconds(), now.getMilliseconds());
  
      t.end();
    });
  });

  t.test("setValues", function(t) {
    t.test("sets date values", function(t) {
      let used = extractUsedDate(new Date(2015, 5));
      used.actions.setValues({hours: 2, date: 4});
      t.equal(used.date.getHours(), 2);
      t.equal(used.date.getDate(), 4);

      t.end();
    });
  });

  t.test("addDays", function(t) {
    t.test("adds n days to date", function(t) {
      let now = new Date();
      let used = extractUsedDate(now);
      used.actions.addDays(2);
      t.equal(used.date.getDate(), addDays(now, 2).getDate());
  
      t.end();
    });
  });

  t.test("subDays", function(t) {
    t.test("substracts n days from date", function(t) {
      let now = new Date();
      let used = extractUsedDate(now);
      used.actions.subDays(2);
      t.equal(used.date.getDate(), subDays(now, 2).getDate());
  
      t.end();
    });
  });

  t.test("addSameDayHours", function(t) {
    t.test("adds hours to date", function(t) {
      let used = extractUsedDate(new Date(2015, 3));
      used.actions.addSameDayHours(2);
      t.equal(used.date.getHours(), 2);
  
      t.end();
    });

    t.test("doesn't roll over to next day", function(t) {
      let used = extractUsedDate(new Date(2015, 3, 1, 4));
      used.actions.addSameDayHours(245);
      t.equal(used.date.getHours(), 9);
      t.equal(used.date.getDate(), 1);
  
      t.end();
    });
  });

  t.test("subSameDayHours", function(t) {
    t.test("substracts hours from date", function(t) {
      let used = extractUsedDate(new Date(2015, 3, 3));
      used.actions.subSameDayHours(2);
      t.equal(used.date.getHours(), 22);
  
      t.end();
    });
  });

  t.test("addSameHourMinutes", function(t) {
    t.test("adds minutes to date", function(t) {
      let used = extractUsedDate(new Date(2015, 3));
      used.actions.addSameHourMinutes(2);
      t.equal(used.date.getMinutes(), 2);
    
      t.end();
    });

    t.test("doesn't roll over to next hour", function(t) {
      let used = extractUsedDate(new Date(2015, 3));
      used.actions.addSameHourMinutes(184);
      t.equal(used.date.getMinutes(), 4);
      t.equal(used.date.getHours(), 0);
    
      t.end();
    });
  });

  t.test("subSameHourMinutes", function(t) {
    t.test("substracts minutes from date", function(t) {
      let used = extractUsedDate(new Date(2015, 3));
      used.actions.subSameHourMinutes(4);
      t.equal(used.date.getMinutes(), 56);
  
      t.end();
    });
  });
});