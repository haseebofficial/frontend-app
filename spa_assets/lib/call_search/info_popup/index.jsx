import React from "react";
import Modal from "components/modal";

export default class InfoPopup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {display: props.display || false };
  }

  componentDidMount() {
    if (process.env.NODE_ENV !== "test") {
      let showPopup = (e) => { e.preventDefault(); this.setState({display: true}); };
      $(".show-call-info").click(showPopup);
    }
  }

  render() {
    let { i18n } = this.props;
    let t = i18n.scoped("call_search.info_popup");

    let hideModal = () => {
      this.setState({display: false});
    };
  
    return (
      <Modal hide={hideModal} shown={this.state.display}>
        <Modal.Body>
          <div className="call-search-info">
            { t("step1") }
            <br/>
            <br/>
            { t("step2") }
            <br/>
            <br/>
            { t("step3.before_button") }
            <span className="small-connect-button"/>
            { t("step3.after_button") }
            <br/>
            <br/>
            { t("step4") }
            <br/>
            <br/>
            { t("step5") }
            <br/>
            <br/>
            { t("step6") }
            <br/>
            <br/>
            { t("step7.before_button") }
            <span className="small-hangup-button"/>
            { t("step7.after_button") }
            <br/>
            <br/>
            { t("step8.before_button") }
            <span className="small-hangup-button"/>
            { t("step8.after_button") }
            <br/>
            <br/>
            { t("step9") }
            <br/>
            <br/>
            <a href="/help/terms_conditions" className="terms-link" target="_blank">{ t("terms_link") }</a>
            <div className="clear"/>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <span className="btn btn-success" onClick={hideModal}>
            {t("close_button")}
          </span>
          <div className="clear"/>
        </Modal.Footer>
      </Modal>
    );
  }
}
