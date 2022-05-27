import test from "test/browser_tape";
import { React, toInstance, Globals, findByTestId } from "test/shared/react";
import buildStore from "store";
import { testHidesModal, behavesLikeShownModal } from "test/shared/components";
import { testTranslations } from "test/shared/translations";

import { showPaymentPopup } from "client_balance_payment/reducer/actions";
import ClientBalancePayment from "resources/client_balance_payment";
import Popup from "client_balance_payment/popup";

test("BalancePaymentPopup", function(t) {
  t.test("by default", function(t) {
    let store = buildStore();
    let instance = createInstance({store});
    
    testHidesModal(t, instance);

    t.end();
  });

  t.test("after showPaymentPopup action", function(t) {
    let store = buildStore();
    store.dispatch(showPaymentPopup());

    let instance = createInstance({store});

    t.throws(() => findByTestId(instance, "no-funds-message"), "doesn't display no-funds message");
    behavesLikeShownModal(t, instance);

    t.end();
  });

  t.test("afer showPaymentPopup({showNotEnoughFunds}) action", function(t) {
    let store = buildStore();
    store.dispatch(showPaymentPopup({showNotEnoughFunds: true}));

    let instance = createInstance({store});

    t.doesNotThrow(() => findByTestId(instance, "no-funds-message"), "displays no-funds message");

    t.end();
  });

  // t.test("on submit button click with default amount", async function(t) {
  //   let store = buildStore();
  //   store.dispatch(showPaymentPopup());

  //   ClientBalancePayment.create.mockOnce([10], {paypal_urls: {checkout_url: "123"}});
    
  //   let instance = createInstance({store});
  //   await findByTestId(instance, "topup-submit").props.onClick();

  //   t.equal(window.location.href, "123", "redirects user to checkout_url");

  //   t.end();
  // });

  // t.test("amount selection", async function(t) {
  //   let store = buildStore();
  //   store.dispatch(showPaymentPopup());
  //   ClientBalancePayment.create.mockOnce([25], {paypal_urls: {checkout_url: "321"}});
    
  //   let instance = createInstance({store});

  //   findByTestId(instance, "topup-item-25").props.onClick();
  //   await findByTestId(instance, "topup-submit").props.onClick();

  //   t.equal(window.location.href, "321", "redirects user to checkout_url");

  //   t.end();
  // });

  t.test("i18n", function(t) {
    let store = buildStore();
    store.dispatch(showPaymentPopup());

    testTranslations(PopupWithGlobals, {store}, {locales: ["en", "ru"], t});

    t.end();
  });

  t.end();
});

function createInstance(props) {
  return toInstance(<PopupWithGlobals {...props}/>);
}

function PopupWithGlobals(props) {
  return (
    <Globals {...props}>
      <Popup/>
    </Globals>
  );
}