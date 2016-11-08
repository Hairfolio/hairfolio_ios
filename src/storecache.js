import _ from 'lodash';
import {Settings, InteractionManager, NativeModules, Platform} from 'react-native';

function save(toSave) {
  if (Platform.OS === 'ios')
    return Settings.set(toSave);

  NativeModules.StoreManager.setValues(_.mapValues(toSave, v =>
    v ? JSON.stringify(v) : ''
  ));
}

function value(v) {
  if (Platform.OS === 'ios')
    return v;
  return JSON.parse(v);
}

var queued = false;
var runAfters = [];

export function runAfterSave(fn) {
  if (!queued)
    return fn();
  runAfters.push(fn);
}

export default function(store, initialState, toBeSaved, reviveState) {
  var initialStateFormatted;
  try {
    initialStateFormatted = _.reduce(initialState, (initialStateFormatted, v, key) => {
      return _.set(initialStateFormatted, key, value(v));
    }, {}).cache;
  } catch (e) {
    console.log(e);
    initialStateFormatted = {};
  }

  var state, oldState;

  store.subscribeImmediate(() => {
    if (queued)
      return;
    queued = true;
    InteractionManager.runAfterInteractions(() => {
      queued = false;

      state = store.getState();
      // so it won't save on the first run declenched by the
      // revive state
      oldState = oldState || state;

      var toSave = _.reduce(toBeSaved, (toSave, v, key) => {
        var statePath = key.split('.');

        var newValue = _.get(state, statePath);
        var oldValue = _.get(oldState, statePath);

        if (newValue === oldValue)
          return toSave;

        toSave['cache.' + key] = newValue && v(newValue);

        return toSave;
      }, {});

      if (!_.isEmpty(toSave)) {
        console.log('saving cache');
        save(toSave);
      }

      oldState = state;

      while (runAfters.length)
        runAfters.shift()();
    });
  });

  try {
    store.dispatch(reviveState(initialStateFormatted));
  } catch (e) {
    console.log(e);
    store.dispatch(reviveState({}));
  }
};
