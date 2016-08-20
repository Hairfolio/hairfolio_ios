import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import reactMixin from 'react-mixin';
import PureComponent from '../components/PureComponent';
import RN, {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import TextInput from '../components/Form/TextInput';
import SimpleButton from '../components/Buttons/Simple';
import CustomTouchableOpacity from '../components/CustomTouchableOpacity';

import formMixin from '../mixins/form';

import utils from '../utils';
import appEmitter from '../appEmitter';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import {user} from '../selectors/user';
import {environment} from '../selectors/environment';

import {registrationActions} from '../actions/registration';

import {login, register, forgottenPasswordStack, appStack} from '../routes';

@connect(app, user, environment)
@reactMixin.decorate(formMixin)
export default class LoginEmail extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
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
        _.last(this.context.navigators).jumpTo(login);
      }}
      leftDisabled={utils.isLoading([this.props.environmentState, this.props.userState])}
      leftIcon={this.state.hideBack ? null : 'back'}
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
          <View style={{paddingBottom: 10}}>
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
          <View style={{paddingBottom: SCALE.h(54)}}>
            <SimpleButton
              color={COLORS.DARK}
              disabled={utils.isLoading([this.props.environmentState, this.props.userState])}
              label="Sign In"
              onPress={() => {
                if (!this.checkErrors()) {
                  var value = this.getFormValue();

                  this.props.dispatch(registrationActions.getEnvironment()).then(throwOnFail)
                    .then(() => this.props.dispatch(registrationActions.loginWithEmail(value, 'consumer')).then(throwOnFail))
                    .then(() => {
                      this.clearValues();
                      appEmitter.emit('login');
                      _.first(this.context.navigators).jumpTo(appStack);
                    }, (e) => {
                      console.log(e);
                      this.context.setBannerError(e);
                    });
                }
              }}
              ref="submit"
            />
          </View>
          <CustomTouchableOpacity
            disabled={utils.isLoading([this.props.environmentState, this.props.userState])}
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
          disabled={utils.isLoading([this.props.environmentState, this.props.userState])}
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
