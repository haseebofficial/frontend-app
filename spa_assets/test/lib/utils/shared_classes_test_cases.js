import { questionnaireStarsClass } from "utils/shared_classes";

export function testHasCorrectQuestionnaireStarsClass({t, rating, elemStr}) {
  let klassRegex = new RegExp( questionnaireStarsClass(rating) );
  t.true(klassRegex.test(elemStr), "renders correct questionnaire stars class");
}