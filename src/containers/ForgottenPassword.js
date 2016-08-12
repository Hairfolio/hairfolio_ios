import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import InlineTextInput from '../components/Form/InlineTextInput';

import {hello} from '../routes';

import {NAVBAR_HEIGHT} from '../constants';

@connect(app)
export default class ForgottenPassword extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {
    pushSelected: false
  };

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.first(this.context.navigators).jumpTo(hello);
      }}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      rightAction={() => {
      }}
      rightLabel="Send"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT + SCALE.h(34)
      }}
      title="Forgot Password"
    >
      <View style={{
        flex: 1
      }}>
        <InlineTextInput
          placeholder="Email"
        />

        <Text style={{
          marginTop: SCALE.h(35),
          marginLeft: SCALE.w(25),
          marginRight: SCALE.w(25),
          fontFamily: FONTS.MEDIUM,
          fontSize: SCALE.h(26),
          color: COLORS.TEXT
        }}>An email with information on how to reset your password
will be sent to you</Text>
      </View>
    </NavigationSetting>);
  }
};
