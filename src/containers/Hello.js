import React from 'react';
import PureComponent from '../components/PureComponent';
import {View} from 'react-native';
import connect from '../lib/connect';
import _ from 'lodash';

import {app} from '../selectors/app';

import {COLORS} from '../style';

import FormButton from '../components/Buttons/Form';

import {loginStack, forgottenPasswordStack} from '../routes';

@connect(app)
export default class Hello extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired,
    bubblesStackRoute: React.PropTypes.object.isRequired
  };

  render() {
    return (<View style={{
      flex: 1,
      justifyContent: 'center',
      backgroundColor: COLORS.PRIMARY.BLUE
    }}>
      <View style={{padding: 10}}>
        <FormButton
          label="SIGNUP/SIGNIN"
          onPress={() => {
            _.last(this.context.navigators).jumpTo(loginStack);
          }}
        />
      </View>
      <View style={{padding: 10}}>
        <FormButton
          label="FORGOTTEN PASSWORD"
          onPress={() => {
            _.last(this.context.navigators).jumpTo(forgottenPasswordStack);
          }}
        />
      </View>
    </View>);
  }
};
