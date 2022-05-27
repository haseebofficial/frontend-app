import test from "tape";
import { toInstance, withI18nStub, toStr } from "test/shared/react";
import { buildSpyOnce } from "test/shared/mocks";

import Offer from "call_search/offers_list/offer";
import { testTranslations } from "test/shared/translations";

test("call_search/offers_list/offer", function(t) {
  t.test("data rendering", function(t) {
    let offer = { 
      photo_url: "photo.url.com", name: "Some Name", score: 3.1, client_reviews_count: 0
    };

    let element = withI18nStub(Offer, {offer: offer});
    let instance = toInstance(element);
    let str = toStr(element);

    t.equal(instance.findByProps({testid: "offer-photo"}).props.src, offer.photo_url, "sets image: src to offer photo");
    t.true(/Some Name/.test(str), "renders name");

    t.end();
  });

  t.test("without client reviews", function(t) {
    let offer = { client_reviews_count: 0 };
    let instance = toInstance(withI18nStub(Offer, {offer: offer}));

    t.equal(instance.findAllByProps({testid: "client-reviews-count"}).length, 0, "doesnt render client reviews");

    t.end();
  });

  t.test("with client reviews", function(t) {
    let offer = { client_reviews_count: 1 };
    let instance = toInstance(withI18nStub(Offer, {offer: offer}));

    t.equal(instance.findAllByProps({testid: "client-reviews-count"}).length, 1, "renders client reviews");

    t.end();
  });

  t.test("createCall command", function(t) {
    let spy = buildSpyOnce();
    let instance = toInstance(withI18nStub(Offer, {offer: {}, createCall: spy}));

    instance.findByProps({testid: "create-call"}).props.onClick();

    t.equal(spy.isCalled, true, "calls provided function");
    
    t.end();
  });

  t.test("i18n", function(t) {
    let offer = {price_minute: 1, currency_code: "USD"};
    testTranslations(Offer, {offer}, {locales: ["en", "ru"], t});

    t.end();
  });

  
  t.end();
});