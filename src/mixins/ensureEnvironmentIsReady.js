import utils from '../utils';
import {registrationActions} from '../actions/registration';
import {throwOnFail} from '../lib/reduxPromiseMiddleware';

export default {
  ensureEnvironmentIsReady(callback) {
    if (utils.isReady(this.props.environmentState))
      return Promise.resolve(this.props.environment);

    return this.props.dispatch(registrationActions.getEnvironment())
      .then(throwOnFail);
  }
};
