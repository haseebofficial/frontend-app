import test from "test/browser_tape";
import { parse24Hours, parse60Minutes } from "calendar/time_picker/time_parser";

test("TimePicker's time_parser", function(t) {
  t.test("parse24Hours", function(t) {
    t.test("{success: false} if value is nan", function(t) {
      t.equal(parse24Hours("asda").success, false);

      t.end();
    });

    t.test("parses empty string to 0", function(t) {
      t.equal(parse24Hours("").hours, 0);
    
      t.end();
    });

    t.test("{success: true, hours: int} if value is valid", function(t) {
      t.equal(parse24Hours("0").success, true);
      t.equal(parse24Hours("0").hours, 0);
      t.equal(parse24Hours("23").hours, 23);
    
      t.end();
    });

    t.test("{success: false} if hours is < 0", function(t) {
      t.equal(parse24Hours("-1").success, false);
    
      t.end();
    });

    t.test("{success: false} if hours >= 24", function(t) {
      t.equal(parse24Hours("24").success, false);
      t.equal(parse24Hours("60").success, false);
    
      t.end();
    });
  });

  t.test("parse60Minutes", function(t) {
    t.test("{success: true, minutes: int} if value is value", function(t) {
      t.equal(parse60Minutes("0").success, true);
      t.equal(parse60Minutes("0").minutes, 0);
      t.equal(parse60Minutes("59").minutes, 59);
  
      t.end();
    });

    t.test("{success: false} if minutes >= 60", function(t) {
      t.equal(parse60Minutes("60").success, false);
      t.equal(parse60Minutes("61").success, false);
    
      t.end();
    });
  });
});