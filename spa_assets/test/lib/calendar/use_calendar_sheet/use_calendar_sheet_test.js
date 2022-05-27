import test from "test/browser_tape";
import React from "react";
import { render } from "test/support/react_renderer";
import useCalendarSheet from "calendar/use_calendar_sheet";

test("useCalendarSheet hook", function(t) {
  function extractUsedSheet(year, month, config) {
    let sheetAndActions = {};
    function ExtractSheet() {
      let [sheet, actions] = useCalendarSheet(year, month, config);
      sheetAndActions.sheet = sheet;
      sheetAndActions.actions = actions;
      return null;
    }
    render(<ExtractSheet/>);
    return sheetAndActions;
  }

  t.test("basic usage", function(t) {
    t.test("configures CalendarSheet", function(t) {
      let {sheet} = extractUsedSheet(2020, 3, {minWeeksPerSheet: 7});

      t.equal(sheet.weeks.length, 7);
      t.equal(sheet.firstDay.getMonth(), 3);
  
      t.end();
    });

    t.test("always returns same actions object", function(t) {
      let used = extractUsedSheet(2020, 3);
      let initialActions = used.actions;
      used.actions.setYearMonth({month: 4});

      t.equal(initialActions, used.actions);

      t.end();
    });
  });

  t.test("setYearMonth action", function(t) {
    t.test("sets year", function(t) {
      let used = extractUsedSheet(2020, 3);
      used.actions.setYearMonth({year: 2021});

      let sheet = used.sheet;
      t.same(sheet.firstDay.getFullYear(), 2021);
      t.same(sheet.firstDay.getMonth(), 3);

      t.end();
    });

    t.test("sets month", function(t) {
      let used = extractUsedSheet(2020, 3);
      used.actions.setYearMonth({month: 0});

      let sheet = used.sheet;
      t.same(sheet.firstDay.getFullYear(), 2020);
      t.same(sheet.firstDay.getMonth(), 0);

      t.end();
    });

    t.test("passes config to new sheet", function(t) {
      let used = extractUsedSheet(2020, 3, {minWeeksPerSheet: 7});
      used.actions.setYearMonth({month: 4});

      let sheet = used.sheet;
      t.same(sheet.weeks.length, 7);

      t.end();
    });
  });

  t.test("convenience actions:", function(t) {
    t.test("addYears", function(t) {
      let used = extractUsedSheet(2020, 3);
      used.actions.addYears(1);

      let sheet = used.sheet;
      t.equal(sheet.firstDay.getFullYear(), 2021);

      t.end();
    });

    t.test("subYears", function(t) {
      let used = extractUsedSheet(2020, 3);
      used.actions.subYears(1);

      let sheet = used.sheet;
      t.equal(sheet.firstDay.getFullYear(), 2019);

      t.end();
    });

    t.test("addMonths", function(t) {
      let used = extractUsedSheet(2020, 3);
      used.actions.addMonths(1);

      let sheet = used.sheet;
      t.equal(sheet.firstDay.getMonth(), 4);

      t.end();
    });

    t.test("subMonths", function(t) {
      let used = extractUsedSheet(2020, 3);
      used.actions.subMonths(1);

      let sheet = used.sheet;
      t.equal(sheet.firstDay.getMonth(), 2);

      t.end();
    });
  });
});