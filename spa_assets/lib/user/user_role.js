const ROLES = {
  admin: "admin",
  client: "client",
  interpreter: "interpreter",
  operator: "operator",
  seniorOperator: "senior_operator",
  manager: "manager",
  seniorManager: "senior_manager",
  expert: "expert",
  financialController: "financial_controller",
  accountManager: "account_manager",
  promoManager: "promo_manager"
};

export default ROLES;

export let allRoles = Object.values(ROLES);