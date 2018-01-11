import React from 'react';
import _ from 'lodash';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import SimpleButton from '../components/Buttons/Simple';
import CustomTouchableOpacity from '../components/CustomTouchableOpacity';

import utils from '../utils';
import appEmitter from '../appEmitter';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import EnvironmentStore from '../mobx/stores/EnvironmentsStore';
import UserStore from '../mobx/stores/UserStore';

import oauthMixin from '../mixins/oauth';

import {register, forgottenPasswordStack, loginEmail, loginStack, appStack} from '../routes';

@mixin(oauthMixin)
export default class Login extends PureComponent {
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
        <View>
          <View style={{paddingBottom: 10}}>
            <SimpleButton
              color={COLORS.FB}
              disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
              icon="facebook"
              label="Sign In with Facebook"
              onPress={() =>
                EnvironmentStore.get().then(throwOnFail)
                  .then(() => LoginManager.logInWithReadPermissions(['email']))
                  .then(() => AccessToken.getCurrentAccessToken())
                  .then(data => data.accessToken.toString())
                  .then(token => UserStore.loginWithFacebook(token).then(throwOnFail))
                  .then(
                    () => {
                      appEmitter.emit('login');
                      _.first(this.context.navigators).jumpTo(appStack);
                    },
                    (e) => {
                      console.log(e);
                      this.context.setBannerError(e);
                    }
                  )
              }
            />
          </View>
          <View style={{paddingBottom: 10}}>
            <SimpleButton
              color={COLORS.IG}
              disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
              icon="instagram"
              label="Sign In with Instagram"
              onPress={() =>
                EnvironmentStore.get().then(throwOnFail)
                  .then(() => this.oauth(loginStack, {
                    authorize: 'https://api.instagram.com/oauth/authorize/',
                    clientId: EnvironmentStore.environment.insta_client_id,
                    redirectUri: EnvironmentStore.environment.insta_redirect_url,
                    type: 'Instagram',
                    scope: 'basic'
                  }))
                  .then(token => UserStore.loginWithInstagram(token).then(throwOnFail))
                  .then(
                    () => {
                      appEmitter.emit('login');
                      _.first(this.context.navigators).jumpTo(appStack);
                    },
                    (e) => {
                      console.log(e);
                      this.context.setBannerError(e);
                    }
                  )
              }
            />
          </View>
          <View style={{paddingBottom: SCALE.h(54)}}>
            <SimpleButton
              color={COLORS.DARK}
              disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
              icon="email"
              label="Sign In with email"
              onPress={() => {
                _.last(this.context.navigators).jumpTo(loginEmail);
              }}
            />
          </View>
          <CustomTouchableOpacity
            disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
            onPress={() => {
              _.first(this.context.navigators).jumpTo(forgottenPasswordStack);
            }}
          >
            <Text style={{
              fontFamily: FONTS.MEDIUM,
              fontSize: SCALE.h(28),
              color: COLORS.WHITE,
              textAlign: 'center'
            }}>Forgot your password?</Text>
          </CustomTouchableOpacity>
        </View>
        <CustomTouchableOpacity
          disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
          onPress={() => {
            _.last(this.context.navigators).jumpTo(register);
          }}
        >
          <Text style={{
            fontFamily: FONTS.MEDIUM,
            fontSize: SCALE.h(28),
            color: COLORS.WHITE,
            textAlign: 'center'
          }}>Don’t Have an Account? <Text style={{fontFamily: FONTS.HEAVY}}>Sign up</Text></Text>
        </CustomTouchableOpacity>
      </View>
    </NavigationSetting>);
  }
};
