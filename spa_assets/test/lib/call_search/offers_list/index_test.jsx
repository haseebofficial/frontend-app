import test from "tape";
import { toInstance, React, GlobalsStubProvider } from "test/shared/react";

import createStore from "store";

import { buildOffer } from "test/shared/data/call_search";

import OffersList from "call_search/offers_list";
import Offer from "call_search/offers_list/offer";

test("call_search/offers_list", function(t) {
  t.test("without matching search", function(t) {
    let instance = instanceWithStore({store: createStore(), searchId: 1});
    
    t.equal(instance.findAllByType(Offer).length, 0, "renders no Offer components");

    t.end();
  });

  t.test("with matching search", function(t) {
    let offer = buildOffer("offerId"); 
    let store = createStore({callSearches: { 1: {offers: [offer]} }});
    let instance = instanceWithStore({store, searchId: 1});

    let offers = instance.findAllByType(Offer);
    t.equal(offers.length, 1, "renders correct number of Offers");

    let offerProps = offers[0].props;

    t.equal(offerProps.offer, offer, "offer props include offer");
    t.notEqual(offerProps.i18n, undefined, "offer props include i18n");
    t.notEqual(offerProps.createCall, undefined, "offer props include createCall");
    
    t.end();
  });
  
  t.end();
});

function instanceWithStore({store, searchId}) {
  return toInstance(
    <GlobalsStubProvider store={store}>
      <OffersList searchId={searchId}/>
    </GlobalsStubProvider>
  );
}