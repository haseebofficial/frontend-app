import test from "tape";
import { React, toInstance, findByTestId } from "test/shared/react";
import { testDatesEqual } from "test/shared/test_cases";
import { buildSpyOnce } from "test/shared/mocks";

import { HoursSelector, MinutesSelector } from "components/calendar/time_selector";

test("Calendar HoursSelector", function(t) {
  function dateBuilder(hours) {
    return new Date(2018, 1, 1, hours, 5);
  }

  behavesLikeTimeSelector(t, { type: "hour", dateBuilder, Component: HoursSelector });

  t.end();
});

test("Calendar MinutesSelector", function(t) {
  function dateBuilder(minutes) {
    return new Date(2018, 1, 1, 5, minutes);
  }

  behavesLikeTimeSelector(t, { type: "minute", dateBuilder, Component: MinutesSelector });

  t.end();
});

function behavesLikeTimeSelector(t, {type, dateBuilder, Component}) {
  t.test("input value", function(t) {
    let onChange = buildSpyOnce();
    let instance = toInstance(<Component date={dateBuilder(4)} onChange={onChange}/>);
    
    let val = findByTestId(instance, `${type}-selector`).props.value;

    t.equal(val, '04', "sets correct value to input");
  
    t.end();
  });

  t.test("input changes", function(t) {
    let onChange = buildSpyOnce();
    let instance = toInstance(<Component date={dateBuilder(10)} onChange={onChange}/>);
    
    findByTestId(instance, `${type}-selector`).props.onChange( event(5) );

    testDatesEqual(t, onChange.calledWith[0], dateBuilder(5), "calls onChange on input change");

    t.end();
  });

  t.test("arrow-up", function(t) {
    let onChange = buildSpyOnce();
    let instance = toInstance(<Component date={dateBuilder(10)} onChange={onChange}/>);
    
    findByTestId(instance, `add-${type}`).props.onClick();

    testDatesEqual(t, onChange.calledWith[0], dateBuilder(11), "calls onChange on arrow click");

    t.end();
  });

  t.test("arrow-down", function(t) {
    let onChange = buildSpyOnce();
    let instance = toInstance(<Component date={dateBuilder(10)} onChange={onChange}/>);
    
    findByTestId(instance, `substract-${type}`).props.onClick();

    testDatesEqual(t, onChange.calledWith[0], dateBuilder(9), "calls onChange on arrow click");

    t.end();
  });
}

function event(value) {
  return { target: { value } };
}