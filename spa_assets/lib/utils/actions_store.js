export default class ActionsStore {
  constructor() {
    this._actions = {};
  }

  addAction(name, action) {
    if (this._actions[name]) {
      throw (`Action ${name} is already stored`);
    }

    this._actions[name] = action;
  }

  getAction(name) {
    return this._actions[name];
  }

  addActions(names, action) {
    names.forEach(name => this.addAction(name, action));
  }
}