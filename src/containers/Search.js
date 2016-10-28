import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import {BOTTOMBAR_HEIGHT, STATUSBAR_HEIGHT} from '../constants';

import {profile, profileExternal, appStack} from '../routes';

import SimpleButton from '../components/Buttons/Simple';

@connect(app)
export default class Search extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
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
        }}>Search</Text>


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
