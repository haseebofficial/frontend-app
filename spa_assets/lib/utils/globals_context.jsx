import React from "react";

const {Provider, Consumer} = React.createContext(undefined);

export { Provider as GlobalsProvider };

export function globalsToProps(Component) {
  function GlobalsConsumerHOC(props) {
    return <Consumer>
      {globals => <Component globals={globals} {...globals} {...props}/>}
    </Consumer>;
  }

  GlobalsConsumerHOC.displayName =  Component.displayName || Component.name || "Component";

  return  GlobalsConsumerHOC;
}