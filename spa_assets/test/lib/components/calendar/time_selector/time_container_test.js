import test from "tape";
import { testDatesEqual } from "test/shared/test_cases";
import { buildSpyOnce } from "test/shared/mocks";

import { Hours, Minutes } from "components/calendar/time_selector/time_container";

test("Calendar TimeContainer Hours", function(t) {
  function date(hours) {
    return new Date(2018, 2, 3, hours);
  }

  t.test("#formattedValue", function(t) {
    let hours10 = new Hours({ date: date(10) });
    t.equal(hours10.formattedValue, '10', "returns hours unchanged when hours >= 10");

    let hours4 = new Hours({ date: date(4) });
    t.equal(hours4.formattedValue, '04', "adds leading 0 when hours < 10");

    let hours0 = new Hours({ date: date(0) });
    t.equal(hours0.formattedValue, '0', "doesn't add leading 0 when hours === 0");
  
    t.end();
  });

  t.test("#setValue() valid value", function(t) {
    let onChange = buildSpyOnce();
    let hours = new Hours({ onChange, date: date(10) });

    hours.setValue('04');

    testDatesEqual(t, onChange.calledWith[0], date(4), "calls onChange with parsed hour");
  
    t.end();
  });

  t.test("#setValue() invalid values", function(t) {
    let onChange = val => { throw `called with ${val}`; };
    let hours = new Hours({ onChange, date: date(10) });

    t.doesNotThrow(() => hours.setValue('-1'), "doesn't call onChange when value < 0");
    t.doesNotThrow(() => hours.setValue('24'), "doesn't call onChange when hours >= 24");
  
    t.end();
  });

  t.test("#addValue() when hour < 24", function(t) {
    let onChange = buildSpyOnce();
    let hours = new Hours({ onChange, date: date(22) });

    hours.addValue();

    testDatesEqual(t, onChange.calledWith[0], date(23), "calls onChange with added hour");
  
    t.end();
  });

  t.test("#addValue() when hour >= 24", function(t) {
    let onChange = buildSpyOnce();
    let hours = new Hours({ onChange, date: date(23) });

    hours.addValue();

    testDatesEqual(t, onChange.calledWith[0], date(0), "starts counting from 0");
  
    t.end();
  });

  t.test("#substractValue() when hour > 0", function(t) {
    let onChange = buildSpyOnce();
    let hours = new Hours({ onChange, date: date(1) });

    hours.substractValue();

    testDatesEqual(t, onChange.calledWith[0], date(0), "calls onChange with substracted hour");
  
    t.end();
  });

  t.test("#substractValue() when hour <= 0", function(t) {
    let onChange = buildSpyOnce();
    let hours = new Hours({ onChange, date: date(0) });

    hours.substractValue();

    testDatesEqual(t, onChange.calledWith[0], date(23), "starts counting from 23");
  
    t.end();
  });

  t.end();
});

test("Calendar TimeContainer Minutes", function(t) {
  function date(minutes) {
    return new Date(2018, 2, 3, 5, minutes);
  }

  t.test("#formattedValue", function(t) {
    let minutes4 = new Minutes({ date: date(4) });
    t.equal(minutes4.formattedValue, '04', "returns correct value");
  
    t.end();
  });

  t.test("#setValue() valid value", function(t) {
    let onChange = buildSpyOnce();
    let minutes = new Minutes({ onChange, date: date(10) });

    minutes.setValue('59');
    testDatesEqual(t, onChange.calledWith[0], date(59), "calls onChange with correct value");
  
    t.end();
  });

  t.test("#setValue() invalid value", function(t) {
    let onChange = buildSpyOnce();
    let minutes = new Minutes({ onChange, date: date(10) });

    minutes.setValue('60');
    t.equal(onChange.isCalled, false, "doesn't change value when it's >= 60");
  
    t.end();
  });

  t.end();
});