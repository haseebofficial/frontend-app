import { isEqual } from "utils/map_utils";

export function assertArgsValid(expected, actual, methodName) {
  if (!isEqual(expected, actual)) {
    throw new Error(
      `Arguments provided to '${methodName}' mock don't match the expectation.
        Expected: ${JSON.stringify(expected)}
        Actual:   ${JSON.stringify(actual)}`
    );
  }
}