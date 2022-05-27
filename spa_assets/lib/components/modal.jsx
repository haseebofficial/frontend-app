import React from "react";
const { Provider, Consumer } = React.createContext(undefined);

export default function Modal(props) {
  if (props.shown) {
    let hide = (e) => {
      if (e && e.target !== e.currentTarget) {
        return false;
      } else {
        return props.hide();
      }
    };
    
    return (
      <Provider value={{hide}}>
        <div className="window-cover" testid="window-cover" onClick={hide}>
          <div className="popup">
            {props.children}
          </div>
        </div>
      </Provider>
    );
  } else {
    return null;
  }
}

Modal.Header = function Header(props) {
  return (
    <Consumer>
      {context => 
        <div className="popup-header">
          {props.children}
          <div className="close-popup" testid="header-close-popup" onClick={context.hide}>&times;</div>
        </div>
      }
    </Consumer>
  );
};

Modal.Body = function Body(props) {
  return (
    <div className="popup-body">
      {props.children}
    </div>
  );
};

Modal.Footer = function Footer(props) {
  return (
    <div className="popup-footer">
      {props.children}
    </div>
  );
};
