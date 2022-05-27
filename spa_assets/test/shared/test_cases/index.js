export function testDatesEqual(t, actualDate, expectedDate, message) {
  if ( isEqual(actualDate, expectedDate) ) {
    t.pass(message);
  } else {
    t.equal(actualDate, expectedDate, message);
  }
}

function isEqual(date1, date2) {
  return date1.getTime() === date2.getTime();
}