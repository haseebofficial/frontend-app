import test from "test/browser_tape";
import objectToFormData from "improved_fetch/utils/object_to_form_data";

test("improved_fetch utils", function(t) {
  t.test("objectToFormData", function(t) {
    t.test("converts object to form data", function(t) {
      t.true(objectToFormData({}) instanceof FormData);

      t.end();
    });

    t.test("adds object's entries to form data", function(t) {
      t.equal(objectToFormData({foo: "bar"}).get("foo"), "bar");
    
      t.end();
    });
  });
});