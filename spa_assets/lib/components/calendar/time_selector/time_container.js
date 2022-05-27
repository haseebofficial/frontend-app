import { mergeDate } from "utils/date";

class TimeContainer {
  constructor({ date, onChange }) {
    this._onChange = onChange;
    this._date = date;

    this.formattedValue = addLeadingZero( this._getValue() );
  }

  setValue(value) {
    let newValue = parseInt(value);

    if (this._isValidValue(newValue)) {
      this._changeValue(newValue);
    }
  }

  addValue() {
    let oldValue = this._getValue();
    let newValue = oldValue + 1;

    if (!this._isValidValue(newValue)) {
      newValue = 0;
    } 

    this._changeValue(newValue);
  }

  substractValue() {
    let oldValue = this._getValue();
    let newValue = oldValue - 1;

    if (!this._isValidValue(newValue)) {
      newValue = this._maxValue;
    }

    this._changeValue(newValue);
  }

  _isValidValue(value) {
    return value >= 0 && value <= this._maxValue;
  }

  _changeValue(newValue) {
    let dateChanges = this._getDateChanges(newValue);

    this._onChange( mergeDate(this._date, dateChanges) );
  }
}

export class Hours extends TimeContainer {
  get _maxValue() { return 23; }

  _getValue() {
    return this._date.getHours();
  }

  _getDateChanges(value) {
    return { hours: value };
  }
}

export class Minutes extends TimeContainer {
  get _maxValue() { return 59; }

  _getValue() {
    return this._date.getMinutes();
  }

  _getDateChanges(value) {
    return { minutes: value };
  }
}

function addLeadingZero(number) {
  if ( number >= 10 || number === 0) {
    return `${number}`;
  } else {
    return `0${number}`;
  }
}