import test from "tape";
import { toInstance, findByTestId, React, stubEvent } from "test/shared/react";
import { buildSpyOnce } from "test/shared/mocks";
import { stubI18n, testTranslations } from "test/shared/translations";

import BluesnapFields from "credit_card/modal/bluesnap_fields";
import { BluesnapError } from "credit_card/modal/bluesnap_fields";

test("BluesnapFields", function(t) {
  t.test("basic usage", function(t) {
    let bluesnap = mockBluesnap();

    toInstance(<BluesnapFields token="123" bluesnap={bluesnap} createCard={() => {}} i18n={stubI18n()}/>);

    let [ token, options ] = bluesnap.hostedPaymentFieldsCreation.calledWith;
    t.equal(token, "123", "calls hostedPaymentFieldsCreation with token");

    let eventHandler = options.onFieldEventHandler;
    t.equal(typeof eventHandler.onBlur, "function", "sets onBlur function");
    t.equal(typeof eventHandler.onFocus, "function", "sets onFocus eventHandler function");
    t.equal(typeof eventHandler.onType, "function", "sets onType eventHandler function");
    
    t.end();
  });

  t.test("bluesnap eventHandler onError", function(t) {
    let bluesnap = mockBluesnap();
    let instance = toInstance(<BluesnapFields token="123" bluesnap={bluesnap} i18n={stubI18n()}/>);

    bluesnapFieldInvalid(bluesnap, "ccn");
    bluesnapFieldInvalid(bluesnap, "exp");
    bluesnapFieldInvalid(bluesnap, "cvv");

    t.doesNotThrow(() => findByTestId(instance, "error-message-ccn"), "renders ccn error messages");
    t.doesNotThrow(() => findByTestId(instance, "error-message-exp"), "renders exp error messages");
    t.doesNotThrow(() => findByTestId(instance, "error-message-cvv"), "renders cvv error messages");
     
    t.end();
  });

  t.test("bluesnap eventHandler onValid", function(t) {
    let bluesnap = mockBluesnap();
    let instance = toInstance(<BluesnapFields token="123" bluesnap={bluesnap} i18n={stubI18n()}/>);

    bluesnapFieldInvalid(bluesnap, "ccn");
    bluesnapFieldInvalid(bluesnap, "exp");
    bluesnapFieldValid(bluesnap, "ccn");

    t.throws(() => findByTestId(instance, "error-message-ccn"), "removes error messages from valid fields");
    t.doesNotThrow(() => findByTestId(instance, "error-message-exp"), "keeps error messages for invalid fields");
     
    t.end();
  });

  t.test("bluesnap submit: valid card", function(t) {
    let bluesnap = mockBluesnap();

    let createCard = buildSpyOnce();
    let instance = toInstance(
      <BluesnapFields token="123" bluesnap={bluesnap} createCard={createCard} i18n={stubI18n()}/>
    );

    let e = { preventDefault: buildSpyOnce() };
    findByTestId(instance, "bluesnap-form").props.onSubmit(e);
    t.equal(e.preventDefault.isCalled, true, "calls preventDefault on event");

    let [ callback ] = bluesnap.submitCredentials.calledWith;
    callback({});
    t.equal(createCard.isCalled, true, "calls createCard action");
     
    t.end();
  });

  t.test("bluesnap submit: invalid card", function(t) {
    let bluesnap = mockBluesnap();
    let createCard = buildSpyOnce();
    let instance = toInstance(
      <BluesnapFields token="123" bluesnap={bluesnap} createCard={createCard} i18n={stubI18n()}/>
    );

    findByTestId(instance, "bluesnap-form").props.onSubmit(stubEvent());

    let callback = bluesnap.submitCredentials.calledWith[0];
    callback({error: []});
    t.equal(createCard.isCalled, false, "doesn't call createCard action");
     
    t.end();
  });

  t.test("translations", function(t) {
    let props = {token: "123", bluesnap: stubBluesnap() };
    testTranslations(BluesnapFields, props, { t, locales: ["en", "ru"]});
    
    t.end();
  });
  
  t.end();
});

test("BluesnapError translations", function(t) {
  testError("001");
  testError("002");
  testError("003");
  testError("22013");
  testError("403");
  testError("404");
  testError("500");

  function testError(code) {
    t.test(`code: ${code}`, function(t) {
      let props = {tag: "a", code: code};

      testTranslations(BluesnapError, props, { t, locales: ["en", "ru"] });

      t.end();
    });
  }

  t.end();
});

function mockBluesnap() {
  return {
    hostedPaymentFieldsCreation: buildSpyOnce(),
    submitCredentials: buildSpyOnce()
  };
}

export default function stubBluesnap() {
  return {
    hostedPaymentFieldsCreation: () => {},
    submitCredentials: () => {}
  };
}

function bluesnapFieldInvalid(bluesnap, field) {
  let [, options] = bluesnap.hostedPaymentFieldsCreation.calledWith;
  let { onError } = options.onFieldEventHandler;

  onError(field, 1, "description");
}

function bluesnapFieldValid(bluesnap, field) {
  let [, options] = bluesnap.hostedPaymentFieldsCreation.calledWith;
  let { onValid } = options.onFieldEventHandler;

  onValid(field);
}