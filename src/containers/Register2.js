import React from 'react';
import _ from 'lodash';
import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View} from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import NavigationSetting from '../navigation/NavigationSetting';
import Service from 'Hairfolio/src/services/index';
import ServiceBackend from '../backend/ServiceBackend';
import { observer } from 'mobx-react';
import Picker from '../components/Picker';

import utils from '../utils';
import appEmitter from '../appEmitter';

import UserStore from '../mobx/stores/UserStore';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import CloudinaryStore from '../mobx/stores/CloudinaryStore';


import oauthMixin from '../mixins/oauth';

import {register, signupConsumerStack, signupStylistStack, signupBrandStack, signupSalonStack, loginStack, appStack} from '../routes';

@observer
@mixin(oauthMixin)
export default class Register2 extends PureComponent {
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
      leftDisabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
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
          disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
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

              if (UserStore.registrationMethod === 'email') {
                return _.first(this.context.navigators).jumpTo(stacks[item.label]);
              }
              var type = ({
                Consumer: 'consumer',
                Stylist: 'stylist',
                Salon: 'salon',
                Brand: 'brand'
              })[item.label];

              var login;

              if (UserStore.registrationMethod === 'facebook') {
                login = EnvironmentStore.loadEnv()
                  .then(() => LoginManager.logInWithReadPermissions(['email']))
                  .then(() => AccessToken.getCurrentAccessToken())
                  .then(data => data.accessToken.toString())
                  .then(token =>
                    UserStore.signupWithFacebook(token, type)
                  ).catch(error => {
                    console.log(error);
                    debugger;
                  });
              }
              if (UserStore.registrationMethod === 'instagram') {
                login = EnvironmentStore.loadEnv()
                  .then(() => this.oauth(loginStack, {
                    authorize: 'https://api.instagram.com/oauth/authorize/',
                    clientId: EnvironmentStore.environment.insta_client_id,
                    redirectUri: EnvironmentStore.environment.insta_redirect_url,
                    type: 'Instagram',
                    scope: 'basic'
                  }))
                  .then(token => UserStore.signupWithInstagram(token, type));
              }
              debugger;
              login
                .then(
                  () => {
                    let userId = UserStore.user.id;

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
