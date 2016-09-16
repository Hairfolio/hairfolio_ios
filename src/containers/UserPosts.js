import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

@connect(app)
export default class UserPosts extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    onLayout: React.PropTypes.func.isRequired
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
      <View
        onLayout={this.props.onLayout}
      >
        <Text style={{
          fontFamily: FONTS.MEDIUM,
          fontSize: SCALE.h(26),
          color: COLORS.TEXT
        }}>User Posts</Text>
      </View>
    </NavigationSetting>);
  }
};
