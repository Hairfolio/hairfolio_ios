import React from 'react';
import _ from 'lodash';
import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View} from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {registration} from '../selectors/registration';
import NavigationSetting from '../navigation/NavigationSetting';
import Service from 'Hairfolio/src/services/index.js'
import ServiceBackend from 'backend/ServiceBackend.js'

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
            setTimeout(() => {
              if (!item)
                return;

              var stacks = {
                Consumer: signupConsumerStack,
                Stylist: signupStylistStack,
                Salon: signupSalonStack,
                Brand: signupBrandStack
              };

              if (this.props.registrationMethod === 'email')
                return _.first(this.context.navigators).jumpTo(stacks[item.label]);

              var type = ({
                Consumer: 'consumer',
                Stylist: 'stylist',
                Salon: 'salon',
                Brand: 'brand'
              })[item.label];

              var login;

              if (this.props.registrationMethod === 'facebook')
                login = this.props.dispatch(registrationActions.getEnvironment()).then(throwOnFail)
                  .then(() => LoginManager.logInWithReadPermissions(['email']))
                  .then(() => AccessToken.getCurrentAccessToken())
                  .then(data => data.accessToken.toString())
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


                    let userId = Service.fetch.store.getState().user.data.get('id');

                    // update type
                    ServiceBackend.put('users/' + userId,
                      {
                        user: {
                          account_type: type
                        }
                      }
                    );


                    appEmitter.emit('login');
                    if (type === 'consumer')
                      return _.first(this.context.navigators).jumpTo(appStack);

                    var stack = stacks[item.label];
                    stack.scene().jumpToMoreInfos();

                    _.first(this.context.navigators).jumpTo(stack);
                  },
                  (e) => {
                    this.context.setBannerError(e);
                  }
                );
            }, 100);
          }}
          placeholder="Select account type"
        />
      </View>
    </NavigationSetting>);
  }
};
