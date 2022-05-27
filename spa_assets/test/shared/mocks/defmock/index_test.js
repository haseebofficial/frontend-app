import test from "tape";
import { defmock } from "test/shared/mocks";

function fooMock() {
  class Test { foo() {} }
  return defmock(Test);
}

test("defmock", function(t) {
  t.test("returns class with correct name", function(t) {
    class Test {}
    let Mock = defmock(Test);

    t.equal(Mock.name, "TestMock");
  
    t.end();
  });

  t.test("defines original class' methods", function(t) {
    let Mock = fooMock();
    let mock = new Mock();

    t.equal(typeof mock.foo, 'function');
  
    t.end();
  });

  t.test("ignores _methods", function(t) {
    class Test { _foo() {} }
    let Mock = defmock(Test);
    let mock = new Mock();

    t.equal(mock._foo, undefined);
  
    t.end();
  });

  t.test("mock's default implementation throws error", function(t) {
    let Mock = fooMock();
    let mock = new Mock();

    t.throws(() => mock.foo(), /No expectation/);
  
    t.end();
  });

  t.end();
});

test("defmock Mock.expects", function(t) {
  t.test(`replaces next instance's method implementation`, function(t) {
    let Mock = fooMock();
    Mock.expects("foo");

    let mock = new Mock();

    t.doesNotThrow(() => mock.foo());
  
    t.end();
  });

  t.test(`mocks for only one instance`, function(t) {
    let Mock = fooMock();
    Mock.expects("foo");

    new Mock();
    let mock = new Mock();

    t.throws(() => mock.foo(), /No expectation/);
  
    t.end();
  });

  t.test("doesn't allow overwriting expectations", function(t) {
    let Mock = fooMock();
    Mock.expects("foo");

    t.throws(() => Mock.expects("foo"), /already defined/);
  
    t.end();
  });

  t.test("doesn't allow methods that were not in original class", function(t) {
    let Mock = fooMock();

    t.throws(() => Mock.expects("foobar"), /no such method/);
  
    t.end();
  });

  t.test("returns sinon expectation", function(t) {
    let Mock = fooMock();
    let expectation = Mock.expects("foo");

    t.notEqual(expectation, undefined);
  
    t.end();
  });

  t.test("binds methods", function(t) {
    let Mock = fooMock();
    Mock.expects("foo");
    let mock = new Mock();

    t.doesNotThrow(mock.foo);
  
    t.end();
  });

  t.test("expectation returns value", function(t) {
    let Mock = fooMock();
    Mock.expects("foo").returns(321);

    let mock = new Mock();

    t.equal(mock.foo(), 321);
  
    t.end();
  });

  t.test("calls expectation with provided args", function(t) {
    let Mock = fooMock();

    Mock.expects("foo").withExactArgs(1);
    let mock = new Mock();

    t.throws(() => mock.foo(2), /wrong arguments/);
  
    t.end();
  });

  t.end();
});

test("defmock Mock#expects", function(t) {
  t.test("behaves like Mock.expects", function(t) {  
    let Mock = fooMock();
    let mock = new Mock();

    mock.expects("foo");

    t.doesNotThrow(() => mock.foo());
  
    t.end();
  });

  t.end();
});

test("defmock Mock.verifyAll", function(t) {
  t.test("passes without expectations", function(t) {
    let Mock = fooMock();

    t.doesNotThrow(() => Mock.verifyAll());
  
    t.end();
  });

  t.test("throws with unmet expectations", function(t) {
    let Mock = fooMock();
    Mock.expects("foo");

    new Mock();

    t.throws(() => Mock.verifyAll(), /ExpectationError/);
  
    t.end();
  });

  t.test("passes with met expectations", function(t) {
    let Mock = fooMock();
    Mock.expects("foo");

    new Mock().foo();

    t.doesNotThrow(() => Mock.verifyAll(), /ExpectationError/);
  
    t.end();
  });

  t.test("resets expectations on class", function(t) {
    let Mock = fooMock();
    Mock.expects("foo");

    t.throws(() => Mock.verifyAll());
    t.doesNotThrow(() => Mock.verifyAll());
  
    t.end();
  });

  t.test("resets expectations on created isntances", function(t) {
    let Mock = fooMock();
    Mock.expects("foo");

    new Mock();

    t.throws(() => Mock.verifyAll());
    t.doesNotThrow(() => Mock.verifyAll());
  
    t.end();
  });

  t.end();
});

test("defmock Mock.resetExpectation", function(t) {
  t.test("throws if no expectaions are defined", function(t) {
    let Mock = fooMock();

    t.throws(() => Mock.resetExpectation("foo"), /Cannot reset/);
  
    t.end();
  });

  t.test("resets method expectations", function(t) {
    let Mock = fooMock();

    Mock.expects("foo");
    Mock.resetExpectation("foo");

    let mock = new Mock();
    t.throws(() => mock.foo(), /No expectation/);
  
    t.end();
  });

  t.end();
});

test("defmock Mock#resetExpectation", function(t) {
  t.test("behaves like Mock.resetExpectation", function(t) {  
    let Mock = fooMock();
    Mock.expects("foo");

    let mock = new Mock();
    mock.resetExpectation("foo");

    t.throws(() => mock.foo(), /No expectation/);
  
    t.end();
  });

  t.end();
});