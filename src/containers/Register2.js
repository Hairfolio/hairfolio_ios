import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {registration} from '../selectors/registration';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import Picker from '../components/Form/Picker';

import {register, signupConsumerStack} from '../routes';

@connect(app, registration)
export default class Register2 extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    registrationMethod: React.PropTypes.string
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired,
    setBannerError: React.PropTypes.func.isRequired
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
          onDone={(item = {}) => {
            if (!item)
              return;

            switch (item.label) {
              case 'Consumer':
                if (this.props.registrationMethod === 'email')
                  _.first(this.context.navigators).jumpTo(signupConsumerStack);
                else
                  this.context.setBannerError(`${this.props.registrationMethod} Not Ready`);
                break;
              default:
                this.context.setBannerError('Not Ready');
                break;
            }
          }}
          placeholder="Select account type"
        />
      </View>
    </NavigationSetting>);
  }
};
