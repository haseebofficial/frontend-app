import test from "tape";
import { React, toInstance,  findByTestId } from "test/shared/react";
import { stubI18n, testTranslations } from "test/shared/translations";
import { strict } from "test/shared/utils";
import createBluesnapStub from "./bluesnap_stub";
import Modal from "credit_card/modal/modal";

test("CreditCardModal state: {}", function(t) {
  let commands = strict({hide: 1});
  let instance = toInstance(<Modal isShown={true} state={{}} commands={commands} i18n={stubI18n()}/>);

  t.throws(() => findByTestId(instance, "card-info"), "doesn't render card info");
  t.throws(() => findByTestId(instance, "bluesnap-fields"), "doesn't render bluesnap fields");
  t.throws(() => findByTestId(instance, "error-info"), "doesn't render error");
  t.throws(() => findByTestId(instance, "loading-overlay"), "doesn't render loading overlay");

  t.end();
});

test("CreditCardModal state: {creditCard}", function(t) {
  t.test("required props", function(t) {
    let state = strict({creditCard: creditCard(), error: undefined, isLoading: undefined});
    let commands = strict({hide: 1, removeCard: 1});
    let instance = toInstance(<Modal isShown={true} state={state} commands={commands} i18n={stubI18n()}/>);

    t.doesNotThrow(() => findByTestId(instance, "card-info"), "renders card info");
    
    t.end();
  });

  t.test("translations", function(t) {
    let props = {isShown: true, state: {creditCard: {}}, commands: {}};
    testTranslations(Modal, props, {locales: ["en", "ru"], t});
    
    t.end();
  });

  t.end();
});

test("CreditCardModal state: {bluesnapToken}", function(t) {
  t.test("required props", function(t) {
    let state = strict({bluesnapToken: "123", creditCard: undefined, error: undefined, isLoading: undefined});
    let commands = strict({hide: 1, createCard: 1});
    
    let instance = toInstance(<Modal 
      isShown={true} state={state} commands={commands} bluesnap={createBluesnapStub()} i18n={stubI18n()}
    />);

    t.doesNotThrow(() => findByTestId(instance, "bluesnap-fields"), "renders bluensap fields");
    
    t.end();
  });

  t.end();
});

test("CreditCardModal state: {error}", function(t) {
  t.test("error: 'unable_to_save_card'", function(t) {
    let state = {error: 'unable_to_save_card'};
    let props = {isShown: true, state, commands: {}};

    testTranslations(Modal, props, {locales: ["en", "ru"], t});

    let instance = toInstance(<Modal {...props} i18n={stubI18n()}/>);
    t.doesNotThrow(() => findByTestId(instance, "error-info"), "renders error info");
    
    t.end();
  });

  t.test("error: 'unable_to_delete_card'", function(t) {
    let state = {error: 'unable_to_delete_card'};
    let props = {isShown: true, state, commands: {}};

    testTranslations(Modal, props, {locales: ["en", "ru"], t});
    
    t.end();
  });

  t.end();
});

test("CreditCardModal state: {isLoading: true}", function(t) {
  let state = {isLoading: true};
  let props = {isShown: true, state, commands: {}};

  let instance = toInstance(<Modal {...props} i18n={stubI18n()}/>);

  t.doesNotThrow(() => findByTestId(instance, "loading-overlay"), "renders loading overlay");
    
  t.end();
});

function creditCard() {
  return {
    "expiration_year": 2023,
    "card_last_four_digits": 9299,
    "card_type": "VISA",
    "expiration_month": "02"
  };
}