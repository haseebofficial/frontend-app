import test from "test/browser_tape";
import { mockJSON, mockFormData } from "test/lib/improved_fetch/test_helpers";
import { fetchJSON, postFormData } from "improved_fetch";

test("improved_fetch/test_helpers", function(t) {
  t.test("mockJSON", function(t) {
    t.test("mocks request", async function(t) {
      mockJSON("test.com", {a: 1});
      let result = await fetchJSON("test.com");

      t.same(result, {a: 1});
    
      t.end();
    });

    t.test("provides shortcuts for HTTP methods", async function(t) {
      mockJSON("test.com", {a: 1});
      let result = await fetchJSON.post("test.com");

      t.same(result, {a: 1});
    
      t.end();
    });

    t.test("converts response keys to snake_case", async function(t) {
      mockJSON("test.com", {testMe: 1});
      let result = await fetch("test.com").then(r => r.json());

      t.same(result, {test_me: 1});
    
      t.end();
    });

    t.test("converts expected body keys to snake_case", async function(t) {
      mockJSON.post("test.com", {a: 1}, { body: {testMe: 1} });
      let result = await fetchJSON.post("test.com", { body: {testMe: 1} });

      t.same(result, {a: 1});
    
      t.end();
    });
  });

  t.test("mockFormData", function(t) {
    t.test("mocks request with formdata", async function(t) {
      mockFormData("test.com", {is_success: true}, {body: {foo_bar: "bar"}});
      let result = await postFormData("test.com", {body: {fooBar: "bar"}});

      t.same(result, {isSuccess: true});
  
      t.end();
    });
  });
});