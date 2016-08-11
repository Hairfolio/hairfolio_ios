import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

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
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="forgot password"
    >
      <View style={{
        flex: 1
      }}>
      </View>
    </NavigationSetting>);
  }
};
