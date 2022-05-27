import test from "tape";
import { testDatesEqual } from "test/shared/test_cases";
import { buildSpyOnce } from "test/shared/mocks";
import { mergeDate } from "utils/date";

import Day from "components/calendar/page_builder/day";

test("PageBuilder Day", function(t) {
  t.test("basic usage", function(t) {
    let day = new Day(2018, 13, 35);

    t.equal(day.day, 7);
    t.equal(day.month, 2);
    t.equal(day.year, 2019);
    testDatesEqual(t, day.date, new Date(2018, 13, 35));
    
    t.equal(day.select, undefined, "sets #select to undefined by default");

    t.end();
  });

  t.test("#isWeekend", function(t) {
    t.equal(new Day(2018, 11, 17).isWeekend, false, "false when not weekend");
    t.true(new Day(2018, 11, 16).isWeekend, "true when sunday");
    t.true(new Day(2018, 11, 15).isWeekend, "true when saturday");
    
    t.end();
  });

  t.test("#makeSelectable", function(t) {
    let day = new Day(2018, 9, 11);

    let callback = buildSpyOnce();
    let date = new Date(2014, 4, 21, 12, 13);
    day.makeSelectable({ date, callback });

    day.select();

    let actual = callback.calledWith[0];
    let expected = new Date(2018, 9, 11, 12, 13);
    testDatesEqual(t, actual, expected, "edits y/m/d in provided date");
    
    t.end();
  });

  t.test("#isSameDay", function(t) {
    let day = new Day(2018, 9, 11);
    let date = new Date(2018, 9, 11, 23);

    t.equal(day.isSameDay(date), true, "returns true if days are equal");

    let date2017 = mergeDate(date, {year: 2017});
    t.equal(day.isSameDay(date2017), false, "returns false if years dont match");

    let dateNextMonth = mergeDate(date, {month: 10});
    t.equal(day.isSameDay(dateNextMonth), false, "returns false if months dont match");

    let oneDayAgo = mergeDate(date, {day: 10});
    t.equal(day.isSameDay(oneDayAgo), false, "returns false if days dont match");

    t.end();
  });

  t.test("#isSameMonth", function(t) {
    let day = new Day(2018, 9, 11);
    let date = new Date(2018, 9, 5);

    t.equal(day.isSameMonth(date), true, "returns true if months are equal");
    
    let date2017 = mergeDate(date, { year: 2017 });
    t.equal(day.isSameMonth(date2017), false, "returns false if years dont match");

    let dateNextMonth = mergeDate(date, {month: 10});
    t.equal(day.isSameMonth(dateNextMonth), false, "returns false if months dont match");

    t.end();
  });

  t.test("#isLessThan", function(t) {
    let day = new Day(2018, 9, 11);
    let date = new Date(2018, 9, 11, 23, 59);

    t.equal(day.isLessThan(date), false, "returns false if difference < 1 day");

    let nextDay = mergeDate(date, { day: 12 });
    t.equal(day.isLessThan(nextDay), true, "returns true if difference > 1 day");
  
    t.end();
  });
  
  t.end();
});