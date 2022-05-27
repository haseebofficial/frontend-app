import test from "test/browser_tape";
import React from "react";
import api from "api_routes";
import { mockJSON } from "test/lib/improved_fetch/test_helpers";
import { render } from 'test/support/react_renderer';
import { getCurrentUser } from "test/lib/login/test_helpers";
import { fillForm, submitForm } from "test/support/form_helpers";
import LoginForm from "login/login_form";
import { InAppPage } from "test/lib/app/test_helpers";

function renderForm(store) {
  return render(<InAppPage store={store}><LoginForm/></InAppPage>);
}

function mockSignIn({email, password, rememberMe}, {id}) {
  let expectedBody = { email, password, rememberMe };
  let response = {
    user: {name: "John", surname: "Smith", id, role: "interpreter"}, 
    rememberedUntil: new Date().toISOString
  };

  mockJSON.post(api.userSessionPath(), response, {body: expectedBody});
}

function mockInvalidCredentials() {
  mockJSON.post(api.userSessionPath(), { status: 401, body: {error: ""} });
}

async function submitLoginForm(form, values) {
  fillForm(form, values);
  submitForm(form);
  await fetch.awaitRequests();
}

test("App: Login form", function(t) {
  t.test("renders error on unsuccessfull sign in", async function(t) {
    let form = renderForm();
    mockInvalidCredentials();
    await submitLoginForm(form, {email: "foo@bar.com", password: "123"});

    t.true(form.queryByTestId("login-errors"));
  
    t.end();
  });

  t.test("signs user in and renders normal root form", async function(t, {store}) {
    let form = renderForm(store);
    let formData = {email: "foo@bar.com", password: "123", rememberMe: true};
    mockSignIn(formData, {id: 1});
    await submitLoginForm(form, formData);

    t.equal(getCurrentUser(store).id, 1);

    t.end();
  });

  t.test("does nothing if fields not filled", async function(t, {store}) {
    let form = renderForm(store);
    await submitLoginForm(form, {email: "", password: ""});

    t.false(getCurrentUser(store));
  
    t.end();
  });

  t.end();
});