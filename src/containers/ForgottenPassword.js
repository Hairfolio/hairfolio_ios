import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import InlineTextInput from '../components/Form/InlineTextInput';
import BannerErrorContainer from '../components/BannerErrorContainer';

import {loginStack} from '../routes';


import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import formMixin from '../mixins/form';

import {NAVBAR_HEIGHT} from '../constants';

@mixin(formMixin)
export default class ForgottenPassword extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.first(this.context.navigators).jumpTo(loginStack);
      }}
      leftDisabled={this.state.submitting}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      rightAction={() => {
        if (this.checkErrors())
          return;

        this.setState({'submitting': true});
        this.props.dispatch(registrationActions.forgotPassword(this.getFormValue().email))
        .then((r) => {
          this.clearValues();
          this.setState({submitting: false});
          return r;
        })
        .then(throwOnFail)
        .then(
          () => {
            this.setState({success: true});
            setTimeout(() => {
              this.setState({success: false});
            }, 3000);
          },
          (e) => {
            this.refs.ebc.error(e);
          }
          );
      }}
      rightDisabled={this.state.submitting}
      rightLabel="Send"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="Forgot Password"
    >
      <BannerErrorContainer ref="ebc" style={{
        flex: 1
      }}>
        <View style={{
          height: SCALE.h(34)
        }} />

        {this.state.success ?
          <View style={{
            height: SCALE.h(80),
            justifyContent: 'center',
            backgroundColor: COLORS.WHITE
          }}>
            <Text style={{
              fontFamily: FONTS.MEDIUM,
              color: COLORS.DARK,
              textAlign: 'center'
            }}>Success !</Text>
          </View>
        :
          <InlineTextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Email"
            ref={(r) => this.addFormItem(r, 'email')}
            validation={(v) => !!v && validator.isEmail(v)}
          />
        }

        <Text style={{
          marginTop: SCALE.h(35),
          marginLeft: SCALE.w(25),
          marginRight: SCALE.w(25),
          fontFamily: FONTS.MEDIUM,
          fontSize: SCALE.h(26),
          color: COLORS.TEXT
        }}>An email with information on how to reset your password
will be sent to you</Text>
      </BannerErrorContainer>
    </NavigationSetting>);
  }
};
