import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, Text, TouchableOpacity, InteractionManager} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import SimpleButton from '../components/Buttons/Simple';

import {register, forgottenPasswordStack, loginEmail, loginOAuth, oauthStack, loginStack} from '../routes';

@connect(app)
export default class Login extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired,
    setBannerError: React.PropTypes.func.isRequired
  };

  oauth(options, callback) {
    loginOAuth.scene().prepare(options, (err, token) => {
      _.first(this.context.navigators).jumpTo(loginStack);

      if (err)
        InteractionManager.runAfterInteractions(() =>
          this.context.setBannerError(err)
        );
      else {
        _.first(this.context.navigators).jumpTo(loginStack);
        callback(token);
      }
    });
    _.first(this.context.navigators).jumpTo(oauthStack);
  }

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.last(this.context.navigators).jumpTo(register);
      }}
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
              icon="facebook"
              label="Sign In with Facebook"
              onPress={() => this.oauth({
                authorize: 'https://www.facebook.com/dialog/oauth',
                clientId: '653107098196959',
                redirectUri: 'https://www.facebook.com/connect/login_success.html',
                type: 'Facebook'
              }, token => {
                console.log(token);
              })}
            />
          </View>
          <View style={{paddingBottom: 10}}>
            <SimpleButton
              color={COLORS.IG}
              icon="instagram"
              label="Sign In with Instagram"
              onPress={() => this.oauth({
                authorize: 'https://api.instagram.com/oauth/authorize/',
                clientId: '8d59a9fc913e4fb08d89e14c7de1b651',
                redirectUri: 'http://hairfolio.com/login-ig',
                type: 'Instagram'
              }, token => {
                console.log(token);
              })}
            />
          </View>
          <View style={{paddingBottom: SCALE.h(54)}}>
            <SimpleButton
              color={COLORS.DARK}
              icon="email"
              label="Sign In with email"
              onPress={() => {
                _.last(this.context.navigators).jumpTo(loginEmail);
              }}
            />
          </View>
          <TouchableOpacity
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
          </TouchableOpacity>
        </View>
        <TouchableOpacity
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
        </TouchableOpacity>
      </View>
    </NavigationSetting>);
  }
};
