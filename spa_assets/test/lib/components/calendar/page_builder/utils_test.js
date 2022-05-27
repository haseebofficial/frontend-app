import test from "tape";
import { testDatesEqual } from "test/shared/test_cases";

import { findFirstMonday, findLastSunday } from "components/calendar/page_builder/utils";

test("PageBuilder utils: findFirstMonday", function(t) {
  t.test("when month starts from monday", function(t) {
    let result = findFirstMonday(new Date(2018, 9, 12));
    let expected = new Date(2018, 9, 1);

    testDatesEqual(t, result, expected, "returns first day of month");
    
    t.end();
  });

  t.test("when month starts from any other day", function(t) {
    let result = findFirstMonday(new Date(2018, 11));
    let expected = new Date(2018, 10, 26);

    testDatesEqual(t, result, expected, "returns last monday of previous month");

    t.end();
  });

  t.test("when month starts from sunday", function(t) {
    let result = findFirstMonday(new Date(2020, 10, 21));
    let expected = new Date(2020, 9, 26);
    testDatesEqual(t, result, expected, "returns last monday of previous month");

    t.end();
  });
  
  t.end();
});

test("PageBuilder utils: findLastSunday", function(t) {
  t.test("when month ends with sunday", function(t) {
    let result = findLastSunday(new Date(2018, 8, 12));
    let expected = new Date(2018, 8, 30);

    testDatesEqual(t, result, expected, "returns last day of month");
    
    t.end();
  });

  t.test("when month ends with any other day", function(t) {
    let result = findLastSunday(new Date(2018, 11));
    let expected = new Date(2019, 0, 6);

    testDatesEqual(t, result, expected, "returns first sunday of next month");
    
    t.end();
  });
  
  t.end();
});