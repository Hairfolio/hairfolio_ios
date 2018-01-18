import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import RN, {View, Text} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import { observer } from 'mobx-react';
import TextInput from '../components/Form/TextInput';
import SimpleButton from '../components/Buttons/Simple';
import CustomTouchableOpacity from '../components/CustomTouchableOpacity';

import formMixin from '../mixins/form';

import utils from '../utils';
import appEmitter from '../appEmitter';

import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import UserStore from '../mobx/stores/UserStore';

import {login, register, forgottenPasswordStack, appStack} from '../routes';

@observer
@mixin(formMixin)
export default class LoginEmail extends PureComponent {
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
      leftDisabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState])}
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
              disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState])}
              label="Sign In"
              onPress={() => {
                if (!this.checkErrors()) {
                  var value = this.getFormValue();

                  EnvironmentStore.loadEnv()
                    .then(() => UserStore.loginWithEmail(value, 'consumer'))
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
            disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState])}
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
          disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState])}
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
