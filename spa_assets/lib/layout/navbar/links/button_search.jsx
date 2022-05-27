import "layout/_styles/navbar/links/button_search.scss";
import React, {useContext} from "react";
import {ContextProfilePage} from "app/app_root"
import routes from "app/routes";
import { Switch, Route, Link } from "react-router-dom";
import {t} from "i18n";

export default function ButtonSearch() {
    return (
        <Switch>
            <Route exact path={routes.spaSearchInterpreterPath.raw}><ButtonSearchContent/></Route>
        </Switch>
    )
}

function ButtonSearchContent({}) {
    let {isVisibleForm, showForm} = useContext(ContextProfilePage)
    return (
        <React.Fragment>
            { !isVisibleForm &&
                <button className=" navbar-item-button" onClick={showForm}>
                    <span className="is-hidden-touch">{t("layout.search.start_search")}</span>
                    <span className="is-hidden-desktop">{t("layout.search.button")}</span>
                    <i className="fas fa-search"></i>
                </button>
            }
        </React.Fragment>
    )
}
