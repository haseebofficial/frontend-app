import React, {useContext} from "react";
import {ContextProfilePage} from "app/app_root"
import { Switch } from "react-router-dom";
import r from "app/routes";
import { useCurrentUser } from "login/login_state";
import Layout from "layout";
import { LocalizedPage, AppPageRoute } from "app_page";
import LoginPage from "login/login_page";
import NewTextTranslation from "text_translations/new_text_translation";
import NewSearchPage from "search/new_search_page";
import SearchPage from "search/search_page";
import ProfilePage from "profile/profile";
import NewOrderPage from "order/new_order";
import NewTranslationOrderPage from "translation_order/new_translation_order";
import ShowTranslationOrderPage from "translation_order/show_translation_order";
import ShowOrderPage from "order/show_order";
import CompletedOrder from "order/completed_order/completed_order";
import CompletedTranslationOrder from "translation_order/completed_order/completed_order";
import ClientSearch from "client_search/client_search";
import ClientCall from "client_call/show_call/client_call";
import NewCall from "client_call/new_call/new_call";
import CallPage from "client_call/call/call";
import ClientOrders from "client_orders/client_orders";
import PhonePage from "phone/phone_page";

function forAllAppPages() {
  let {isVisibleForm} = useContext(ContextProfilePage)
  return (
    [
     <AppPageRoute key={11} exact path={r.rootPath.raw}><AppPage page={NewSearchPage}/></AppPageRoute>,
     <AppPageRoute key={12} exact path={r.spaRootPath.raw}><AppPage page={NewSearchPage}/></AppPageRoute>,
     <AppPageRoute key={13} exact path={r.spaSearchPath.raw}><AppPage page={SearchPage} linearLayout={true}/></AppPageRoute>,
     <AppPageRoute key={14} exact path={r.textTranslationsPath.raw}><AppPage page={NewTextTranslation}/></AppPageRoute>,
     <AppPageRoute key={15} exact path={r.spaSearchInterpreterPath.raw}><AppPage page={ProfilePage} linearLayout={isVisibleForm}/></AppPageRoute>,
     <AppPageRoute key={16} exact path={r.spaNewOrderPath.raw}><AppPage page={NewOrderPage}/></AppPageRoute>,
     <AppPageRoute key={17} exact path={r.newTextTranslationOrderPath.raw}><AppPage page={NewTranslationOrderPage}/></AppPageRoute>,
     <AppPageRoute key={18} exact path={r.spaPhonePath.raw}><AppPage page={PhonePage}/></AppPageRoute>,
     <AppPageRoute key={33} exact path={r.spaCompletedOrderPath.raw}><AppPage page={CompletedOrder}/></AppPageRoute>,
     <AppPageRoute key={31} exact path={r.spaOrderPath.raw}><AppPage page={ShowOrderPage}/></AppPageRoute>,
     <AppPageRoute key={34} exact path={r.completedTextTranslationOrderPath.raw}><AppPage page={CompletedTranslationOrder}/></AppPageRoute>,
     <AppPageRoute key={32} exact path={r.textTranslationOrderPath.raw}><AppPage page={ShowTranslationOrderPage}/></AppPageRoute>,
   ]
  )
}

const guestAppPages = [
  <AppPageRoute key={21} exact path={r.loginPath.raw}><AppPage page={LoginPage}/></AppPageRoute>,
]

const userAppPages = [
//   <AppPageRoute key={31} exact path={r.spaOrderPath.raw}><AppPage page={ShowOrderPage}/></AppPageRoute>,
//   <AppPageRoute key={33} exact path={r.spaCompletedOrderPath.raw}><AppPage page={CompletedOrder}/></AppPageRoute>,
//   <AppPageRoute key={32} exact path={r.textTranslationOrderPath.raw}><AppPage page={ShowTranslationOrderPage}/></AppPageRoute>,
//   <AppPageRoute key={34} exact path={r.completedTextTranslationOrderPath.raw}><AppPage page={CompletedTranslationOrder}/></AppPageRoute>,
  <AppPageRoute key={35} exact path={r.spaSearchesPath.raw}><AppPage page={ClientSearch}/></AppPageRoute>,
  <AppPageRoute key={36} exact path={r.spaInterpretationCallsPath.raw}><AppPage page={ClientCall}/></AppPageRoute>,
  <AppPageRoute key={37} exact path={r.spaNewInterpretationCallPath.raw}><AppPage page={NewCall}/></AppPageRoute>,
  <AppPageRoute key={38} exact path={r.spaInterpretationCallPath.raw}><AppPage page={CallPage}/></AppPageRoute>,
  <AppPageRoute key={39} exact path={r.spaOrdersPath.raw}><AppPage page={ClientOrders}/></AppPageRoute>,
]

export default function AppPages() {
  let currentUser = useCurrentUser()
  return (
    <Switch>
      {forAllAppPages()}
      {currentUser
        ? userAppPages
        : guestAppPages
      }
      <AppPageRoute path="*"><AppPage page={NotFoundPage}/></AppPageRoute>
    </Switch>
  )
}

function NotFoundPage() {
  return <div testid="not-found-page">Not found</div>;
}

function AppPage({page: Page, linearLayout}) {
  return (
    <LocalizedPage>
      <Layout linearLayout={linearLayout}>
        <Page/>
      </Layout>
    </LocalizedPage>
  );
}
