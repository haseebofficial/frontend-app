import React from "react";
import LayoutBody from "layout/layout_body";
import ClientSearchTable from "client_search/table";
import ClientTabs from "client_utils/tabs";
import NewSearch from "client_search/new_search";
import { useTabs, Tabs } from "react_utils/tabs";
import {t} from 'i18n';

let tabIds = {searches: "searches", searchForm: "searchForm"};

export default function ClientSearch() {
  let tabs = useTabs(Object.keys(tabIds));

  return (
    <LayoutBody>
      <div className="client-search-page">
        <ClientTabs>
          <Tabs tabs={tabs} TabComponent={TabComponent}/>
        </ClientTabs>

        {tabs.isActive(tabIds.searchForm) && <NewSearch/>}
        <ClientSearchTable/>
      </div>
    </LayoutBody>
  );
}

function TabComponent({tabs, tabId}) {
  let activityClass = tabs.isActive(tabId) ? "active" : "";
  let tempTabNames = {
    [tabIds.searches]: t("global.searches_index_page.title"),
    [tabIds.searchForm]: t("layout.search.start_search")
  };

  return (
    <li className={`client-tabs-link ${activityClass}`} onClick={() => tabs.setTab(tabId)}>
      {tempTabNames[tabId]}
    </li>
  );
}
