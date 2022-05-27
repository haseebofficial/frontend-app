import test from "test/browser_tape";
import { formatTime } from "calendar/time_picker/time_formatter";

test("TimePicker's time_formatter", function(t) {
  t.test("formatTime", function(t) {
    t.test("returns 2-digit numbers unchanged", function(t) {
      t.equal(formatTime(22), 22);

      t.end();
    });

    t.test("adds leading zero to 1-digit numbers", function(t) {
      t.equal(formatTime(2), "02");
    
      t.end();
    });
  });
});