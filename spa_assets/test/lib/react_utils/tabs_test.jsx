import test from "test/browser_tape";
import React from "react";
import { render } from "test/support/react_renderer";
import { renderHook, current } from "test/support/react_hooks_renderer";
import { useTabs, Tabs, SingleTabSwitch } from "react_utils/tabs";

test("react_utils: tabs", function(t) {
  t.test("{useTabs}", function(t) {
    t.test("activates first tab", function(t) {
      let hook = renderHook(() => useTabs(["tab_1", "tab_2"]));
      let tabs = current(hook);

      t.equal(tabs.activeTab, "tab_1");
      t.equal(tabs.isActive("tab_1"), true);
      t.same(tabs.all, ["tab_1", "tab_2"]);

      t.end();
    });

    t.test("allows changing tabs", function(t) {
      let hook = renderHook(() => useTabs(["tab_1", "tab_2"]));
      let tabs = current(hook);
      tabs.setTab("tab_2");

      tabs = current(hook);
      t.equal(tabs.activeTab, "tab_2");
      t.equal(tabs.isActive("tab_1"), false);
    
      t.end();
    });

    t.test("throws tab provided to setTab() is not listed", function(t) {
      let hook = renderHook(() => useTabs(["tab_1", "tab_2"]));
      let tabs = current(hook);

      t.throws(() => {
        tabs.setTab("tab_3");
      }, /tab/);
    
      t.end();
    });
  });

  t.test("{Tabs}", function(t) {
    t.test("calls provided function with tabId", function(t) {
      let hook = renderHook(() => useTabs(["tab_1", "tab_2"]));
      let tabs = current(hook);

      let Tab = ({tabId}) => <div testid={tabId}/>;
      let tabsElem = render(<Tabs tabs={tabs} TabComponent={Tab}/>);

      t.true(tabsElem.queryByTestId("tab_1"));
      t.true(tabsElem.queryByTestId("tab_2"));
    
      t.end();
    });

    t.test("calls provided function with tabs", function(t) {
      let hook = renderHook(() => useTabs(["tab_1", "tab_2"]));
      let tabs = current(hook);

      let Tab = ({tabId, tabs}) => tabs.isActive(tabId) ? <div testid={tabId}/> : null;
      let tabsElem = render(<Tabs tabs={tabs} TabComponent={Tab}/>);

      t.true(tabsElem.queryByTestId("tab_1"));
      t.false(tabsElem.queryByTestId("tab_2"));
    
      t.end();
    });
  });

  t.test("{SingleTabSwitch}", function(t) {
    t.test("renders active tab's content", function(t) {
      let hook = renderHook(() => useTabs(["tab_1", "tab_2"]));
      let tabs = current(hook);

      let TabContent_1 = () => <div testid="tab_content_1"/>;
      let TabContent_2 = () => <div testid="tab_content_2"/>;

      let tabContent = render(<SingleTabSwitch tabs={tabs} tabsMap={{tab_1: TabContent_1, tab_2: TabContent_2}}/>);

      t.true(tabContent.queryByTestId("tab_content_1"));
      t.false(tabContent.queryByTestId("tab_content_2"));
    
      t.end();
    });

    t.test("passes {tabs} and {tabIid} into TabContent component", function(t) {
      let hook = renderHook(() => useTabs(["tab_1", "tab_2"]));
      let tabs = current(hook);

      let passedTabs;
      let passedTabId;
      let TabContent = ({tabs, tabId}) => {
        passedTabs = tabs;
        passedTabId = tabId;

        return null;
      };

      render(<SingleTabSwitch tabs={tabs} tabsMap={{tab_1: TabContent, tab_2: TabContent}}/>);

      t.equal(passedTabs, tabs);
      t.equal(passedTabId, "tab_1");
    
      t.end();
    });

    // this test produces ugly error in the test runner summary output since it's supposed to throw inside react's render
    // t.test("throws if component for tab is not found", function(t) {
    //   let hook = renderHook(() => useTabs(["tab_1", "tab_2"]));
    //   let tabs = current(hook);

    //   t.throws(() => {
    //     render(<SingleTabSwitch tabs={tabs} tabsMap={{tab_1: null}}/>);
    //   }, /tab_1/);
    
    //   t.end();
    // });
  });
});