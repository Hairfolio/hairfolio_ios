// Redux
import {createStore, compose, applyMiddleware} from 'redux';
import _ from 'lodash';
import promiseMiddleware from './lib/reduxPromiseMiddleware';
import createDependencies from './lib/injectDependencies';
import { batchedSubscribe } from './lib/reduxBatchedSubscribe';

import {InteractionManager} from 'react-native';

// Top level reducer
import rootReducer from './reducers';
import services from './services';

// Dependencies middleware detects all actionsCreators that return function
// instead of a Flux Standard Action. In that case, that function is given
// the object of registered dependencies + getState,
// so it can destruct it and use services it needs to fullfill requests
// See auth/actions.js for an example
const dependenciesMiddleware = createDependencies({
  services
});


var imBatch;

const finalStore = compose(
  applyMiddleware(
    dependenciesMiddleware,
    promiseMiddleware({
      promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']
    })
  ),
  batchedSubscribe((action, notify) => {
    var safeNotify = () => {
      if (imBatch) {
        imBatch.cancel();
        imBatch = null;
      }
      notify();
    };

    if (_.get(action, 'meta.silent'))
      return;

    if (_.get(action, 'meta.immediate') && !action.asyncResult)
      return safeNotify();

    if (_.get(action, 'meta.immediateAsyncResult') && action.asyncResult)
      return safeNotify();

    if (imBatch)
      return;

    imBatch = InteractionManager.runAfterInteractions(() => {
      imBatch = null;
      safeNotify();
    });
  })
)(createStore);

// Store can now be imported from any file,
// e.g. import store from '../store';
// const isLoggedIn = !!store.getState().user.token;
export default finalStore(rootReducer);
