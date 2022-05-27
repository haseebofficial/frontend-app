import React from "react";
import useVisible from "react_utils/use_visible";



export default function SearchDropdown() {
  let { isVisible, show, hide, toggle } = useVisible();


  let activityClass = isVisible ? "is-active" : "";
  let events = {onMouseEnter: show, onMouseLeave: hide, onClick: toggle};
  return (
    <React.Fragment>
      <div className="is-hidden-desktop">
        <a className="navbar-item">
              Мои поиски
        </a>
        <a className="navbar-item">
                  Мои заказы
        </a>
        <a className="navbar-item">
                  Мои звонки
        </a>
        <a className="navbar-item">
                  Личный кабинет
        </a>
        <a className="navbar-item">
                  Выход
        </a>
      </div>
      <div className={`navbar-item is-hidden-touch has-dropdown ${activityClass}`} {...events}>
        <div className="navbar-link">
             Мои поиски
        </div>
        <div className="navbar-dropdown search-dropdown">
          <a className="navbar-item">
             Мои заказы
          </a>
          <a className="navbar-item">
              Мои звонки
          </a>
          <a className="navbar-item">
              Личный кабинет
          </a>
          <a className="navbar-item">
              Выход
          </a>
        </div>
      </div>
    </React.Fragment>
  );
}
