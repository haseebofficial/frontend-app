import test from "test/browser_tape";
import objectToFormData from "improved_fetch/utils/object_to_form_data";

const NO_MOCK_ERROR = /No fallback response/;

test("fetch mock", function(t) {
  t.test(".mockOnce()", function(t) {
    t.test("mocks fetch once", async function(t) {
      fetch.mockOnce("foo.com", {});
      let result = await fetch("foo.com");

      t.equal(result.status, 200);
      t.same(await result.json(), {});

      t.end();
    });

    t.test("actually mocks once", async function(t) {
      fetch.mockOnce("foo.com", {});
      await fetch("foo.com");
      t.throws(() => fetch("foo.com"), NO_MOCK_ERROR);
    
      t.end();
    });
  });

  t.test(".mockOnce() with FormData", function(t) {
    t.test("works with matching formData", async function(t) {
      fetch.mockOnce("foo.com", {success: true}, {method: "POST", body: objectToFormData({a: 1})});
      let result = await fetch("foo.com", {method: "POST", body: objectToFormData({a: 1})}).then(r => r.json());
  
      t.same(result, {success: true});

      t.end();
    });

    t.test("throws if formData doesn't match", function(t) {
      fetch.mockOnce("foo.com", {success: true}, {method: "POST", body: objectToFormData({a: 1})});

      t.throws(() => {
        fetch("foo.com", {method: "POST", body: objectToFormData({a: 2})});
      }, NO_MOCK_ERROR);

      fetch.resetAllMocks();

      t.end();
    });

    t.test("throws if url doesn't match", function(t) {
      fetch.mockOnce("foos.com", {success: true}, {method: "POST", body: objectToFormData({a: 1})});

      t.throws(() => {
        fetch("foo.com", {method: "POST", body: objectToFormData({a: 1})});
      }, NO_MOCK_ERROR);

      fetch.resetAllMocks();

      t.end();
    });
  });

  t.test(".resetAllMocks()", function(t) {
    t.test("resets defined mocks", function(t) {
      fetch.mockOnce("fetch_mock3.com", 200);
      fetch.resetAllMocks();
      t.throws(() => fetch("fetch_mock3.com"), NO_MOCK_ERROR);
    
      t.end();
    });
  });

  t.test(".listUnusedMocks()", function(t) {
    t.test("returns [] if all mocks were used", async function(t) {
      fetch.mockOnce("fetch_mock4.com", 200);
      await fetch("fetch_mock4.com");

      t.same(fetch.listUnusedMocks(), []);
    
      t.end();
    });

    t.test("returns array of unused mocks", async function(t) {
      fetch.mockOnce("fetch_mock5.com", 200);
      fetch.mockOnce("fetch_mock6.com", 200);
      await fetch("fetch_mock5.com");

      let result = fetch.listUnusedMocks();

      t.equal(result.length, 1);
      t.true(result[0].match(/fetch_mock6/));
      fetch.resetAllMocks();
    
      t.end();
    });
  });

  t.test(".validateAndResetMocks()", function(t) {
    t.test("resets mocks", async function(t) {
      fetch.mockOnce("test.com", {});
      await fetch("test.com");
      fetch.validateAndResetMocks();
      fetch.mockOnce("test.com", {a: 1});
      let result = await fetch('test.com').then(r => r.json());

      t.same(result, {a: 1});
  
      t.end();
    });

    t.test("validates mocks", function(t) {
      fetch.mockOnce("fetch_mock.com", {});

      t.throws(() => fetch.validateAndResetMocks(), /unused/);
    
      t.end();
    });
  });

  t.test(".awaitRequests", function(t) {
    t.test("waits untill pending requests are finished", async function(t) {
      let isFinished = false;
      fetch.mockOnce("test.com", {});
      fetch("test.com").then(() => isFinished = true);
      await fetch.awaitRequests();

      t.equal(isFinished, true);
  
      t.end();
    });
  });
});