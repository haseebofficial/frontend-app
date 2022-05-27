export function parse24Hours(val) {
  let { success, value } = parseTime(val, {max: 24});
  return { success, hours: value };
}

export function parse60Minutes(val) {
  let { success, value } = parseTime(val, {max: 60});
  return { success, minutes: value };
}

function parseTime(rawValue, {max}) {
  let value = rawValue === "" ? 0 : parseInt(rawValue);

  if (isNaN(value) || value < 0 || value >= max) {
    return { success: false, value: null };
  } else {
    return { success: true, value };
  }
}