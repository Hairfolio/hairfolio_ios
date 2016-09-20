import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import {BOTTOMBAR_HEIGHT, STATUSBAR_HEIGHT} from '../constants';

import SimpleButton from '../components/Buttons/Simple';

import {profile, profileExternal, appStack} from '../routes';

@connect(app, user)
export default class Feed extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    user: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {
    return (<NavigationSetting
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        paddingTop: STATUSBAR_HEIGHT,
        paddingBottom: BOTTOMBAR_HEIGHT
      }}
    >
      <View style={{
        flex: 1
      }}>
        <Text style={{
          fontFamily: FONTS.MEDIUM,
          fontSize: SCALE.h(26),
          color: COLORS.TEXT
        }}>Feed</Text>

        <View style={{height: 20}} />

        <SimpleButton
          color={COLORS.DARK}
          label="Go to a consumer profile"
          onPress={() => {
            appStack.scene().goToProfile(118);
            //118 / consumerext@hairfolio.com / 123456
          }}
        />

        <View style={{height: 20}} />

        <SimpleButton
          color={COLORS.DARK}
          label="Go to a stylist profile"
          onPress={() => {
            //120 / stylistext@hairfolio.com / 123456
            appStack.scene().goToProfile(120);
          }}
        />

        <View style={{height: 20}} />

        <SimpleButton
          color={COLORS.DARK}
          label="Go to a salon profile"
          onPress={() => {
            //121 / salonext@hairfolio.com / 123456
            appStack.scene().goToProfile(121);
          }}
        />

        <View style={{height: 20}} />

        <SimpleButton
          color={COLORS.DARK}
          label="Go to a brand profile"
          onPress={() => {
            //122 / brandext@hairfolio.com / 123456
            appStack.scene().goToProfile(122);
          }}
        />

      </View>
    </NavigationSetting>);
  }
};
