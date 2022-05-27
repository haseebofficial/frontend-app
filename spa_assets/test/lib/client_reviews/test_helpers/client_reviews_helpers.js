import api from "api_routes";
import { mockJSON } from "test/lib/improved_fetch/test_helpers";

export function mockClientReviews(reviews=[]) {
  let clientReviews = reviews.map(buildReview);
  mockJSON(api.clientReviewsPath(), {client_reviews: clientReviews});
}

export function buildReview(reviewAttrs) {
  return addDefaults(reviewAttrs);
}

function addDefaults(reviewAttrs) {
  return Object.assign({}, {client_name: "Smith", comment: "Good job!", locale: "en", score: 5}, reviewAttrs);
}
