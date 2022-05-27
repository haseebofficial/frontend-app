import test from "test/browser_tape";
import { testTranslations } from "test/shared/translations";
import PaymentInformationLink from "credit_card/payment_information_link/link";

test("PaymentInformationLink", function(t) {
  t.test("translations", async function(t) {
    testTranslations(PaymentInformationLink, {}, {t, locales: ["en", "ru"]});
    
    t.end();
  });
  
  t.end();
});