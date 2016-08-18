import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import SimpleButton from '../components/Buttons/Simple';
import CustomTouchableOpacity from '../components/CustomTouchableOpacity';

import utils from '../utils';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import {registrationActions} from '../actions/registration';
import {environment} from '../selectors/environment';
import {user} from '../selectors/user';

import {LOADING} from '../constants';

import {register, forgottenPasswordStack, loginEmail, loginOAuth, oauthStack, loginStack} from '../routes';

@connect(app, environment, user)
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

  oauth(options, callback) {
    this.setState({oauth: LOADING});

    loginOAuth.scene().prepare(options, (err, token) => {
      _.first(this.context.navigators).jumpTo(loginStack, () => {
        this.setState({oauth: null});

        if (err)
          this.context.setBannerError(err);
        else
          callback(token);
      });
    });
    _.first(this.context.navigators).jumpTo(oauthStack);
  }

  ensureEnvironmentIsReady(callback) {
    if (utils.isReady(this.props.environmentState))
      return callback();

    this.props.dispatch(registrationActions.getEnvironment())
      .then(throwOnFail)
      .then(callback, () => this.context.setBannerError('Something went wrong...'));
  }

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
              onPress={() => this.ensureEnvironmentIsReady(() =>
                this.oauth({
                  authorize: 'https://www.facebook.com/dialog/oauth',
                  clientId: this.props.environment.get('facebook_app_id'),
                  redirectUri: this.props.environment.get('facebook_redirect_url'),
                  type: 'Facebook'
                }, token => {
                  this.props.dispatch(registrationActions.loginWithFacebook(token))
                    .then(throwOnFail)
                    .then(() => {}, (e) => {
                      console.log(e);
                      this.context.setBannerError('Facebook login failed');
                    });
                })
              )}
            />
          </View>
          <View style={{paddingBottom: 10}}>
            <SimpleButton
              color={COLORS.IG}
              disabled={utils.isLoading([this.props.environmentState, this.props.userState, this.state.oauth])}
              icon="instagram"
              label="Sign In with Instagram"
              onPress={() => this.ensureEnvironmentIsReady(() =>
                this.oauth({
                  authorize: 'https://api.instagram.com/oauth/authorize/',
                  clientId: this.props.environment.get('insta_client_id'),
                  redirectUri: this.props.environment.get('insta_redirect_url'),
                  type: 'Instagram'
                }, token => {
                  this.context.setBannerError('Instagram login not ready');
                })
              )}
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
