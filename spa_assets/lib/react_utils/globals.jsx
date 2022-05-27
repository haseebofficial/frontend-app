import React from "react";
import { Provider as StoreProvider, connect } from "react-redux";

const { Provider, Consumer } = React.createContext(undefined);

export function GlobalsProvider(props) {
  let { children: children, ...globals } = props;

  if (globals.store) {
    return <StoreProvider store={globals.store}>
      <Provider value={globals}>{children}</Provider>
    </StoreProvider>;
  } else {
    return <Provider value={globals}>{children}</Provider>;
  }
}

export function consumeGlobals(Component, mapStateToProps) {
  function GlobalsConsumer(props) {
    return <Consumer>
      {function(value) {
        if (value && value.store) {
          let { store: _store, ...globals } = value;

          Component = connectComponent(Component, mapStateToProps);
          return componentWithGlobals(Component, props, globals);
        } else {
          let globals = value;
          return componentWithGlobals(Component, props, globals);
        }
      }}
    </Consumer>;
  }

  return GlobalsConsumer;
}

function connectComponent(Component, mapStateToProps) {
  if (mapStateToProps) {
    return connect(mapStateToProps)(Component);
  } else {
    return connect()(Component);
  }
}

function componentWithGlobals(Component, props, globals) {
  return <Component {...globals} {...props}/>;
}