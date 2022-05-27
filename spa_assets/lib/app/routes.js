import { composeRoutes } from "broutes";
import { availableLocales } from "i18n/locales";
import { getAppLocale } from "i18n";
import { getConfig } from "config";

let localesString = availableLocales.join("|");
export default composeRoutes(r => {
    r.scope(`/:locale(${localesString})?`, r => {
        r.route("/help/help_interpreter#create_new_interpreter", { name: "signUpInterpreter" });

        r.scope("/users", r => {
            r.route("/sign_in");
            r.route("/sign_up");
            r.route("/password/new", { name: "restorePassword" });
            r.route("/edit", { name: "editUser" });
        });

        r.scope("/help", r => {
            r.route("/support");
            r.route("/info", { name: "about" });
            r.route("/help_interpreter", { name: "forInterpreters" });
            r.route("/for_affiliates");
            r.route("/terms_conditions", { name: "terms" });
            r.route("/privacy_policy");
        });

        r.route("/personal_account");
        r.scope("/personal_account", r => {
            r.route("/searches");
        }, { name: "personalAccount" });

        r.route("/interpretation_calls");
        r.route("/phone", { name: "interpretationCallsPromo" });

        r.route("/translation", { name: "textTranslations" });
        r.resources("/translation_orders", { name: "textTranslationOrders" });
        r.route("/translation_orders/:id/completed", { name: "completedTextTranslationOrder" });

        r.route("/spa_login", { name: "login" });
        r.route("/", { name: "root" });

        r.route("/spa", { name: "spaRoot" });
        r.scope("/spa", r => {
            r.resources("/searches", { singularName: "search" });
            r.route("/searches/:searchId/interpreters/:id", { name: "searchInterpreter" });

            r.resources("/orders");
            r.route("/orders/:id/completed", { name: "completedOrder" });

            r.resources("/interpretation_calls");

            r.route("/phone");
        }, { name: "spa" });
    }, { defaultParams: { locale: getAppLocale } });
});

export let backendUrl = getConfig("backendUrl");