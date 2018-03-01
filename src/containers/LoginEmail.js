import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import { mixin } from 'core-decorators';
import PureComponent from '../components/PureComponent';
import RN, { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONTS, SCALE, h } from '../style';
import { observer } from 'mobx-react';
import TextInput from '../components/Form/TextInput';
import SimpleButton from '../components/Buttons/Simple';
import CustomTouchableOpacity from '../components/CustomTouchableOpacity';
import formMixin from '../mixins/form';
import utils from '../utils';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import UserStore from '../mobx/stores/UserStore';
import { Dims } from '../constants';
import NavigatorStyles from '../common/NavigatorStyles';
import whiteBack from '../../resources/img/nav_white_back.png';
import BannerErrorContainer from '../components/BannerErrorContainer';

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
@mixin(formMixin)
export default class LoginEmail extends PureComponent {
  state = {};

  static navigatorButtons = {
    leftButtons: [
      {
        id: 'back',
        icon: whiteBack,
      }
    ]
  }

  render() {
    return (
      <Image
        resizeMode="cover"
        source={require('../images/onboarding.jpg')}
        style={styles.backgroundContainer}
      >
        <BannerErrorContainer style={{flex: 1}} ref="ebc">
        <View
          style={styles.container}
        >
          <View style={styles.buttonContainer}>
            <Image
              style={styles.logo}
              source={require('img/onboarding_logo.png')}
            />
            <View style={{paddingBottom: 10, alignSelf: 'stretch'}}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                getRefNode={() => {
                  return RN.findNodeHandle(this.refs.submit);
                }}
                keyboardType="email-address"
                placeholder="Email"
                ref={(r) => this.addFormItem(r, 'email')}
                validation={(v) => !!v && validator.isEmail(v)}
              />
            </View>
            <View style={{paddingBottom: 10, alignSelf: 'stretch'}}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                getRefNode={() => {
                  return RN.findNodeHandle(this.refs.submit);
                }}
                placeholder="Password"
                ref={(r) => this.addFormItem(r, 'password')}
                secureTextEntry
                validation={(v) => !!v && validator.isLength(v, {min: 6})}
              />
            </View>
            <View style={{paddingBottom: SCALE.h(54), alignSelf: 'stretch'}}>
              <SimpleButton
                color={COLORS.DARK}
                disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState])}
                label="Sign In"
                onPress={() => {
                  if (!this.checkErrors()) {
                    var value = this.getFormValue();

                    EnvironmentStore.loadEnv()
                      .then(() => UserStore.loginWithEmail(value, 'consumer'))
                      .then(() => {
                        this.clearValues();
                      }, (e) => {
                        this.refs.ebc.error(e);
                      });
                  }
                }}
                ref="submit"
              />
            </View>
            <CustomTouchableOpacity
              disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState])}
              onPress={() => {
                this.props.navigator.push({
                  screen: 'hairfolio.ForgottenPassword',
                })
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
            disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState])}
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
        </BannerErrorContainer>
      </Image>
    );
  }
};
