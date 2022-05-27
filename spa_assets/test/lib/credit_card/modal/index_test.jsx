import test from "test/browser_tape";
import { findByTestId, stubEvent } from "test/shared/react";
import { buildSpyOnce } from "test/shared/mocks";
import { finishAsyncActions } from "test/shared/promises";
import buildStore from "store";
import { testHidesModal } from "test/shared/components";

import { modalInstance, testShowsModal } from "./shared";

import CreditCard from "resources/credit_card";
import BluesnapToken from "resources/bluesnap_token";

import { show } from "credit_card/reducer/actions";

test("CreditCardModal index", function(t) {
  t.test("by default", function(t) {
    let store = buildStore();
    let instance = modalInstance({store});
    
    testHidesModal(t, instance);

    t.end();
  });

  t.test("with existing credit card", async function(t) {
    CreditCard.find.mockOnce({credit_card: {}});
    let instance = await showModal();

    t.doesNotThrow(() => findByTestId(instance, "card-info"), "renders card-info");
    testShowsModal(t, instance);

    t.end();
  });

  t.test("with non-existing credit card", async function(t) {
    let instance = await setupBluesnapModal("123");

    t.doesNotThrow(() => findByTestId(instance, "bluesnap-fields"), "renders bluesnap-fields");

    t.end();
  });

  t.test("removing credit card", async function(t) {
    CreditCard.find.mockOnce({credit_card: {}});
    let instance = await showModal();

    window.confirm = buildSpyOnce(true);
    CreditCard.remove.mockOnce({});
    BluesnapToken.create.mockOnce({token: "123"});

    await clickAsync(instance, "remove-credit-card");

    t.equal(window.confirm.isCalled, true, "asks removal confirmation");
    t.doesNotThrow(() => findByTestId(instance, "bluesnap-fields"), "renders bluesnap-fields after removal");
    t.throws(() => findByTestId(instance, "card-info"), "removes card info");

    t.end();
  });

  t.test("removing credit card with 400 server response", async function(t) {
    CreditCard.find.mockOnce({credit_card: {}});
    let instance = await showModal();

    window.confirm = () => true;
    CreditCard.remove.mockOnce({}, {status: 400});

    await clickAsync(instance, "remove-credit-card");

    t.doesNotThrow(() => findByTestId(instance, "error-info"), "shows error");
    t.doesNotThrow(() => findByTestId(instance, "card-info"), "doesn't remove card info");

    t.end();
  });

  t.test("credit card creation", async function(t) {
    let instance = await setupBluesnapModal("bluesnap_token");

    CreditCard.create.mockOnce(["bluesnap_token"], {credit_card: {}});

    window.bluesnap.submitCredentials = bluesnapValidCredentials;
    await testShowsOverlayOnBluesnapFormSubmit(t, instance);

    t.doesNotThrow(() => findByTestId(instance, "card-info"), "saves card and renders card info");
    
    t.end();
  });

  t.test("credit card creation when card is not valid", async function(t) {
    let instance = await setupBluesnapModal("bluesnap_token");

    CreditCard.create.mockOnce(["bluesnap_token"], {}, {status: 400});

    window.bluesnap.submitCredentials = bluesnapValidCredentials;
    await testShowsOverlayOnBluesnapFormSubmit(t, instance);

    t.doesNotThrow(() => findByTestId(instance, "error-info"), "shows error");
    
    t.end();
  });

  t.end();
});

function showModal() {
  let store = buildStore();
  store.dispatch(show());

  let instance = modalInstance({store});

  return finishAsyncActions().then(() => instance);
}

function clickAsync(instance, id) {
  findByTestId(instance, id).props.onClick(stubEvent());

  return finishAsyncActions();
}

function setupBluesnapModal(token) {
  CreditCard.find.mockOnce({}, {status: 404});
  BluesnapToken.create.mockOnce({token});

  return showModal();
}

function bluesnapValidCredentials(callback) {
  return callback({error: undefined, cardData: {}});
}

async function testShowsOverlayOnBluesnapFormSubmit(t, instance) {
  let form = findByTestId(instance, "bluesnap-form");

  form.props.onSubmit(stubEvent());

  t.doesNotThrow(() => findByTestId(instance, "loading-overlay"), "adds loading overlay while loading");
  await finishAsyncActions();
  t.throws(() => findByTestId(instance, "loading-overlay"), "removes loading overlay after data is loaded");
}