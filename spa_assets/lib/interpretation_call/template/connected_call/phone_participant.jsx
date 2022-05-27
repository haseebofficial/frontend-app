import React from "react";

export default class PhoneParticipant extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.addToValue = this.addToValue.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  addToValue(v) {
    this.setState({value: `${this.state.value}${v}`});
  }

  render() {
    let { participantData, commands } = this.props;
    let phoneNumber = this.state.value;
    let clearPhoneNumber = () => this.setState({value: ""});

    return (
      <div className="call-participant external-number">
        <strong>PhoneParticipant: Dialog</strong>
        <div className="dial-wrapper">
          <div className="n-input-wrapper">
            <span>
              <input className="n-number" testid="phone-input" placeholder="Enter phone number" value={this.state.value} onChange={this.handleChange}/>
              <Button {...{participantData, commands, clearPhoneNumber, phoneNumber}}/>
            </span>
          </div>
          <div className="dial-container">
            <DialRow values={[1, 2, 3]} addToValue={this.addToValue}/>
            <DialRow values={[4, 5, 6]} addToValue={this.addToValue}/>
            <DialRow values={[7, 8, 9]} addToValue={this.addToValue}/>
            <DialRow values={["+", 0, "#"]} addToValue={this.addToValue}/>
          </div>
        </div>
      </div>
    );
  }
}

function Button({participantData, commands, clearPhoneNumber, phoneNumber}) {
  if (participantData.state === "connected") {
    let remove = () => { clearPhoneNumber(); return commands.removeParticipant(); };

    return <div className="remove-participant" testid="remove-participant" onClick={remove}/>;
  } else {
    let add = () => { commands.addParticipant(phoneNumber); };

    return <div className="call-button" testid="add-participant" onClick={add}/>;
  }
}

function DialRow({values, addToValue}) {
  return (
    <div className="dial-row">
      {
        values.map(value => <DialButton key={value} value={value} addToValue={addToValue}/>)
      }
    </div>
  );
}

function DialButton({value, addToValue}) {
  let add = () => addToValue(value);

  return (
    <span className="dial-button" testid={`dial-button-${value}`} onClick={add}>{value}</span>
  );
}