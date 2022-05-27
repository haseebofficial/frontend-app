import "regenerator-runtime/runtime";

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import initStore from "store";

import WsClient from "ws_client";
import Twilio from "twilio";
import Fetcher from "fetcher";
import { GlobalsProvider as GlobalsProviderOutdated } from 'utils/globals_context';
import { GlobalsProvider } from "react_utils/globals";

import Notifications from "notifications";

import { fetchOffers } from "call_search/fetch_remote";
import OffersList from 'call_search/offers_list';

import CreditCardModal from "credit_card/modal";
import PaymentInformationLink from "credit_card/payment_information_link";

import InterpretationCall from "interpretation_call";
import { interpretationCall as interpretationCallUrls } from "urls/api";

import CallInfoPopup from "call_search/info_popup";
import CallSearchForm from "call_search/form";
import { setCurrentSearch } from "call_search/reducer/actions";

import CallSearch from "resources/call_search";
import SupportCall from "support_call";
import SupportCallModal from "support_call/support_call_modal";

import i18n from "i18n";

const store = initStore();
const fetcher = new Fetcher();
const twilio = new Twilio(store);
const wsClient = new WsClient(store);

var globals;

document.addEventListener('page:change', function() {
  renderLegacyParts();
});

async function renderLegacyParts() {
  globals = {fetcher, i18n, window};
  await renderCallAndInitWsClient();
  
  renderOffers();
  renderClientBalance();
  renderSearchInfoPopup();
  renderSupportCall();
}

function renderOffers() {
  let offersContainer = document.getElementById("call-search-offers-container");

  if (offersContainer) {
    let searchId = offersContainer.dataset.searchId;
    
    render(
      <GlobalsProviderOutdated value={globals}>
        <Provider store={store}>
          <OffersList searchId={searchId}/>
        </Provider>
      </GlobalsProviderOutdated>, offersContainer
    );

    CallSearch.find(searchId).then(s => {
      store.dispatch(setCurrentSearch(s.call_search));
    });
    fetchOffers({searchId, fetcher, dispatch: store.dispatch});
  }

  let searchContainer = document.getElementById("call-search-form");

  if (searchContainer) {
    render(
      <GlobalsProviderOutdated value={globals}>
        <Provider store={store}>
          <CallSearchForm/>
        </Provider>
      </GlobalsProviderOutdated>, searchContainer
    );
  }

}

async function renderCallAndInitWsClient() {
  let callContainer = document.getElementById("interpretation-call-container");
  if (callContainer) {
    store.dispatch({type: "TWILIO_RESET_CALL"});

    fetcher.fetchApi(interpretationCallUrls.showUrl(callContainer.dataset.callId))
      .then(({json}) => store.dispatch({type: "TWILIO_UPDATE_CURRENT_CALL", call: json.interpretation_call}));

    render(
      <GlobalsProviderOutdated value={globals}>
        <Provider store={store}>
          <InterpretationCall />
        </Provider>
      </GlobalsProviderOutdated>, callContainer
    );

    renderNotifications();

    let setupResult = await wsClient.setup();

    if (setupResult) {
      twilio.setup();
    }
  } else {
    await wsClient.setup();

    store.dispatch({type: "TWILIO_RESET_CALL"});
  }
}

function renderNotifications() {
  let notificationsContainer = document.getElementById("react-notifications-container");

  if (notificationsContainer) {
    render(
      <GlobalsProvider store={store} {...globals}>
        <Notifications/>
      </GlobalsProvider>, notificationsContainer
    );
  }
}

function renderClientBalance() {
  let balanceContainer = document.getElementById("client-balance-container");

  if (balanceContainer) {
    render(
      <GlobalsProviderOutdated value={globals}>
        <Provider store={store}>
          <PaymentInformationLink />
        </Provider>
      </GlobalsProviderOutdated>, balanceContainer
    );
  }
  let popupContainer = document.getElementById("client-balance-popup");
  
  if (popupContainer) { 
    render(
      <GlobalsProviderOutdated value={globals}>
        <Provider store={store}>
          <CreditCardModal />
        </Provider>
      </GlobalsProviderOutdated>, popupContainer
    );
  }
}

function renderSearchInfoPopup() {
  let popupContainer = document.getElementById("call-info-popup");
  
  if (popupContainer) { 
    render(
      <CallInfoPopup i18n={globals.i18n} />, popupContainer
    );
  }
}

function renderSupportCall() {
  let container = document.getElementById("new-support-call-container");

  if (container) {
    twilio.setup();
    store.dispatch({type: "TWILIO_RESET_CALL"});

    render(
      <GlobalsProvider store={store} {...globals}>
        <SupportCall/>
      </GlobalsProvider>, container
    );

    render(
      <GlobalsProvider store={store} {...globals}>
        <SupportCallModal/>
      </GlobalsProvider>, document.getElementById("support-call-modal-container")
    );
  }
}