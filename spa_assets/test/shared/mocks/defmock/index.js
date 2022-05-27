import sinon from "sinon";

export default function defmock(TemplateClass) {
  let publicMethods = getPublicMethods(TemplateClass);

  let className = `${TemplateClass.name}Mock`;
  return createMockClass(className, publicMethods);
}

function getPublicMethods(Class) {
  return Object
    .getOwnPropertyNames(Class.prototype)
    .filter(m => { 
      return !m.startsWith("_") && m !== "constructor";
    });
}

function createMockClass(className, methods) {
  let methodsContainer;
  let createdInstances = [];

  let resetMethodsContainer = () => {
    methodsContainer = new MockedMethodsContainer(className, methods); // T
  };

  resetMethodsContainer();

  class Mock {
    static expects(methodName) {
      return methodsContainer.addExpectation(methodName);
    }

    expects(methodName) {
      return this._methodsContainer.addExpectation(methodName);
    }

    static resetExpectation(methodName) {
      methodsContainer.resetExpectation(methodName);
    }

    resetExpectation(methodName) {
      this._methodsContainer.resetExpectation(methodName);
    }

    static verifyAll() {
      try {
        methodsContainer.verifyAll();

        for (let instance of createdInstances) {
          instance._methodsContainer.verifyAll();
        }
      } finally {
        resetMethodsContainer();
        createdInstances = [];
      }
    }

    constructor() {
      this._methodsContainer = methodsContainer;

      for (let methodName of methods) {
        this[methodName] = function() {
          return this._methodsContainer.getMethod(methodName)(...arguments);
        }.bind(this);
      }

      resetMethodsContainer();
      createdInstances.push(this);
    }
  }

  Object.defineProperty(Mock, 'name', {value: className});

  return Mock;
}

class MockedMethodsContainer {
  constructor(className, methods) {
    this._className = className;
    this._allMethods = methods;

    this._expectations = {};
  }

  addExpectation(methodName) {
    let fullMethodName = this._fullNameFor(methodName);

    if (!this._allMethods.includes(methodName)) {
      throw new Error(`Cannot define expectation for ${fullMethodName}, no such method found in the original class`);
    }

    let currentExpectation = this._expectations[methodName];

    if (currentExpectation) {
      throw new Error(`Expectation for ${fullMethodName} was already defined`);
    } else {    
      let expectation = sinon.expectation.create(fullMethodName);
      this._expectations[methodName] = expectation;

      return expectation;
    }
  }

  resetExpectation(methodName) {
    let currentExpectation = this._expectations[methodName];

    if (currentExpectation) {
      delete this._expectations[methodName];
    } else {
      throw new Error(`Cannot reset expectation because none was defined for ${this._fullNameFor(methodName)}`);
    }
  }

  verifyAll() {
    for (let methodName in this._expectations) {
      let expectation = this._expectations[methodName];

      expectation.verify();
    }
  }

  getMethod(methodName) {
    let expectation = this._expectations[methodName];

    if (expectation) {
      return expectation;
    } else {
      return this._createDefaultMethod(methodName);
    }
  }

  _createDefaultMethod(methodName) {
    return () => {
      throw new Error(`No expectations defined for ${this._fullNameFor(methodName)}`);
    };
  }

  _fullNameFor(methodName) {
    return `${this._className}#${methodName}`;
  }
}