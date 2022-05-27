import locales from "i18n/locales";
import { mockLanguages } from "test/lib/languages/test_helpers";
import { mockClientReviews } from "test/lib/client_reviews/test_helpers";

export function setupRootPage() {
  mockClientReviews();
}