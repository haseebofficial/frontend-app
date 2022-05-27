import test from "test/browser_tape";
import { React, toInstance, Globals, findByTestId } from "test/shared/react";
import { finishAsyncActions } from "test/shared/promises";
import buildStore from "store";
import { testShowsModal } from "test/shared/components";

import CreditCard from "resources/credit_card";

import Modal from "credit_card/modal";
import PaymentInformationLink from "credit_card/payment_information_link";

test("PaymentInformationLink", function(t) {
  t.test("shows modal on click", async function(t) {
    CreditCard.find.mockOnce({credit_card: {}});

    let store = buildStore();
    let link = toInstance(<Globals store={store}><PaymentInformationLink/></Globals>);
    let modal = toInstance(<Globals store={store}><Modal/></Globals>);

    findByTestId(link, "show-credit-card").props.onClick();
    await finishAsyncActions();
    testShowsModal(t, modal);
    
    t.end();
  });
  
  t.end();
});