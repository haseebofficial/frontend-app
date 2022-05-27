import "app/_styles/global.scss";
import React, { useState , useEffect} from "react";
import useVisible from "react_utils/use_visible";
import { isTestEnv } from "utils/check_env";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { buildStore } from "new_store";
import AppPages from "app/app_pages";
import WsClient from "../ws_client";   //websocket client
import Twilio from "../twilio";


let Router = isTestEnv ? MemoryRouter : BrowserRouter;

export let ContextProfilePage = React.createContext()
export let ContextSearchForm = React.createContext()
export let ContextSearchMobileMenu = React.createContext()
export let ContextTwilio = React.createContext()


 

function AppRoot() {
  const STORE = buildStore();
  const _wsClient = new WsClient(STORE);
  let setupResult =   _wsClient.setup(true);
  const twilio = new Twilio(STORE)
  var [isTwilioSetupCompleted, setTwilioSetup]=useState(false);

  // ContextTwilio 
  var startTwilio=  ()=>{
    if(!isTwilioSetupCompleted)
      twilio.setup(true).then(()=>{
        isTwilioSetupCompleted=true;
        return twilio;
      })
    else 
      return twilio;
  }

  // ContextProfilePage
  let { isVisible, show } = useVisible();

  // ContextSearchForm
  let [visit, setVisit] = useState(false)
  let isDateVisible = visit
  let toggleDateVisible = () => {
    setVisit(!visit)
  }
  let showDateVisible = () => {
    setVisit(true)
  }

  // ContextSearchMobileMenu
  let tabs = {
    result: "result",
    filter: "filter",
    searchForm: "search-form"
  };
  let [currentTab, setTab] = useState(tabs.result);

  //start all initialization
  useEffect(() => {
    startTwilio()
  }, []);

  return (
    <Provider store={STORE}>
      <ContextProfilePage.Provider value={{isVisibleForm: isVisible, showForm: show}}>
        <ContextSearchForm.Provider value={{isDateVisible, toggleDateVisible, showDateVisible}}>
          <ContextSearchMobileMenu.Provider value={{tabs, currentTab, setTab}}>
            <ContextTwilio.Provider value={{isTwilioDone:isTwilioSetupCompleted, startTwilio: startTwilio}}>
              <Router>
                <AppPages/>
              </Router>
            </ContextTwilio.Provider>
          </ContextSearchMobileMenu.Provider>
        </ContextSearchForm.Provider>
      </ContextProfilePage.Provider>
    </Provider>
  );
}

export default AppRoot;