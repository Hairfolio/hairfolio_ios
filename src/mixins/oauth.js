import _ from 'lodash';
import {LOADING} from '../constants';

import {loginOAuth, oauthStack} from '../routes';

export default {
  oauth(destStack, options, callback) {
    this.setState({oauth: LOADING});

    loginOAuth.scene().prepare(options, (err, token) => {
      _.first(this.context.navigators).jumpTo(destStack, () => {
        this.setState({oauth: null});

        if (err)
          this.context.setBannerError(err);
        else
          callback(token);
      });
    });
    _.first(this.context.navigators).jumpTo(oauthStack);
  }
};
