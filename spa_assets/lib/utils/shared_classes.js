export function questionnaireStarsClass(rating) {
  let n;

  if (rating > 5) {
    n = 5;
  } else if (rating > 3) {
    let decimalPart = rating - Math.floor(rating);
    let quarter = Math.ceil(decimalPart/0.25) * 0.25;
    n = (Math.floor(rating) + quarter).toString().replace(".", "");
  } else if (rating >= 2.5) {
    n = 3;
  } else { 
    n = 2;
  }

  return `stars_${n}`;
}