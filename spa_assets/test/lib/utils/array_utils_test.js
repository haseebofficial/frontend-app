import test from "tape";
import * as arrayUtils from "utils/array_utils";

test("arrayUtils: toObject", function(t) {
  t.test("creates object", function(t) {
    let result = arrayUtils.toObject([1, 2], item => [item+1, "test"]);

    t.same(result, {2: "test", 3: "test"});
  
    t.end();
  });

  t.end();
});