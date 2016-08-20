import React from 'react';
import _ from 'lodash';
import reactMixin from 'react-mixin';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import SimpleButton from '../components/Buttons/Simple';
import CustomTouchableOpacity from '../components/CustomTouchableOpacity';

import utils from '../utils';
import appEmitter from '../appEmitter';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import {registrationActions} from '../actions/registration';
import {environment} from '../selectors/environment';
import {user} from '../selectors/user';

import oauthMixin from '../mixins/oauth';

import {register, forgottenPasswordStack, loginEmail, loginStack, appStack} from '../routes';

@connect(app, environment, user)
@reactMixin.decorate(oauthMixin)
export default class Login extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    environment: React.PropTypes.object.isRequired,
    environmentState: React.PropTypes.string.isRequired,
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
        <View>
          <View style={{paddingBottom: 10}}>
            <SimpleButton
              color={COLORS.FB}
              disabled={utils.isLoading([this.props.environmentState, this.props.userState, this.state.oauth])}
              icon="facebook"
              label="Sign In with Facebook"
              onPress={() =>
                this.props.dispatch(registrationActions.getEnvironment()).then(throwOnFail)
                  .then(() => this.oauth(loginStack, {
                    authorize: 'https://www.facebook.com/dialog/oauth',
                    clientId: this.props.environment.get('facebook_app_id'),
                    redirectUri: this.props.environment.get('facebook_redirect_url'),
                    scope: 'email',
                    type: 'Facebook'
                  }))
                  .then(token => this.props.dispatch(registrationActions.loginWithFacebook(token)).then(throwOnFail))
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
              disabled={utils.isLoading([this.props.environmentState, this.props.userState, this.state.oauth])}
              icon="instagram"
              label="Sign In with Instagram"
              onPress={() =>
                this.props.dispatch(registrationActions.getEnvironment()).then(throwOnFail)
                  .then(() => this.oauth(loginStack, {
                    authorize: 'https://api.instagram.com/oauth/authorize/',
                    clientId: this.props.environment.get('insta_client_id'),
                    redirectUri: this.props.environment.get('insta_redirect_url'),
                    type: 'Instagram',
                    scope: 'basic'
                  }))
                  .then(token => this.props.dispatch(registrationActions.loginWithInstagram(token)).then(throwOnFail))
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
              disabled={utils.isLoading([this.props.environmentState, this.props.userState, this.state.oauth])}
              icon="email"
              label="Sign In with email"
              onPress={() => {
                _.last(this.context.navigators).jumpTo(loginEmail);
              }}
            />
          </View>
          <CustomTouchableOpacity
            disabled={utils.isLoading([this.props.environmentState, this.props.userState, this.state.oauth])}
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
          disabled={utils.isLoading([this.props.environmentState, this.props.userState, this.state.oauth])}
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
