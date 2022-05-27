import test from "tape";
import { React, toInstance, findByTestId } from "test/shared/react";
import { buildSpyOnce } from "test/shared/mocks";
import { stubI18n, testTranslations } from "test/shared/translations";
import { testDatesEqual } from "test/shared/test_cases";
import { mergeDate } from "utils/date";

import Calendar from "components/calendar";

test("Calendar", function(t) {
  t.test("selecting date", function(t) {
    let onSelect = buildSpyOnce();
    let selectedDate = new Date(2018, 11, 12, 13);
    let instance = createInstance({onSelect, selectedDate});

    findByTestId(instance, "select-day-11-14").props.onClick();
    let expectedDate = new Date(2018, 11, 14, 13);
    testDatesEqual(t, onSelect.calledWith[0], expectedDate, "calls onSelect with correct date");
    
    t.end();
  });

  t.test("next-month arrow", function(t) {
    let onSelect = buildSpyOnce();
    let selectedDate = new Date(2018, 11, 12, 13);
    let instance = createInstance({onSelect, selectedDate});

    findByTestId(instance, "next-month").props.onClick();
    findByTestId(instance, "select-day-0-20").props.onClick();

    let expectedDate = new Date(2019, 0, 20, 13);
    testDatesEqual(t, onSelect.calledWith[0], expectedDate, "displays next month on arrow click");
    
    t.end();
  });

  t.test("prev-month arrow", function(t) {
    let onSelect = buildSpyOnce();
    let selectedDate = new Date(2018, 11, 12, 13);
    let instance = createInstance({onSelect, selectedDate});

    findByTestId(instance, "prev-month").props.onClick();
    findByTestId(instance, "select-day-10-13").props.onClick();

    let expectedDate = new Date(2018, 10, 13, 13);
    testDatesEqual(t, onSelect.calledWith[0], expectedDate, "displays previous month on arrow click");
    
    t.end();
  });

  t.test("prev-month arrow with futureOnly: true", function(t) {
    let now = new Date();
    let instance = createInstance({selectedDate: now, futureOnly: true});

    t.throws(() => findByTestId(instance, "prev-month"), "doesn't render prev-month arrow on current month");
    
    findByTestId(instance, "next-month").props.onClick();

    t.doesNotThrow(() => findByTestId(instance, "prev-month"), "renders prev-month arrow on future months");
    
    t.end();
  });

  t.test("futureOnly: true", function(t) {
    let now = new Date();
    let twoDaysAgo = mergeDate(now, { day: now.getDate() - 2 });
    let instance = createInstance({selectedDate: twoDaysAgo, futureOnly: true});

    let oneDayAgo = mergeDate(now, { day: now.getDate() - 1 });
    let dayId = `select-day-${oneDayAgo.getMonth()}-${oneDayAgo.getDate()}`;
    let selectPastDate = findByTestId(instance, dayId).props.onClick;

    t.equal(selectPastDate, undefined, "makes past dates unselectable");
    
    t.end();
  });

  t.test("hours:minutes initial values", function(t) {
    let selectedDate = new Date(2018, 11, 12, 4, 14);
    let instance = createInstance({selectedDate});

    let hours = findByTestId(instance, "hour-selector");
    t.equal(hours.props.value, '04', "sets hours initial value");

    let minutes = findByTestId(instance, "minute-selector");
    t.equal(minutes.props.value, '14', "sets minutes initial value");

    t.end();
  });

  t.test("selecting hours", function(t) {
    let onSelect = buildSpyOnce();
    let selectedDate = new Date(2018, 11, 12, 13, 14);
    let instance = createInstance({onSelect, selectedDate});

    findByTestId(instance, "hour-selector").props.onChange({target: {value: 1}});

    let expectedDate = new Date(2018, 11, 12, 1, 14);
    testDatesEqual(t, onSelect.calledWith[0], expectedDate, "calls onSelect on hour-selector change");

    t.end();
  });

  t.test("selecting minutes", function(t) {
    let onSelect = buildSpyOnce();
    let selectedDate = new Date(2018, 11, 12, 13, 14);
    let instance = createInstance({onSelect, selectedDate});

    findByTestId(instance, "minute-selector").props.onChange({target: {value: 1}});

    let expectedDate = new Date(2018, 11, 12, 13, 1);
    testDatesEqual(t, onSelect.calledWith[0], expectedDate, "calls onSelect on minute-selector change");

    t.end();
  });

  t.test("translations", function(t) {
    let props = {selectedDate: new Date()};
    testTranslations(Calendar, props, {locales: ["en", "ru"], t});
    
    t.end();
  });

  t.end();
});

function createInstance({onSelect, selectedDate, futureOnly}) {
  let i18n = stubI18n();

  return toInstance(<Calendar 
    onSelect={onSelect} 
    selectedDate={selectedDate} 
    i18n={i18n} 
    futureOnly={futureOnly}/>
  );
}