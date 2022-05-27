import test from "tape";
import { questionnaireStarsClass } from "utils/shared_classes";
const result = questionnaireStarsClass;

test("utils/shared_classes questionnaireStarsClass", function(t) {
  t.equal(result(1.9), klass(2), "returns 2 if n < 2.5");
  t.equal(result(2.5), klass(3), "returns 3 if n >= 2.5");

  t.equal(result(3), klass(3), "returns 3 if n === 3");

  testQuarters(t, 3);
  testQuarters(t, 4);
  
  t.equal(result(5.5), klass(5), "returns 5 if n > 5");

  t.end();
});

function testQuarters(t, n) {
  testReturnsUpperBoundaryClassWithinQuarter({ t, quarter: [n, n + 0.25] });
  testReturnsUpperBoundaryClassWithinQuarter({ t, quarter: [n + 0.25, n + 0.5] });
  testReturnsUpperBoundaryClassWithinQuarter({ t, quarter: [n + 0.5, n + 0.75] });
  testReturnsUpperBoundaryClassWithinQuarter({ t, quarter: [n + 0.75, n +1] });
}

function testReturnsUpperBoundaryClassWithinQuarter({t, quarter}) {
  let expectedKlass = quarter[1].toString().replace(".", ""); // 3.25 => 325; 3.5 => 35
  let [lowerBoundary, upperBoundary] = quarter;

  t.equal(result(lowerBoundary + 0.1), klass(expectedKlass), `returns ${expectedKlass} if ${lowerBoundary} < n < ${upperBoundary}`);
  t.equal(result(upperBoundary), klass(expectedKlass), `returns ${expectedKlass} if n == ${upperBoundary}`);
}

function klass(n) {
  return `stars_${n}`;
}