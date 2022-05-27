import test from "tape";
import { buildSpyOnce } from "test/shared/mocks";
import { mergeDate } from "utils/date";
import { testDatesEqual } from "test/shared/test_cases";

import PageBuilder from "components/calendar/page_builder";

test("Calendar PageBuilder", function(t) {
  t.test("basic usage", function(t) {
    let page = new PageBuilder(2018, 11, { onSelect: 1, selectedDate: new Date() });
    let rows = loadRows(page);

    t.equal(rows.length, 6, "returns 6 rows");
    t.equal(rows[0].length, 7, "returns 7 days in each row");

    let firstDay = rows[0][0];
    testDatesEqual(t, firstDay.date, new Date(2018, 10, 26), "sets first date to closest monday");

    let lastDay = rows[5][6];
    testDatesEqual(t, lastDay.date, new Date(2019, 0, 6), "sets last date to closest sunday");

    t.end();
  });

  t.test("eachRow() callback indexes", function(t) {
    let page = new PageBuilder(2018, 11, { selectedDate: new Date() });

    let indexes = [];
    page.eachRow((row, i) => indexes.push(i));

    t.same(indexes, [0, 1, 2, 3, 4, 5]);
    
    t.end();
  });

  t.test("when month fits in 5 rows", function(t) {
    let page = new PageBuilder(2018, 9, { selectedDate: new Date() });
    let rows = loadRows(page);

    t.equal(rows.length, 6, "adds extra row");

    let lastDay = rows[5][6];
    testDatesEqual(t, lastDay.date, new Date(2018, 10, 11), "extra row contains next week");
    
    t.end();
  });

  t.test("when month only has 28 days", function(t) {
    let page = new PageBuilder(2021, 1, { selectedDate: new Date() });
    let rows = loadRows(page);

    t.equal(rows.length, 6, "adds 2 extra rows");

    let lastDay = rows[5][6];
    testDatesEqual(t, lastDay.date, new Date(2021, 2, 14), "extra rows contain 2 next weeks");
    
    t.end();
  });

  t.test("#canDisplayPreviousMonth", function(t) {
    let page = new PageBuilder(2018, 9, { selectedDate: new Date() });
    
    t.equal(page.canDisplayPreviousMonth(), true, "returns true by default");
    
    t.end();
  });

  t.test("#canDisplayPreviousMonth with futureOnly", function(t) {
    let now = new Date();
    let page = new PageBuilder(now.getFullYear(), now.getMonth(), { 
      selectedDate: now, futureOnly: true 
    });
    
    t.equal(page.canDisplayPreviousMonth(), false, "returns false if displayed month <= now");

    let nextMonth = mergeDate(now, { month: now.getMonth() + 1 });
    page = new PageBuilder(nextMonth.getFullYear(), nextMonth.getMonth(), { 
      selectedDate: now, futureOnly: true 
    });
    
    t.equal(page.canDisplayPreviousMonth(), true, "returns true if displayed month >= now");
    
    t.end();
  });

  t.end();
});

test("eachDay()", function(t) {
  t.test("eachDay() callback indexes", function(t) {
    let page = new PageBuilder(2018, 11, { selectedDate: new Date() });

    let row;
    page.eachRow(r => row = r);

    let indexes = [];
    row.eachDay((day, i) => indexes.push(i));

    t.same(indexes, [0, 1, 2, 3, 4, 5, 6]);
    
    t.end();
  });

  t.test("day attributes: disabled days", function(t) {
    let page = new PageBuilder(2018, 11, { selectedDate: new Date() });

    let rows = loadRows(page);

    let november26 = rows[0][0];
    t.equal(november26.isDisabled, true, "sets isDisabled for days from other month");
    t.equal(november26.select, undefined, "makes disabled days unselectable");
    t.false(november26.isSelected, "adds isSelected: falsy to days that are not selected");

    t.end();
  });

  t.test("day attributes: selectable days", function(t) {
    let onSelect = buildSpyOnce();
    let selectedDate = new Date(2018, 11, 13, 11, 12);
    let page = new PageBuilder(2018, 11, { onSelect, selectedDate });

    let rows = loadRows(page);

    let december2 = rows[0][6];

    december2.select();
    let expectedDate = new Date(2018, 11, 2, 11, 12);

    testDatesEqual(t, onSelect.calledWith[0], expectedDate, "calls onSelect with correct date on day selection");

    t.end();
  });

  t.test("day attributes: selected day", function(t) {
    let selectedDate = new Date(2018, 11, 13);
    let page = new PageBuilder(2018, 11, { selectedDate });

    let rows = loadRows(page);

    let december13 = rows[2][3];

    t.equal(december13.isSelected, true, "sets isSelected: true to selected day");
    t.equal(december13.select, undefined, "makes selected day unselectable");
  
    t.end();
  });

  t.test("day attributes: when displayed and selected months are different", function(t) {
    let selectedDate = new Date(2018, 11, 13);
    let page = new PageBuilder(2018, 10, { selectedDate });

    let rows = loadRows(page);

    let november22 = rows[3][3];

    t.false(november22.isDisabled, "sets isDisabled: falsy to displayed month's days");
  
    t.end();
  });

  t.test("day attributes: with {futureOnly: true}", function(t) {
    let now = new Date();
    let page = new PageBuilder(now.getFullYear(), now.getMonth(), { selectedDate: now, futureOnly: true });
    let rows = loadRows(page);

    let oneDayAgo = mergeDate(now, { day: now.getDate() - 1 });
    let day = findDay(rows, oneDayAgo);

    t.equal(day.isDisabled, true, "sets isDisabled: true to past days");
    t.equal(day.select, undefined, "makes disabled day unselectable");

    t.end();
  });

  t.end();
});

function loadRows(page) {
  let rows = [];

  page.eachRow(row => {
    let days = [];

    row.eachDay(day => {
      days.push(day);
    });

    rows.push(days);
  });

  return rows;
}

function findDay(rows, date) {
  for (let row of rows) {
    for (let day of row) {
      if (day.year === date.getFullYear() && day.month === date.getMonth() && day.day === date.getDate()) {
        return day;
      }
    }
  }
}