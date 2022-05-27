import React from "react";

export default class  BluesnapFields extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {errorCodes: {}};
  }

  render() {  
    let errorCodes = this.state.errorCodes;

    return (
      <div testid="bluesnap-fields" className="panel">
        <div className="panel-heading">
          <div className="heading-title">
            <span className="title-content">{this.t("header")}</span>
          </div>
          <div className="card-types"/>
          <div className="clear"/>
        </div>

        <div className="panel-body">
          <form onSubmit={(e) => this.doBluesnapSubmit(e)} testid="bluesnap-form" className="bluesnap-card-form">
            <div className="bluesnap-field-wrapper">
              <BluesnapField tag={"ccn"}/>
              <BluesnapError code={errorCodes.ccn} tag={"ccn"} i18n={this.props.i18n}/>
            </div>
            <div className="bluesnap-field-wrapper exp-wrapper">
              <BluesnapField tag={"exp"}/>
              <BluesnapError code={errorCodes.exp} tag={"exp"} i18n={this.props.i18n}/>
            </div>
            <div className="bluesnap-field-wrapper cvv-wrapper">
              <BluesnapField tag={"cvv"}/>
              <BluesnapError code={errorCodes.cvv} tag={"cvv"} i18n={this.props.i18n}/>
            </div>
            <input type="submit" className="bluesnap-submit" value={this.t("submit")}/>
          </form>
          <div className="clear"/>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.props.bluesnap.hostedPaymentFieldsCreation(this.props.token, {
      onFieldEventHandler: {
        onBlur: () => {},
        onFocus: () => {},
        onType: () => {},
        onError: (tagId, errorCode) => {
          this.setState({ errorCodes: {...this.state.errorCodes, [tagId]: errorCode} });
        },
        onValid: (tagId) => {
          this.setState({ errorCodes: {...this.state.errorCodes, [tagId]: undefined } });
        }
      },
      ccnPlaceHolder: "4111 2222 3333 4444",
      expPlaceHolder: this.t("expiry_placeholder"),
      cvvPlaceHolder: "CVV",
      expDropDownSelector: false
    });
  }

  doBluesnapSubmit(e) {
    e.preventDefault();

    return this.props.bluesnap.submitCredentials( 
      (callback) => {
        if (callback.error) {
          return undefined;
        } else {
          return this.props.createCard();
        }
      }
    );
  }

  t() {
    return this.props.i18n.scoped("credit_card.modal.bluesnap_fields")(...arguments);
  }
}

function BluesnapField({tag}) {
  return <div data-bluesnap={tag} className="bluesnap-hosted-field"/>;
}

export function BluesnapError({tag, code, i18n}) {
  if (code) {
    let errorId = getErrorId(code);
    let errorText = i18n.t(`credit_card.modal.bluesnap_fields.errors.${errorId}`);
    return <span 
      testid={`error-message-${tag}`} 
      className={`bluesnap-field-error bluesnap-field-error--${tag}`}>
      {errorText}
    </span>;
  } else {
    return <span className={`bluesnap-field-error bluesnap-field-error--${tag}`}></span>;
  }
}

function getErrorId(code) {
  if (code === "404" || code === "500" || code === "403") {
    return "internal_server_error";
  } else {
    return code;
  }
}

//   case "400":
//     return "Session expired please refresh page to continue";