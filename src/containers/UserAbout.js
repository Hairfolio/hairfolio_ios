import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

@connect(app, user)
export default class UserAbout extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    profile: React.PropTypes.object.isRequired,
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
        padding: 10
      }}
    >
      <View style={{
        flex: 1
      }}>
        <Text style={{
          fontFamily: FONTS.MEDIUM,
          fontSize: SCALE.h(26),
          color: COLORS.TEXT
        }}>User About</Text>
      </View>
    </NavigationSetting>);
  }
};
