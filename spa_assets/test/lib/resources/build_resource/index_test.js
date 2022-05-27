import test from "tape";
import { failTestOnReject, failTestOnResolve } from "test/shared/promises";
import buildResource from "resources/build_resource";
import { local } from "resources/request_builder";

const Thing = buildResource({
  find: (id) => {
    return local.get(`/things/${id}`);
  },

  findWithoutId: () => {
    return local.get(`/thing`);
  }
});

test("LocalResource in test mode", function(t) {
  t.test("not mocked locations", function(t) {
    t.throws(() => Thing.find(1), /Resource not found/, "throws error");

    t.end();
  });

  t.test("mocked locations", async function(t) {
    Thing.find.mockOnce([1], {a: 123});
    t.throws(() => Thing.find(2), /Resource not found/, "throws error if args are different");

    let response = await Thing.find(1);
    t.same(response, {a: 123}, "resolves with expected response");
    t.throws(() => Thing.find(1), /Resource not found/, "actually mocks once");

    t.end();
  });

  t.test("response statuses", async function(t) {
    Thing.find.mockOnce([1], {a: 1}, {status: 404});

    let {error, body} = await Thing.find(1).then(failTestOnResolve(t), (r) => r);
    t.equal(error, 404, "rejects promise with status code");
    t.same(body, {a: 1}, "rejects promise with body");

    t.end();
  });

  t.test("mocking requests without args", async function(t) {
    Thing.findWithoutId.mockOnce({a: 1});

    let response = await Thing.findWithoutId();
    t.same(response, {a: 1}, "returns correct response");
    
    t.end();
  });

  t.test("response status without args", async function(t) {
    Thing.findWithoutId.mockOnce({a: 1}, {status: 404});

    let {error, body} = await Thing.findWithoutId().then(failTestOnResolve(t), (r) => r);
    
    t.equal(error, 404, "rejects promise with status code");
    t.same(body, {a: 1}, "rejects promise with body");
    
    t.end();
  });

  t.end();
});