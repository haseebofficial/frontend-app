import test from "test/browser_tape";
import React from "react";
import { render } from "test/support/react_renderer";
import { changeInput, fillForm, inputValue, getInput, submitForm } from "test/support/form_helpers";

test("form_helpers", function(t) {
  t.test("getInput", function(t) {
    t.test("returns input element", function(t) {
      let form = render(<input name="email" defaultValue="foo"/>);
      t.equal(getInput(form, "email").value, "foo");
  
      t.end();
    });
  });

  t.test("inputValue", function(t) {
    t.test("returns input's value", function(t) {
      let form = render(<input name="email" defaultValue="foo"/>);
      t.equal(inputValue(form, "email"), "foo");
  
      t.end();
    });

    t.test("returns checkbox's value", function(t) {
      let form = render(<input name="ok" type="checkbox" defaultChecked={true}/>);

      t.equal(inputValue(form, "ok"), true);
    
      t.end();
    });
  });

  t.test("changeInput", function(t) {
    t.test("changes input's value", function(t) {
      let form = render(<input name="email"/>);
      let email = "foo@bar.com";
      changeInput(form, "email", email);

      t.equal(inputValue(form, "email"), email);

      t.end();
    });

    t.test("changes checkbox's value", function(t) {
      let form = render(<input type="checkbox" name="agreement"/>);
      changeInput(form, "agreement", true);

      t.equal(inputValue(form, "agreement"), true);

      t.end();
    });
  });

  t.test("fillForm", function(t) {
    t.test("changes all input's values", function(t) {
      let form = render(<form><input name="name"/><input name="surname"/></form>);
      fillForm(form, {name: "foo", surname: "bar"});

      t.equal(inputValue(form, "name"), "foo");
      t.equal(inputValue(form, "surname"), "bar");
  
      t.end();
    });
  });

  t.test("submitForm", function(t) {
    t.test("submits form", function(t) {
      let isSubmitted = false;
      let form = render(<form onSubmit={() => isSubmitted = true}/>);
      submitForm(form);
      t.equal(isSubmitted, true);
  
      t.end();
    });
  });
});