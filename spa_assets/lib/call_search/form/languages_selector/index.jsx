import React from "react";

export default class LanguagesSelector extends React.PureComponent {
  constructor() {
    super();

    this.state = { yourLanguageFolded: true };
  }

  render() {
    let { languages, commands, state, i18n } = this.props;
    let { language, yourLanguage } = state;

    return (
      <div testid="language-selector">
        <div className="language-select-wrapper">
          <div className="label-text">{i18n.t("call_search.form.language")}: </div>
          <div className="language-selector-container">
            <Dropdown selected={language} onSelect={commands.selectLang} allAvailable={languages} selectorType="language" i18n={i18n}/>
          </div>
        </div>

        <div className="language-select-wrapper">
          <div className="label-text">
            <span>{i18n.t("call_search.form.your_language")}: </span>
            { this.state.yourLanguageFolded && 
                <span className="unfold-lang" testid="unfold-your-lang" onClick={() => this.setState({yourLanguageFolded: false})}>
                  {i18n.t(`languages.${yourLanguage}`)}
                </span>
            }
          </div>
          { !this.state.yourLanguageFolded && 
              <div className="language-selector-container">
                <Dropdown selected={yourLanguage} onSelect={commands.selectYourLang} allAvailable={languages} selectorType="your-language" i18n={i18n}/>
              </div>
          }   
        </div>
        <div testid="selected-lang" value={language}/>
        <div testid="selected-your-lang" value={yourLanguage}/>
      </div>
    );
  }
}

class Dropdown extends React.PureComponent {
  constructor() {
    super();

    this.state = {};
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  render() {
    let { selected, allAvailable, selectorType, i18n } = this.props;

    return (
      <div ref={node => this.node = node}>
        <div className="dropdown-toggle" testid={`${selectorType}-dropdown-toggle`} onClick={() => this.toggleOpen()}>
          <div className="selected-text">{i18n.t(`languages.${selected}`)}</div>
          <div className="arrow-wrapper"><div className="arrow"/></div>
        </div>

        {this.state.isOpen &&           
          <div testid={`${selectorType}-dropdown`}>
            <SelectableLanguagesList 
              languages={allAvailable} 
              currentlySelected={selected}
              onSelect={this.doSelect()}
            />
          </div>
        }
      </div>
    );
  }

  toggleOpen() {
    this.setState({isOpen: !this.state.isOpen});
  }

  doSelect() {
    return function() {
      this.props.onSelect(...arguments);
      this.toggleOpen();
    }.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(e) {
    if (this.node && !this.node.contains(e.target) && this.state.isOpen) {
      this.toggleOpen();
    }
  }
}

class SelectableLanguagesList extends React.PureComponent {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    let { languages, currentlySelected, onSelect } = this.props;

    let result = languages.map(lang => {
      if (lang.iso === currentlySelected || !this.matchesSearchQuery(lang)) {
        return null;
      } else {
        return <li 
          className="dropdown-result" 
          testid={`select-language-${lang.iso}`} 
          key={lang.iso} 
          onClick={() => onSelect(lang.iso)}>
          {lang.name}
        </li>;
      }
    });

    return (
      <div className="dropdown">
        <div className="dropdown-search-wrapper">
          <input type="text" testid="language-search" onChange={(e) => this.doSearch(e)}/>
        </div>
        <ul className="dropdown-results">
          {result}
        </ul>
      </div>
    );
  }

  matchesSearchQuery(lang) {
    if (this.state.searchQuery && !isStringStartsWith(this.state.searchQuery, lang.name)) {
      return false;
    } else {
      return true;
    }
  }

  doSearch(e) {
    this.setState({searchQuery: e.target.value});
  }
}

function isStringStartsWith(substr, str) {
  return str.match(new RegExp('^' + substr, 'i'));
}