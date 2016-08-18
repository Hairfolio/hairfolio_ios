import _ from 'lodash';
import {LOADING} from '../constants';

import {loginOAuth, oauthStack} from '../routes';

export default {
  oauth(destStack, options, callback) {
    this.setState({oauth: LOADING});

    return new Promise((resolve, reject) => {
      loginOAuth.scene().prepare(options, (err, token) => {
        _.first(this.context.navigators).jumpTo(destStack, () => {
          this.setState({oauth: null});

          if (err)
            reject(err);
          else
            resolve(token);
        });
      });
      _.first(this.context.navigators).jumpTo(oauthStack);
    });
  }
};
