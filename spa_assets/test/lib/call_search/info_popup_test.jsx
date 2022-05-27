import test from "tape";
import { toInstance, withI18nStub } from "test/shared/react";
import { testHidesModal, behavesLikeShownModal } from "test/shared/components";

import InfoPopup from "call_search/info_popup";
import { testTranslations } from "test/shared/translations";

test("call_search/info_popup", function(t) {
  t.test("display: false", function(t) {
    let instance = toInstance( withI18nStub(InfoPopup, {display: false}) );
    testHidesModal(t, instance);
    
    t.end();
  });

  t.test("display: true", function(t) {
    let instance = toInstance( withI18nStub(InfoPopup, {display: true}) );
    behavesLikeShownModal(t, instance);

    t.end();
  });

  t.test("i18n", function(t) {
    testTranslations(InfoPopup, {display: true}, {locales: ["en", "ru"], t});

    t.end();
  });

  t.end();
});