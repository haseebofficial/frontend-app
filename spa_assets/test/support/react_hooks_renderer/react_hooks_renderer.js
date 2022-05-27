export * from "@testing-library/react-hooks";

export function current(hook) {
  return hook.result.current;
}