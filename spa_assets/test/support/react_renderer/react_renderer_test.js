import test from "test/browser_tape";
import React from "react";
import { render, act, within, fireEvent } from "test/support/react_renderer";

test("react_renderer", function(t) {
  t.test("exports everything from testing-library/react", function(t) {
    t.equal(typeof act, "function");
    t.equal(typeof fireEvent, "function");

    t.end();
  });

  t.test("render", function(t) {
    t.test("behaves like testing-library/react's render", function(t) {
      let div = render(<div testid="foo"/>);

      t.true(div.getByTestId("foo"));
      t.false(div.queryByTestId("bar"));
  
      t.end();
    });

    t.test("adds *byTag queries", function(t) {
      let form = render(<form></form>);

      t.true(form.getByTag("form"));
      t.false(form.queryByTag("input"));
    
      t.end();
    });

    t.test("adds *byName queries", function(t) {
      let input = render(<input name="surname"></input>);

      t.true(input.getByName("surname"));
      t.false(input.queryByName("email"));
    
      t.end();
    });
  });

  t.test("within", function(t) {
    t.test("adds custom queries wrapper", function(t) {
      let form = render(<form><input name="surname"></input></form>);
      let input = within(form.getByTag("form")).queryByName("surname");

      t.true(input);
  
      t.end();
    });
  });
});