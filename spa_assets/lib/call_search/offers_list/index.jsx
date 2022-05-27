import { connect } from 'react-redux';
import { globalsToProps } from 'utils/globals_context';
import React from "react";

import Offer from './offer';
import { buildCreateCall } from "./commands";

function mapStateToProps(state, ownProps) {
  return {search: state.callSearches[ownProps.searchId]};
}

const OffersListWrapper = connect(
  mapStateToProps
)(
  globalsToProps(OffersListPropsDelegator)
);

export default OffersListWrapper;

function OffersListPropsDelegator({search, dispatch, globals, searchId}) {
  let { i18n, fetcher, window } = globals;
  let buildCommand = (offer) => buildCreateCall({ callData: { interpreterId: offer.id, searchId }, dispatch, fetcher, window, i18n });
  let offers = search ? search.offers : [];

  return <OffersList {...{offers, i18n, buildCreateCall: buildCommand}}/>;
}

function OffersList({offers, i18n, buildCreateCall}) {
  let offersTemplate = "";

  offersTemplate = (
    <div className="is_cont" id="available_questionnaires">
      {
        offers.map( (offer) => <Offer key={offer.id} i18n={i18n} offer={offer} createCall={buildCreateCall(offer)}/> )
      }
    </div>
  );

  return <React.Fragment>
    {offersTemplate}
    <div className="loading-container">
      <div className="loading-icon"/>
    </div>
  </React.Fragment>;
}