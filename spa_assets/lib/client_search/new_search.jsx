import 'client_search/_styles/client_search.scss';
import React, {useState} from "react";
import FormSearch from "search/form/form";
import ClientSearchTable from "./table";
import { Redirect, useLocation } from "react-router-dom";
import routes from "app/routes";

export default function NewSearch() {

  let [currentSearch, setCurrentSearch] = useState(null);
  let createSearch = (id) => setCurrentSearch({id: id});

  if (currentSearch) {
    return <Redirect to={routes.spaSearchPath({id: currentSearch.id})}/>;
  } else {
    return (
      <div>
        <div className="client-form">
          <div className="container">
            <FormSearch onSubmit={createSearch}/>
          </div>
        </div>
      </div>
    );
  }
}

