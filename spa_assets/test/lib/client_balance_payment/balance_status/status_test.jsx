import test from "tape";
import { toInstance, findByTestId, withI18nStub } from "test/shared/react";
import { buildSpyOnce } from "test/shared/mocks";

import BalanceStatus from "client_balance_payment/balance_status/status";
import { testTranslations } from "test/shared/translations";

test("client_balance_payment/balance_status/status", function(t) {
  t.test("on refresh-amount click", function(t) {
    let refreshBalanceAmount = buildSpyOnce();
    let instance = toInstance(withI18nStub(BalanceStatus, {amount: 0, refreshBalanceAmount}));

    findByTestId(instance, "refresh-amount").props.onClick();

    t.true(refreshBalanceAmount.isCalled, "calls refreshBalanceAmount function");

    t.end();
  });

  t.test("on top-up-link click", function(t) {
    let startBalancePayment = buildSpyOnce();
    let result = toInstance(withI18nStub(BalanceStatus, {amount: 0, startBalancePayment}));

    findByTestId(result, "top-up-link").props.onClick();

    t.true(startBalancePayment.isCalled, "calls startBalancePayment function");
    
    t.end();
  });

  t.test("i18n", function(t) {
    testTranslations(BalanceStatus, {amount: 5}, {locales: ["en", "ru"], t});

    t.end();
  });

  t.end();
});