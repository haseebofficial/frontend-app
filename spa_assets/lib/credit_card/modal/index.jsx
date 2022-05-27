import React from "react";
import { connect } from 'react-redux';
import { globalsToProps } from 'utils/globals_context';
import { hide as hideModal } from "credit_card/reducer/actions";
import CreditCard from "resources/credit_card";
import BluesnapToken from "resources/bluesnap_token";
import CreditCardModal from "./modal";

class CreditCardModalContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let { isShown, dispatch, globals } = this.props;

    if (isShown) this.ensureHasDataToDisplay();

    let commands = this.buildCommands({dispatch});
    return (
      <CreditCardModal 
        state={this.state} 
        isShown={isShown} 
        commands={commands} 
        bluesnap={window.bluesnap}
        i18n={globals.i18n}>
      </CreditCardModal>
    );
  }

  ensureHasDataToDisplay() {
    if (!this.hasTokenOrCreditCard()) {
      CreditCard.find().then(this.addCreditCard(), this.generateNewToken());
    }
  }

  hasTokenOrCreditCard() {
    return this.state.creditCard || this.state.bluesnapToken;
  }

  addCreditCard() {
    return ({credit_card}) => {
      this.setState({creditCard: credit_card, isLoading: false});
    };
  }

  generateNewToken() {
    return () => {    
      BluesnapToken.create().then(this.addToken());
    };
  }

  addToken() {
    return ({token}) => {
      this.setState({bluesnapToken: token, creditCard: null});
    };
  }

  buildCommands({dispatch}) {
    return { 
      hide: this.buildHide(dispatch), 
      removeCard: this.buildRemoveCard(), 
      createCard: this.buildCreateCard()
    };
  }

  buildHide(dispatch) {
    return () => dispatch(hideModal());
  }

  buildRemoveCard() {
    return () => {
      this.setState({error: null});

      let message = this.props.globals.i18n.t("confirmations.are_you_sure");
      let confirmation = window.confirm(message);
      if (confirmation) CreditCard.remove()
        .then(this.generateNewToken(), this.addError("unable_to_delete_card"));
    };
  }

  buildCreateCard() {
    return () => {
      this.setState({isLoading: true, error: null});

      CreditCard.create(this.state.bluesnapToken)
        .then(this.addCreditCard(), this.addError('unable_to_save_card'));
    };
  }

  addError(error) {
    return () => this.setState({ error, isLoading: false });
  }
}

function mapStateToProps(state) {
  return {isShown: state.creditCard.isShown};
}

export default connect(
  mapStateToProps
)(
  globalsToProps(CreditCardModalContainer)
);