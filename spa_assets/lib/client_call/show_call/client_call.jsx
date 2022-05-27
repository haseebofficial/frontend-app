import React from "react";
import LayoutBody from "layout/layout_body";
import ClientCallTable from "client_call/show_call/table";
import ClientTabs from "client_utils/tabs";
import NewCall from "client_call/show_call/new_call";
import { useTabs, Tabs } from "react_utils/tabs";
import {t} from 'i18n';

let tabIds = {calls: "calls", callForm: "callForm"};

export default function ClientCall() {
  let tabs = useTabs(Object.keys(tabIds));

  return (
    <LayoutBody>
      <div className="client-call-page">
        <ClientTabs>
          <Tabs tabs={tabs} TabComponent={TabComponent}/>
        </ClientTabs>
        {tabs.isActive(tabIds.callForm) && <NewCall/>}
        <ClientCallTable/>
      </div>
    </LayoutBody>
  );
}

function TabComponent({tabs, tabId}) {
  let activityClass = tabs.isActive(tabId) ? "active" : "";
  let tempTabNames = {
    [tabIds.calls]: t("client_call.tab.my_calls"),
    [tabIds.callForm]: t("client_call.tab.new_call")
  };

  return (
    <li className={`client-tabs-link ${activityClass}`} onClick={() => tabs.setTab(tabId)}>
      {tempTabNames[tabId]}
    </li>
  );
}
