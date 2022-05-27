import React from "react";
import { connect } from 'react-redux';
import { globalsToProps } from 'utils/globals_context';
import { mergeDate } from "utils/date";
import selectLanguages from "./select_languages";
import LanguagesSelector from "./languages_selector";
import Calendar from "components/calendar";
import { show as showCredtiCardModal } from "credit_card/reducer/actions";
import CallSearch from "resources/call_search";

class CallSearchFormContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    let immediateCall, date;

    if (this.props.callSearch && !this.props.callSearch.immediate_call) {
      date = this.props.callSearch.scheduled_at;
      immediateCall = false;
    } else {
      date = mergeDate(new Date(), {hours: 10, minutes: 0});
      immediateCall = true;
    }
    this.state = { immediateCall, date };
  }

  render() {
    if (this.state.languages) {
      let commands = {
        selectLang: (language) => this.changeLanguage(language), 
        selectYourLang: (yourLanguage) => this.changeYourLanguage(yourLanguage)
      };

      let i18n = this.props.globals.i18n;

      return (
        <div testid="call-search-form" className="call-search-form">
          <div className="toggle-call-date">
            <ul>
              <li className={this.state.immediateCall ? 'act' : ''}>
                <span className="toggle-item" testid="hide-calendar" onClick={() => this.setState({immediateCall: true})}>
                  {i18n.t("call_search.form.call_now")}
                </span>
              </li>
              <li className={this.state.immediateCall ? '' : 'act'}>
                <span className="toggle-item" testid="show-calendar" onClick={() => this.setState({immediateCall: false})}>
                  {this.state.immediateCall ? i18n.t("call_search.form.choose_date") : localizeDate(this.state.date)}
                </span>
              </li>
            </ul>
          </div>
          { 
            !this.state.immediateCall &&
              <Calendar 
                selectedDate={this.state.date} 
                onSelect={ (date) => this.setState({date}) } 
                i18n={i18n}
                futureOnly={true}
              />
          }
          <LanguagesSelector languages={this.state.languages} commands={commands} state={this.state} i18n={i18n}/>

          <div className="search-form-submit" testid="submit-search" onClick={this.submit()}>{i18n.t("call_search.form.submit_button")}</div>
        </div>
      );
    } else {
      return <div testid="search-form-loading" className="search-form-loading"/>;
    }
  }

  componentDidMount() {
    CallSearch.Language.list()
      .then(({languages}) => this.addLanguages(languages));
  }

  addLanguages(languages) {
    let i18n = this.props.globals.i18n;
    languages = languages.map(l => { 
      return Object.assign({}, l, {name: i18n.t(`languages.${l.locale}`)});
    });

    if (this.props.callSearch) {
      let { language, your_language } = this.props.callSearch;

      this.setState({languages, language: language.iso, yourLanguage: your_language.iso});
    } else {
      let userLang =  window.localStorage.getItem("locale");
      let { language, yourLanguage } = selectLanguages(languages, userLang);

      this.setState({languages, language, yourLanguage});
    }
    
  }

  changeLanguage(language) {
    if (this.state.yourLanguage === language) {
      this.setState({ language, yourLanguage: this.state.language });
    } else {
      this.setState({ language });
    }
  }

  changeYourLanguage(yourLanguage) {
    if (this.state.language === yourLanguage) {
      this.setState({ language: this.state.yourLanguage, yourLanguage });
    } else {
      this.setState({ yourLanguage });
    }
  }

  submit() {
    return () => {
      let callSearch = this.composeCallSearch();
      CallSearch.create(callSearch)
        .then(
          ({call_search}) => window.location.href = `/call_searches/new`,
          ({error}) => { 
            if (error === 401) {
              this.props.dispatch(showCredtiCardModal());
            }
          }
        );
    };
  }

  composeCallSearch() {
    let { language, yourLanguage } = this.state;
    let callSearch = { language, yourLanguage };

    if (!this.state.immediateCall) {
      callSearch["scheduledAt"] = this.state.date;
    }

    return callSearch;
  }
}

function localizeDate(date) {
  let month = zeroOffset(date.getMonth() + 1);
  let day = zeroOffset(date.getDate());
  let hours = zeroOffset(date.getHours());
  let minutes = zeroOffset(date.getMinutes());

  return `${date.getFullYear()}/${month}/${day} ${hours}:${minutes}`;
}

function zeroOffset(number) {
  if (number < 10) {
    return `0${number}`;
  } else {
    return number;
  }
}

function mapStateToProps(state) {
  return {callSearch: state.callSearches.current};
}

export default connect(
  mapStateToProps
)(
  globalsToProps(CallSearchFormContainer)
);