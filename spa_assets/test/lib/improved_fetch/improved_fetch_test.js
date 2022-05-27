import test from "test/browser_tape";
import { fetchJSON, buildFetchJSON, postFormData } from "improved_fetch";
import objectToFormData from "improved_fetch/utils/object_to_form_data";

let globalFetch = global.fetch;

test("improved_fetch", function(t) {
  t.test("buildFetchJSON", function(t) {
    t.test("rejects on non-200", async function(t) {
      globalFetch.mockOnce("test.com", {body: {error: 1}, status: 401});
      let myFetch = buildFetchJSON();
      let result = await myFetch("test.com").catch(r => r.json());

      t.same(result, {error: 1});
  
      t.end();
    });
    
    t.test("decodes response json", async function(t) {
      globalFetch.mockOnce("test.com", {success: true});
      let myFetch = buildFetchJSON();
      let result = await myFetch("test.com");

      t.same(result, {success: true});
    
      t.end();
    });

    t.test("stringifies request body", async function(t) {
      globalFetch.mockOnce("test.com", {success: true}, {body: {a: 1}, method: "POST"});
      let myFetch = buildFetchJSON();
      let result = await myFetch("test.com", {method: "POST", body: {a: 1}});

      t.same(result, {success: true});
    
      t.end();
    });

    t.test("adds Content-Type header", async function(t) {
      globalFetch.mockOnce("test.com", {success: true}, {headers: {"Content-Type": "application/json"}});
      let myFetch = buildFetchJSON();
      let result = await myFetch("test.com");

      t.same(result, {success: true});
    
      t.end();
    });

    t.test("transforms request body keys to underscore_notation", async function(t) {
      globalFetch.mockOnce("test.com", {success: true}, {body: {foo_bar: 1}, method: "POST"});
      let myFetch = buildFetchJSON();
      let result = await myFetch("test.com", {method: "POST", body: {fooBar: 1}});

      t.same(result, {success: true});
    
      t.end();
    });

    t.test("transforms response body keys to camelCase notation", async function(t) {
      globalFetch.mockOnce("test.com", {is_success: true});
      let myFetch = buildFetchJSON();
      let result = await myFetch("test.com");

      t.same(result, {isSuccess: true});
    
      t.end();
    });

    t.test("camelizeResponseKeys: false", async function(t) {
      globalFetch.mockOnce("test.com", {is_success: true});
      let myFetch = buildFetchJSON({camelizeResponseKeys: false});
      let result = await myFetch("test.com");

      t.same(result, {is_success: true});
    
      t.end();
    });
  });

  t.test("fetchJSON", function(t) {
    t.test("behaves like buildFetchJSON() builder result", async function(t) {
      globalFetch.mockOnce("test.com", {is_success: true});
      let result = await fetchJSON("test.com");

      t.same(result, {isSuccess: true});

      t.end();
    });

    t.test("provides shortcuts for different HTTP methods", async function(t) {
      globalFetch.mockOnce("test.com", {success: true}, {method: "POST"});
      let result = await fetchJSON.post("test.com");

      t.same(result, {success: true});
    
      t.end();
    });
  });

  t.test("postFormData", function(t) {
    t.test("converts request body to FormData", async function(t) {
      globalFetch.mockOnce("test.com", 
        { success: true }, 
        { method: "POST", 
          body: objectToFormData({test: true}), 
          headers: { "Content-Type": undefined }
        }
      );
      let result = await postFormData("test.com", {body: {test: true}});

      t.same(result, {success: true});
  
      t.end();
    });

    t.test("behaves like buildFetchJSON()", async function(t) {
      globalFetch.mockOnce("test.com", 
        { is_success: true }, 
        { method: "POST", 
          body: objectToFormData({is_test: true})
        }
      );
      let result = await postFormData("test.com", {body: {isTest: true}});

      t.same(result, {isSuccess: true});
  
      t.end();
    });
  });
});