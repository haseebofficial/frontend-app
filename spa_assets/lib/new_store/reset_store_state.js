const RESET_STORE_ACTION = "__RESET_STORE_STATE__";

export default function resetStoreState() {
  return { type: RESET_STORE_ACTION };
}

export { RESET_STORE_ACTION };