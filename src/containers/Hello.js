import React from 'react';
import {autobind} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, StatusBar} from 'react-native';
import _ from 'lodash';
import NavigationSetting from '../navigation/NavigationSetting';

import SimpleButton from '../components/Buttons/Simple';

import {signupStylistStack, stylistInfo, signupSalonStack, salonInfo, signupBrandStack, brandInfo, forgottenPasswordStack, signupConsumerStack, appStack} from '../routes';

import {COLORS, SCALE} from '../style';

export default class Hello extends PureComponent {
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
            label="Salon Info"
            onPress={() => {
              signupSalonStack.scene().jumpTo(salonInfo);
              _.first(this.context.navigators).jumpTo(signupSalonStack);
            }}
          />
        </View>
        <View style={{paddingBottom: 10}}>
          <SimpleButton
            color={COLORS.DARK}
            label="Stylist Info"
            onPress={() => {
              signupStylistStack.scene().jumpTo(stylistInfo);
              _.first(this.context.navigators).jumpTo(signupStylistStack);
            }}
          />
        </View>
        <View style={{paddingBottom: 10}}>
          <SimpleButton
            color={COLORS.DARK}
            label="Brand Info"
            onPress={() => {
              signupBrandStack.scene().jumpTo(brandInfo);
              _.first(this.context.navigators).jumpTo(signupBrandStack);
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
