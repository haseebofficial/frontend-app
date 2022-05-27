import React from "react";
import api from "api_routes";
import locales from "i18n/locales";
import { mockJSON } from "test/lib/improved_fetch/test_helpers";
import { InAppPage } from "test/lib/app/test_helpers";
import { render, fireEvent } from "test/support/react_renderer";
import { fillForm } from "test/support/form_helpers";
import { mockSpecializations } from "test/lib/specializations/test_helpers";
import { mockLanguages } from "test/lib/languages/test_helpers";
import { mockClientReviews } from "test/lib/client_reviews/test_helpers";
import RequestForm from "text_translations/new_text_translation/text_translation_form";

export function renderRequestForm(opts={}) {
  setupRequestForm(opts);
  return render(<InAppPage {...opts}><RequestForm/></InAppPage>);
}

export function setupRequestForm(opts={}) {
  let langs = opts.langs || [locales.default, locales.ru];
  mockLanguages(langs);
  mockSpecializations();
}

export function setupNewTextTranslationPage() {
  setupRequestForm();
  mockClientReviews();
}

export async function awaitRequestForm() {
  let form = renderRequestForm(...arguments);
  await fetch.awaitRequests();
  return form;
}

export function fillRequestForm(form, params={}) {
  let prefilledParams = {
    sourceLanguage: locales.default,
    targetLanguage: locales.ru,
    specialization: "general",
    wordCount: "800",
    dueDate: ""
  };

  let additionalFieldsParams = {
    clientName: "John Smith", 
    clientEmail:"johnsmith@mail.com", 
    clientPhone: "+1234567", 
    description: "I need a text translator"
  };

  let allInputValues = Object.assign({}, prefilledParams, additionalFieldsParams, params);
  fillForm(form, allInputValues);
  return allInputValues;
}

export async function submitRequestForm(form) {
  fireEvent.submit(form.getByTag("form"));
  await fetch.awaitRequests();
}

export function wasRequestFormSubmitted(form) {
  return !!form.queryByTestId("translation-created-box");
}

export function mockRequestSubmit(requestBody) {
  let request = { body: requestBody };
  let response = { text_translation_request: translationData() };
  mockJSON.post(api.textTranslationRequestsPath(), response, request);

  return translationData();
}

export function translationData() {
  return {
    id: 1,
    word_count: "800"
  };
}
