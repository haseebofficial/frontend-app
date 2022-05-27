import test from "tape";
import { testDatesEqual } from "test/shared/test_cases";
import { mergeDate, getDaysInMonth } from "utils/date";

test("utils/date getDaysInMonth()", function(t) {
  t.equal(getDaysInMonth(2018, 1), 28, "returns correct number of days");

  t.end();
});

test("utils/date mergeDate()", function(t) {
  t.test("without modifiers", function(t) {
    let date = new Date(2018, 11, 22, 3, 4);
    let result = mergeDate(date, {});

    testDatesEqual(t, result, date, "returns umodified date");
    t.notEqual(result, date, "returns new date object");
    
    t.end();
  });

  testZeroModifier(t, "year");
  testZeroModifier(t, "month");
  testZeroModifier(t, "day");
  testZeroModifier(t, "hours");
  testZeroModifier(t, "minutes");

  function testZeroModifier(t, modifier) {
    t.test(`modifier: ${modifier}`, function(t) {
      let modifiers = { [modifier]: 0 };

      let result = mergeDate(date(), modifiers);
      let expectedDate = date(modifiers);
      
      testDatesEqual(t, result, expectedDate, `returns date with modified ${modifier}`);
      
      t.end();
    });
  }

  t.end();
});


function date(dateConfig) {
  let defaultDateConfig = {
    year: 2018,
    month: 11,
    day: 22,
    hours: 23,
    minutes: 44
  };

  dateConfig = Object.assign({}, defaultDateConfig, dateConfig);

  return new Date(...objectToArray(dateConfig));
}

function objectToArray(object) {
  let result = [];

  for (let key in object) {
    result.push(object[key]);
  }

  return result;
}