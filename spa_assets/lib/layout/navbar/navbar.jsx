import "layout/_styles/navbar/navbar.scss";
import logo from "vendor/images/logo.png";
import React from "react";
import { useCurrentUser } from "login/login_state";
import useVisible from "react_utils/use_visible";
import { Link } from "react-router-dom";
import routes from "app/routes";
import { SupportLink, EditUserLink, AccountLink, SearchesLink, CallsLink, SigninLink, OrdersLink } from "layout/navbar/links/static_links";
import CurrenciesDropdown from "layout/navbar/links/currencies_dropdown";
import ButtonSearch from "layout/navbar/links/button_search";
import SignoutLink from "layout/navbar/links/signout_link";
import PreviousPageLink from "layout/navbar/links/previous_page_link";
import LanguagesDropdown from "layout/navbar/links/languages_dropdown";
import SearchDropdown from "layout/navbar/links/search_dropdown";
import globeIcon from "vendor/images/globe.png"
import menuIcon from "vendor/images/menu.png"
import LayoutService from "../layout_service";
import LayoutBody from "../layout_body";

export default function LayoutNavbar({linearLayout=false}) {
  let currentUser = useCurrentUser();
  let {isVisible, toggle} = useVisible();
  let activityClass = isVisible ? "is-active" : "";

  return (
    <div className="hero-head">
      <div className={linearLayout ? "container-linear" : "container"}>
        <nav className={linearLayout ? "navbar navbar-header navbar-header-linear" : "navbar navbar-header"}>
          <div className="navbar-brand">
            <Link to={routes.rootPath()} className="navbar-item logo-item">
              <img src={logo}/>
            </Link>
            <div className="is-hidden-desktop">
              <ButtonSearch />
            </div>
            
            <div className={`mobile-burger ${activityClass}`} onClick={toggle}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
            <div className="is-hidden-touch">
              <div className="centered">
                <ButtonSearch />
              </div>
            </div>
          <div className={`navbar-menu ${activityClass}`}>
            <div className="navbar-end">
              <div className="is-hidden-desktop">
                <PreviousPageLink/>
              </div>
              {currentUser ? <UserNavbarLinks/> : <GuestNavbarLinks/>}
              {/* <UserNavbarLinks/> */}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

function GuestNavbarLinks() {
  return (
    <React.Fragment>
      <div className="is-hidden-touch icons-menu">
        <NavbarLinksGlobe />
        <GuestNavbarLinksMenu />
      </div>
      <div className="is-hidden-desktop">
        <LanguagesDropdown/>
        <CurrenciesDropdown/>
        <SupportLink/>
        <SigninLink/>
        {/* <SearchDropdown/> */}
      </div>
    </React.Fragment>
  );
}
function NavbarLinksGlobe() {
  let { isVisible, show, hide, toggle } = useVisible();

  let activityClass = isVisible ? "is-active" : "";
  let events = {onMouseEnter: show, onMouseLeave: hide, onClick: toggle};
  return (
    <React.Fragment>
      <div className="navbar-item" >
        <div className={`navbar-item ${activityClass}`} {...events}>
          <div className="navbar-link-icon">
            <img src={globeIcon} alt="globe-icon" className="globe-icon" />
          </div>
          <div className="navbar-dropdown">
            <LanguagesDropdown/>
            <CurrenciesDropdown/>
          </div>
        </div>
        
      </div>
    </React.Fragment>
  );
}
function GuestNavbarLinksMenu() {
  let { isVisible, show, hide, toggle } = useVisible();

  let activityClass = isVisible ? "is-active" : "";
  let events = {onMouseEnter: show, onMouseLeave: hide, onClick: toggle};
  return (
    <React.Fragment>
      <div className="navbar-item" >
        <div className={`navbar-item has-dropdown ${activityClass}`} {...events}>
          <div className="navbar-link-icon">
            <img src={menuIcon} alt="menu-icon" className="menu-icon" />
          </div>
          <div className="navbar-dropdown">
            <SupportLink/>
            <SigninLink/>
          </div>
        </div>
        
      </div>
    </React.Fragment>
  );
}

function UserNavbarLinks() {
  return (
    <React.Fragment>
      <div className="is-hidden-touch icons-menu">
        <NavbarLinksGlobe />
        <UserNavbarLinksMenu />
      </div>
      <div className="is-hidden-desktop">
        <LanguagesDropdown/>
        <CurrenciesDropdown/>
        {/* <SearchDropdown/> */}
        <EditUserLink/>
        <SearchesLink/>
        <OrdersLink />
        <CallsLink/>
        <SupportLink/>
        <SignoutLink/>
      </div>
    </React.Fragment>
  );
}

function UserNavbarLinksMenu() {
  let { isVisible, show, hide, toggle } = useVisible();

  let activityClass = isVisible ? "is-active" : "";
  let events = {onMouseEnter: show, onMouseLeave: hide, onClick: toggle};
  return (
    <React.Fragment>
      <div className="navbar-item" >
        <div className={`navbar-item has-dropdown ${activityClass}`} {...events}>
          <div className="navbar-link-icon">
            <img src={menuIcon} alt="menu-icon" className="menu-icon" />
          </div>
          <div className="navbar-dropdown">
            <EditUserLink/>
            {/* <AccountLink/> */}
            <SearchesLink/>
            <OrdersLink />
            <CallsLink/>
            <SupportLink/>

            <SignoutLink/>
          </div>
        </div>
        
      </div>
    </React.Fragment>
  );
}
