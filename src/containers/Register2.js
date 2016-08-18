import React from 'react';
import _ from 'lodash';
import reactMixin from 'react-mixin';
import PureComponent from '../components/PureComponent';
import {View} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {registration} from '../selectors/registration';
import NavigationSetting from '../navigation/NavigationSetting';

import Picker from '../components/Form/Picker';

import {user} from '../selectors/user';
import {environment} from '../selectors/environment';

import utils from '../utils';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import {registrationActions} from '../actions/registration';

import oauthMixin from '../mixins/oauth';
import ensureEnvironmentIsReadyMixin from '../mixins/ensureEnvironmentIsReady';

import {register, signupConsumerStack, loginStack} from '../routes';

@connect(app, registration, user, environment)
@reactMixin.decorate(oauthMixin)
@reactMixin.decorate(ensureEnvironmentIsReadyMixin)
export default class Register2 extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    environment: React.PropTypes.object.isRequired,
    environmentState: React.PropTypes.string.isRequired,
    registrationMethod: React.PropTypes.string,
    userState: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired,
    setBannerError: React.PropTypes.func.isRequired
  };

  state = {};

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.last(this.context.navigators).jumpTo(register);
      }}
      leftDisabled={utils.isLoading([this.props.environmentState, this.props.userState, this.state.oauth])}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      style={{
        flex: 1,
        backgroundColor: 'transparent'
      }}
    >
      <View
        style={{flex: 1, justifyContent: 'space-between'}}
      >
        <Picker
          choices={[
            {
              label: 'Consumer'
            },
            {
              label: 'Stylist'
            },
            {
              label: 'Salon'
            },
            {
              label: 'Brand'
            }
          ]}
          disabled={utils.isLoading([this.props.environmentState, this.props.userState, this.state.oauth])}
          onDone={(item = {}) => {
            if (!item)
              return;

            switch (item.label) {
              case 'Consumer':
                if (this.props.registrationMethod === 'email')
                  _.first(this.context.navigators).jumpTo(signupConsumerStack);
                else if (this.props.registrationMethod === 'facebook')
                  this.ensureEnvironmentIsReady(() =>
                    this.oauth(loginStack, {
                      authorize: 'https://www.facebook.com/dialog/oauth',
                      clientId: this.props.environment.get('facebook_app_id'),
                      redirectUri: this.props.environment.get('facebook_redirect_url'),
                      type: 'Facebook'
                    }, token => {
                      this.props.dispatch(registrationActions.signupWithFacebook(token, 'consumer'))
                        .then(throwOnFail)
                        .then(() => {}, (e) => {
                          console.log(e);
                          this.context.setBannerError('Facebook signup failed');
                        });
                    })
                  );
                else if (this.props.registrationMethod === 'instagram')
                  this.ensureEnvironmentIsReady(() =>
                    this.oauth(loginStack, {
                      authorize: 'https://api.instagram.com/oauth/authorize/',
                      clientId: this.props.environment.get('insta_client_id'),
                      redirectUri: this.props.environment.get('insta_redirect_url'),
                      type: 'Instagram'
                    }, token => {
                      this.context.setBannerError('Instagram signup not ready');
                    })
                  );
                else
                  this.context.setBannerError(`${this.props.registrationMethod} Not Ready`);
                break;
              default:
                this.context.setBannerError(`${item.label} Not Ready`);
                break;
            }
          }}
          placeholder="Select account type"
        />
      </View>
    </NavigationSetting>);
  }
};
