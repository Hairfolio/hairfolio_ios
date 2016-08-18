import utils from '../utils';
import {registrationActions} from '../actions/registration';
import {throwOnFail} from '../lib/reduxPromiseMiddleware';

export default {
  ensureEnvironmentIsReady(callback) {
    if (utils.isReady(this.props.environmentState))
      return callback();

    this.props.dispatch(registrationActions.getEnvironment())
      .then(throwOnFail)
      .then(callback, () => this.context.setBannerError('Something went wrong...'));
  }
};
