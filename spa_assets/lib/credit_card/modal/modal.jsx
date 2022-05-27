import React from "react";
import Modal from "components/modal";
import BluesnapFields from "./bluesnap_fields";

export default function CreditCardModal({state, isShown, commands, bluesnap, i18n}) {
  let body = null;
  if (state.creditCard) {
    body = <CardInfo card={state.creditCard} removeCard={commands.removeCard} i18n={i18n}/>;
  } else if (state.bluesnapToken) {
    body = <BluesnapFields token={state.bluesnapToken} createCard={commands.createCard} bluesnap={bluesnap} i18n={i18n}/>;
  }

  let error = null;
  if (state.error) {
    error = <ErrorInfo error={state.error} i18n={i18n}/>;
  }

  let overlay = null;

  if (state.isLoading) {
    overlay =  <div className="loading-overlay" testid="loading-overlay"/>;
  }

  return (
    <Modal shown={isShown} hide={commands.hide}>
      {overlay}

      <Modal.Header>
        {i18n.t("credit_card.modal.header")}
      </Modal.Header>

      <Modal.Body>
        {error}
        {body}
      </Modal.Body>

      <Modal.Footer>
      </Modal.Footer>
    </Modal>
  );
}

function CardInfo({card, removeCard, i18n}) {
  let t = i18n.scoped("credit_card.modal.card_info");
  return (
    <div testid="card-info" className="card-info">
      <div className="card-row">
        <span testid="remove-credit-card" onClick={removeCard} className="remove-card">
          {t("remove_card")}
        </span>
        <div className="card-type">{card.card_type}</div>
      </div>

      <div className="clear"/>

      <div className="card-row">
        <span className="card-number">**** **** **** {card.card_last_four_digits}</span>
        <span className="card-exp">{`${card.expiration_year}/${card.expiration_month}`}</span>
      </div>

      <div className="clear"/>
    </div>
  );
}

function ErrorInfo({error, i18n}) {
  let text = i18n.t(`credit_card.modal.errors.${error}`);

  return (
    <div className="error-info" testid="error-info">
      <span className="error-text">{text}</span>
    </div>
  );
}