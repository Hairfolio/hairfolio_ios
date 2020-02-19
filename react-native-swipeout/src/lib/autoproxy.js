'use strict';

import _ from 'lodash';

// from ide/autoproxy but with lifeCycleMethods fix

function autoproxy(decorator) {
  return function(target) {
    var decoratedTarget = decorator(target);
    if (decoratedTarget !== target) {
      proxyProperties(decoratedTarget, target);
      proxyProperties(decoratedTarget.prototype, target.prototype);
    }
    return decoratedTarget;
  };
}

var lifeCycleMethods = [
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount'
];

function proxyProperties(target, source) {
  var propertyNames = Object.getOwnPropertyNames(source);
  propertyNames.forEach(function(name) {
    if (name in target || lifeCycleMethods.indexOf(name) !== -1) {
      return;
    }

    var descriptor = Object.getOwnPropertyDescriptor(source, name);
    Object.defineProperty(target, name, {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      get: function() {
        if (_.isFunction(source[name]))
          return source[name].bind(this.getWrappedInstance());
        return source[name];
      },
      set: function(value) {
        source[name] = value;
      },
    });
  });
}

export default autoproxy;
