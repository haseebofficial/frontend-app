import test from "test/browser_tape";
import CalendarSheet from "calendar/use_calendar_sheet/calendar_sheet";

test("CalendarSheet", function(t) {
  t.test("#firstDay", function(t) {
    t.test("returns start of month", function(t) {
      let sheet = new CalendarSheet(2020, 3);

      t.equal(sheet.firstDay.getFullYear(), 2020);
      t.equal(sheet.firstDay.getMonth(), 3);
      t.equal(sheet.firstDay.getDate(), 1);

      t.end();
    });
  });

  t.test("#lastDay", function(t) {
    t.test("returns end of month", function(t) {
      let sheet = new CalendarSheet(2020, 3);

      t.equal(sheet.lastDay.getFullYear(), 2020);
      t.equal(sheet.lastDay.getMonth(), 3);
      t.equal(sheet.lastDay.getDate(), 30);
  
      t.end();
    });
  });

  t.test("#weeks", function(t) {
    t.test("returns correct number of weeks", function(t) {
      let sheet = new CalendarSheet(2020, 3);

      let weeks = sheet.weeks;
      t.equal(weeks.length, 5);
      t.equal(weeks[0].length, 7);
  
      t.end();
    });

    t.test("fills other months' dates with nulls by default", function(t) {
      let sheet = new CalendarSheet(2020, 3);
      let firstWeek = sheet.weeks[0];

      t.equal(firstWeek[0], null);
      t.equal(firstWeek[3].getDate(), 1);
      t.equal(firstWeek[6].getDate(), 4);

      t.end();
    });
    
    t.test("fillAdjacentMonths option fills other months' dates", function(t) {
      let sheet = new CalendarSheet(2020, 3, {fillAdjacentMonths: true});
      let firstWeek = sheet.weeks[0];

      t.equal(firstWeek[0].getDate(), 29);
      t.equal(firstWeek[3].getDate(), 1);
    
      t.end();
    });

    t.test("weekStartsOn option shifts weeks to correct day", function(t) {
      let sheet = new CalendarSheet(2020, 3, {weekStartsOn: 6});
      let secondWeek = sheet.weeks[1];

      t.equal(secondWeek[0].getDate(), 4);
      t.equal(secondWeek[6].getDate(), 10);

      t.end();
    });

    t.test("minWeeksPerSheet option ensures sheet has at least n weeks", function(t) {
      let sheet = new CalendarSheet(2020, 3, {minWeeksPerSheet: 6});

      let weeks = sheet.weeks;
      t.equal(weeks.length, 6);
      t.same(weeks[5][0], null);
    
      t.end();
    });

    t.test("minWeeksPerSheet option respects weekStartsOn option", function(t) {
      let sheet = new CalendarSheet(2019, 11, {minWeeksPerSheet: 6, fillAdjacentMonths: true, weekStartsOn: 1});
      t.equal(sheet.weeks.length, 6);
      t.same(sheet.weeks[5][0].getDate(), 30);

      t.end();
    });

    t.test("rtl option reverses order in weeks", function(t) {
      let sheet = new CalendarSheet(2020, 3, {rtl: true});

      t.same(sheet.weeks[0][0].getDate(), 4);
    
      t.end();
    });
  });
});
