import { Component } from 'react';
import {Platform} from 'react-native';
import _ from 'lodash';

function shallowEqual(objA, objB) {
  if (objA === objB)
    return true;

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null)
    return false;

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length)
    return false;

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++)
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]])
      return false;

  return true;
}

export default class Button extends Component {

  constructor(props) {
    super(props);

    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    this.render = _.wrap(this.render, (render) => {
      let isNode = ('undefined' !== typeof global) && ('[object global]' === Object.prototype.toString.call(global));
      let isWebWorker = !isNode && ('undefined' !== typeof WorkerGlobalScope) && ('function' === typeof importScripts) && (navigator instanceof WorkerNavigator);
      if (isWebWorker && global.ENABLE_RENDER_DEBUG)
        console.log(`rendering ${this.constructor.name} with`, props);
      return render.call(this);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.navigator.pop({
          animated: true,
          animationStyle: 'fade',
        })
      }
    }
  }
};
