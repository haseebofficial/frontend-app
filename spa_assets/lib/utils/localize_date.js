
export function localizeDate(date) {
    let year = appendLeadingZero(date.getFullYear())
    let month = appendLeadingZero(date.getMonth() + 1);
    let day = appendLeadingZero(date.getDate());
    let hours = Number(appendLeadingZero(date.getHours()));
    let minutes = Number(appendLeadingZero(date.getMinutes()));
    let totalSeconds = appendLeadingZero(date.getDate())
    let hoursUTC = appendLeadingZero(date.getUTCHours())
    
    return {
      string: `${date.getFullYear()}/${month}/${day} ${hours}:${minutes}`,
      date: `${day}/${month}/${date.getFullYear()}`,
      year, month, day,
      hours, minutes,
      totalSeconds,
      hoursUTC
    };
}

export function convertToUTC(date) {
  let yearUTC = appendLeadingZero(date.getUTCFullYear())
  let monthUTC = appendLeadingZero(date.getUTCMonth() + 1)
  let dayUTC = appendLeadingZero(date.getUTCDate())
  let hoursUTC = appendLeadingZero(date.getUTCHours())
  let minutesUTC = appendLeadingZero(date.getMinutes())
  return {
    date: `${yearUTC}-${monthUTC}-${dayUTC}`,
    time: `${hoursUTC}:${minutesUTC}:00 UTC`,
  }
}
  
export function appendLeadingZero(i) {
    return i < 10 ? `0${i}` : i;
}