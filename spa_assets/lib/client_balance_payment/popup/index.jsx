import React from "react";
import { connect } from 'react-redux';
import { globalsToProps } from 'utils/globals_context';
import { hidePaymentPopup } from "client_balance_payment/reducer/actions";
import ClientBalancePayment from "resources/client_balance_payment";
import Modal from "components/modal";

class Popup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {selectedItem: 10};
  }

  render() {
    let { isNotEnoughFunds, display, dispatch } = this.props;
    let i18n = this.props.globals.i18n;
    let t = i18n.scoped("client_balance_payment.balance_status.popup");

    let hidePopup = () => dispatch(hidePaymentPopup());
  
    return (
      <Modal hide={hidePopup} shown={display}>
        <Modal.Header>
          {isNotEnoughFunds && 
            <span testid="no-funds-message">{t("no_funds_message")}</span> 
          }
        </Modal.Header>

        <Modal.Body>
          <div className="options-container">
            <TopupItem t={t} amount={10} isSelected={this.state.selectedItem === 10} onClick={this.selectItem(10)}/>
            <TopupItem t={t} amount={25} isSelected={this.state.selectedItem === 25} onClick={this.selectItem(25)}/>
            <TopupItem t={t} amount={50} isSelected={this.state.selectedItem === 50} onClick={this.selectItem(50)}/>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <span className="btn btn-success" testid="topup-submit" onClick={() => this.createPayment()}>
            {i18n.t("client_balance_payment.top_up_text")}
          </span>
        </Modal.Footer>
      </Modal>
    );
  }

  createPayment() {
    return ClientBalancePayment.create(this.state.selectedItem)
      .then(json => window.location.href = json.paypal_urls.checkout_url);
  }


  selectItem(amount) {
    return () => this.setState(() => ({selectedItem: amount}));
  }
}


function TopupItem({amount, isSelected, onClick, t}) {
  let className = isSelected ? "topup-item selected" : "topup-item";

  return (
    <div className={className} testid={`topup-item-${amount}`} selected={isSelected} onClick={onClick}>
      <div className="checkbox-label">
        <div className="checkbox"></div>
        <span className="topup-amount">{t("topup_item_text", {amount: amount.toFixed(1)})}</span>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {display: state.clientBalance.displayPopup, isNotEnoughFunds: state.clientBalance.notEnoughFunds};
}

export default connect(
  mapStateToProps
)(
  globalsToProps(Popup)
);