import React, { useState } from "react";

export function useTabs(tabs) {
  let [activeTab, setActiveTab] = useState(tabs[0]);

  let isActive = (tab) => activeTab === tab;

  function setTab(tab) {
    if (tabs.includes(tab)) {
      setActiveTab(tab);
    } else {
      throw new Error(`Tab "${tab}" is not recognized. Available tabs are: [${tabs}]`);
    }
  }

  return {activeTab, isActive, setTab, all: tabs};
}

export function Tabs({tabs, TabComponent}) {
  return tabs.all.map(tabId => <TabComponent key={tabId} tabs={tabs} tabId={tabId}/>);
}

export function SingleTabSwitch({tabs, tabsMap}) {
  let TabComponent = tabsMap[tabs.activeTab];

  if (TabComponent) {
    return <TabComponent tabs={tabs} tabId={tabs.activeTab}/>;
  } else {
    let keys = Object.keys(tabsMap);
    throw new Error(`TabContent component for tab "${tabs.activeTab}" was not found. Make sure you include all tabs into {tabContentsMap}. Currently it contains [${keys}] tabs`);
  }
}