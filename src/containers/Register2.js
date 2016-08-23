import React from 'react';
import _ from 'lodash';
import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {registration} from '../selectors/registration';
import NavigationSetting from '../navigation/NavigationSetting';

import Picker from '../components/Picker';

import {user} from '../selectors/user';
import {environment} from '../selectors/environment';

import utils from '../utils';
import appEmitter from '../appEmitter';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import {registrationActions} from '../actions/registration';

import oauthMixin from '../mixins/oauth';

import {register, signupConsumerStack, signupStylistStack, signupBrandStack, signupSalonStack, loginStack, appStack} from '../routes';

@connect(app, registration, user, environment)
@mixin(oauthMixin)
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

            if (this.props.registrationMethod === 'email')
              return _.first(this.context.navigators).jumpTo(({
                Consumer: signupConsumerStack,
                Stylist: signupStylistStack,
                Salon: signupSalonStack,
                Brand: signupBrandStack
              })[item.label]);

            var type = ({
              Consumer: 'consumer',
              Stylist: 'stylist',
              Salon: 'salon',
              Brand: 'brand'
            })[item.label];

            if (type !== 'consumer')
              return this.context.setBannerError(`${item.label} not ready`);

            var login;

            if (this.props.registrationMethod === 'facebook')
              login = this.props.dispatch(registrationActions.getEnvironment()).then(throwOnFail)
                .then(() => this.oauth(loginStack, {
                  authorize: 'https://www.facebook.com/dialog/oauth',
                  clientId: this.props.environment.get('facebook_app_id'),
                  redirectUri: this.props.environment.get('facebook_redirect_url'),
                  scope: 'email',
                  type: 'Facebook'
                }))
                .then(token =>
                  this.props.dispatch(registrationActions.signupWithFacebook(token, type))
                    .then(throwOnFail)
                );

            if (this.props.registrationMethod === 'instagram')
              login = this.props.dispatch(registrationActions.getEnvironment()).then(throwOnFail)
                .then(() => this.oauth(loginStack, {
                  authorize: 'https://api.instagram.com/oauth/authorize/',
                  clientId: this.props.environment.get('insta_client_id'),
                  redirectUri: this.props.environment.get('insta_redirect_url'),
                  type: 'Instagram',
                  scope: 'basic'
                }))
                .then(token => this.props.dispatch(registrationActions.signupWithInstagram(token, type))
                  .then(throwOnFail)
                );

            login
              .then(
                () => {
                  appEmitter.emit('login');
                  _.first(this.context.navigators).jumpTo(appStack);
                },
                (e) => {
                  console.log(e);
                  this.context.setBannerError(e);
                }
              );
          }}
          placeholder="Select account type"
        />
      </View>
    </NavigationSetting>);
  }
};
