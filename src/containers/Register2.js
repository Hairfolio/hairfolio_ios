import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import Picker from '../components/Form/Picker';

import {register} from '../routes';

@connect(app)
export default class Register2 extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.last(this.context.navigators).jumpTo(register);
      }}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      style={{
        flex: 1,
        backgroundColor: 'transparent'
      }}
    >
      <View
        style={{flex: 1, justifyContent: 'space-between'}}
      >
        <Picker
          choices={[
            {
              label: 'Consumer'
            },
            {
              label: 'Stylist'
            },
            {
              label: 'Salon'
            },
            {
              label: 'Brand'
            }
          ]}
          onChange={(type) => {
          }}
          placeholder="Select account type"
        />
      </View>
    </NavigationSetting>);
  }
};
