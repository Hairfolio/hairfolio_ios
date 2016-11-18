import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import UserPostStore from 'stores/UserPostStore.js'

import GridList from 'components/GridList'

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
      }}
      onWillFocus={() => {
        let userId = this.props.profile.get('id');
        UserPostStore.load(userId);
      }}
    >
      <View
        onLayout={this.props.onLayout}
      >
        <GridList
          noElementsText='The user has no posts yet'
          store={UserPostStore} />
      </View>
    </NavigationSetting>);
  }
};
