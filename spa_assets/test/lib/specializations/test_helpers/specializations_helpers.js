import api from "api_routes";
import { mockJSON } from "test/lib/improved_fetch/test_helpers";

export function mockSpecializations() {
  let specializations = getSpecializations();
  mockJSON(api.specializationsPath(), {specializations});
}

function getSpecializations() {
  let slugs = ["general", "phone", "delegations"];
  
  return slugs.map(slug => {
    return { slug, name: slug };
  });
}
