import React from 'react';
import PureComponent from '../components/PureComponent';
import {View} from 'react-native';
import connect from '../lib/connect';
import _ from 'lodash';

import {app} from '../selectors/app';

import SimpleButton from '../components/Buttons/Simple';
import OnboardingLayout from '../components/OnboardingLayout';

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
    return (<OnboardingLayout>
      <View style={{padding: 10}}>
        <SimpleButton
          label="SIGNUP/SIGNIN"
          onPress={() => {
            _.last(this.context.navigators).jumpTo(loginStack);
          }}
        />
      </View>
      <View style={{padding: 10}}>
        <SimpleButton
          label="FORGOTTEN PASSWORD"
          onPress={() => {
            _.last(this.context.navigators).jumpTo(forgottenPasswordStack);
          }}
        />
      </View>
    </OnboardingLayout>);
  }
};
