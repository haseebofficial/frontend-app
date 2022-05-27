import test from "test/browser_tape";
import { getConfig } from "config";

test("config", function(t) {
  t.test("getConfig()", function(t) {
    t.test("returns keys", function(t) {
      t.true(getConfig("backendUrl"));

      t.end();
    });

    t.test("throws if key is not present in config", function(t) {
      t.throws(() => getConfig("foobar"), /config/);
    
      t.end();
    });
  });
});