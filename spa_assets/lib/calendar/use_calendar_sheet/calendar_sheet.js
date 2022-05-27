import { startOfMonth, endOfMonth, addDays, isSameMonth, eachWeekOfInterval, eachDayOfInterval, getWeeksInMonth, addWeeks } from "date-fns";

export default class CalendarSheet {
  static addConfigDefaults(config) {
    let defaultConfig = {
      weekStartsOn: 0,
      fillAdjacentMonths: false,
      minWeeksPerSheet: 0,
      rtl: false
    };

    return Object.assign({}, defaultConfig, config);
  }

  constructor(year, month, config) {
    this._composeWeek = this._composeWeek.bind(this);
    this._composeWeekDay = this._composeWeekDay.bind(this);
    
    this.config = CalendarSheet.addConfigDefaults(config);

    let date = new Date(year, month);
    this.firstDay = startOfMonth(date);
    this.lastDay = endOfMonth(date);
    this.weeks = this._composeWeeks();
  }
  
  _composeWeeks() {
    let {weekStartsOn, minWeeksPerSheet} = this.config;
    let lastDay = this.lastDay;

    let weeksN = getWeeksInMonth(this.firstDay, {weekStartsOn});
    if (minWeeksPerSheet > weeksN) {
      let missingWeeksN = minWeeksPerSheet - weeksN;
      lastDay = addWeeks(this.lastDay, missingWeeksN, {weekStartsOn});
    }

    return eachWeekOfInterval({ start: this.firstDay, end: lastDay }, { weekStartsOn }).map(this._composeWeek);
  }

  _composeWeek(weekStart) {
    let fullWeek = { start: weekStart, end: addDays(weekStart, 6) };
    let week = eachDayOfInterval(fullWeek).map(this._composeWeekDay);
    
    return this.config.rtl ? week.reverse() : week;
  }

  _composeWeekDay(day) {
    if (this.config.fillAdjacentMonths || isSameMonth(this.firstDay, day)) {
      return day;
    } else {
      return null;
    }
  }
}