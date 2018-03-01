import React from 'react';
import _ from 'lodash';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
// import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS, SCALE, h } from '../style';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import SimpleButton from '../components/Buttons/Simple';
import CustomTouchableOpacity from '../components/CustomTouchableOpacity';
import { Dims, READY, LOADING_ERROR } from '../constants';
import NavigatorStyles from '../common/NavigatorStyles';
import utils from '../utils';
import { LOADING } from '../constants';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import UserStore from '../mobx/stores/UserStore';
import OAuthStore from '../mobx/stores/OAuthStore';
import Intro from '../components/Intro';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dims.deviceHeight,
    width: Dims.deviceWidth,
  },
  buttonContainer: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: h(42),
    width: h(383),
    marginBottom: 30,
  },
});

@observer
export default class Login extends PureComponent {
  state = {};

  constructor(props) {
    super(props);
    reaction(
      () => OAuthStore.token,
      () => {
        if (OAuthStore.status === READY) {
          UserStore.loginWithInstagram(OAuthStore.token);
          OAuthStore.reset();
        }
      }
    );
  }

  render() {
    return (
      <Image
        resizeMode="cover"
        source={require('../images/onboarding.jpg')}
        style={styles.backgroundContainer}
      >
      <View
        style={styles.container}
      >
        <View style={styles.buttonContainer}>
          <Image
            style={styles.logo}
            source={require('img/onboarding_logo.png')}
          />
          <View style={{paddingBottom: 10, alignSelf: 'stretch'}}>
            <SimpleButton
              color={COLORS.FB}
              disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
              icon="facebook"
              label="Sign In with Facebook"
              onPress={() => {
                EnvironmentStore.loadEnv()
                  .then(() => LoginManager.logInWithReadPermissions(['email']))
                  .then(() => AccessToken.getCurrentAccessToken())
                  .then(data => data.accessToken.toString())
                  .then(token => UserStore.loginWithFacebook(token))
                  .catch((e) => {
                    this.context.setBannerError(e);
                  });
              }}
            />
          </View>
          <View style={{paddingBottom: 10, alignSelf: 'stretch'}}>
            <SimpleButton
              color={COLORS.IG}
              disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
              icon="instagram"
              label="Sign In with Instagram"
              onPress={() => {
                OAuthStore.setInstagramOauthConfig().then(() =>{
                  this.props.navigator.push({
                    screen: 'hairfolio.LoginOAuth',
                    title: 'Instagram',
                    navigatorStyle: NavigatorStyles.basicInfo,
                  });
                })
              }}
            />
          </View>
          <View style={{paddingBottom: SCALE.h(54), alignSelf: 'stretch'}}>
            <SimpleButton
              color={COLORS.DARK}
              disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
              icon="email"
              label="Sign In with email"
              onPress={() => {
                this.props.navigator.push({
                  screen: 'hairfolio.LoginEmail',
                  animationType: 'fade',
                  navigatorStyle: NavigatorStyles.onboarding,
                });
              }}
            />
          </View>
          <CustomTouchableOpacity
            disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
            onPress={() => {
              this.props.navigator.push({
                screen: 'hairfolio.ForgotPassword',
                navigatorStyle: NavigatorStyles.basicInfo,
                title: 'Forgot Password',
              });
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
            this.props.navigator.resetTo({
              screen: 'hairfolio.Register',
              animationType: 'fade',
              navigatorStyle: NavigatorStyles.onboarding,
            });
          }}
        >
          <Text style={{
            fontFamily: FONTS.MEDIUM,
            fontSize: SCALE.h(28),
            color: COLORS.WHITE,
            textAlign: 'center',
            marginBottom: 10,
          }}>Don’t Have an Account? <Text style={{fontFamily: FONTS.HEAVY}}>Sign up</Text></Text>
        </CustomTouchableOpacity>
      </View>
      </Image>
    );
  }
};
