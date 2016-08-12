import React from 'react';
import {autobind} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, StatusBar} from 'react-native';
import connect from '../lib/connect';
import _ from 'lodash';
import NavigationSetting from '../navigation/NavigationSetting';

import {app} from '../selectors/app';

import SimpleButton from '../components/Buttons/Simple';

import {loginStack, forgottenPasswordStack, signupConsumerStack, appStack} from '../routes';

import {COLORS, SCALE} from '../style';

@connect(app)
export default class Hello extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  @autobind
  onWillFocus() {
    StatusBar.setHidden(true, 'fade');
  }

  render() {
    return (<NavigationSetting
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      style={{
        flex: 1,
        backgroundColor: 'transparent'
      }}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        padding: SCALE.w(69)
      }}>
        <View style={{paddingBottom: 10}}>
          <SimpleButton
            color={COLORS.DARK}
            label="SIGNUP/SIGNIN"
            onPress={() => {
              _.last(this.context.navigators).jumpTo(loginStack);
            }}
          />
        </View>
        <View style={{paddingBottom: 10}}>
          <SimpleButton
            color={COLORS.DARK}
            label="FORGOTTEN PASSWORD"
            onPress={() => {
              _.last(this.context.navigators).jumpTo(forgottenPasswordStack);
            }}
          />
        </View>
        <View style={{paddingBottom: 10}}>
          <SimpleButton
            color={COLORS.DARK}
            label="SIGNUP CONSUMER"
            onPress={() => {
              _.last(this.context.navigators).jumpTo(signupConsumerStack);
            }}
          />
        </View>
        <View style={{paddingBottom: 10}}>
          <SimpleButton
            color={COLORS.DARK}
            label="APP"
            onPress={() => {
              _.last(this.context.navigators).jumpTo(appStack);
            }}
          />
        </View>
      </View>
    </NavigationSetting>);
  }
};
