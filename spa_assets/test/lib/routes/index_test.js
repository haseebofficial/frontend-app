import test from "tape";
import * as routes from "routes";

test("routes", function(t) {
  testPathWithId(t, routes.interpretationCallPath, "/interpretation_calls/:id");
  testPath(t, routes.interpretationCallsPath, "/interpretation_calls");

  testPathWithId(t, routes.interpretationCallExternalNumberPath, "/interpretation_calls/:id/external_number");

  testPathWithId(t, routes.callSearchAvailableInterpretersPath, "/call_searches/:id/available_interpreters");

  testPath(t, routes.clientBalancePaymentsPath, "/client_balance_payments");
  testPath(t, routes.clientBalancePath, "/client_balance");

  t.end();
});

test("routes.local", function(t) {
  let local = routes.local;
  testPathWithId(t, local.interpretationCallPath, "/interpretation_calls/:id");

  t.end();
});

function testPath(t, createPath, expectedPath) {
  t.equal(createPath(), expectedPath, `routes.${createPath.name} returns ${expectedPath}`);
}

function testPathWithId(t, createPath, expectedPath) {
  let result = createPath(123);

  t.equal(result, expectedPath.replace(":id", 123), `routes.${createPath.name} returns ${expectedPath} with correct id`);
}