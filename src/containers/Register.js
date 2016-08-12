import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, Text, TouchableOpacity} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import SimpleButton from '../components/Buttons/Simple';

import {login, hello, register2} from '../routes';

@connect(app)
export default class Register extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
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
        backgroundColor: 'transparent'
      }}
    >
      <View
        style={{flex: 1, justifyContent: 'space-between'}}
      >
        <View>
          <View style={{paddingBottom: 10}}>
            <SimpleButton
              color={COLORS.FB}
              icon="facebook"
              label="Use Facebook"
              onPress={() => {
                _.last(this.context.navigators).jumpTo(register2);
              }}
            />
          </View>
          <View style={{paddingBottom: 10}}>
            <SimpleButton
              color={COLORS.IG}
              icon="instagram"
              label="Use Instagram"
              onPress={() => {
                _.last(this.context.navigators).jumpTo(register2);
              }}
            />
          </View>
          <View style={{paddingBottom: 10}}>
            <SimpleButton
              color={COLORS.DARK}
              icon="email"
              label="Use your email"
              onPress={() => {
                _.last(this.context.navigators).jumpTo(register2);
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            _.last(this.context.navigators).jumpTo(login);
          }}
        >
          <Text style={{
            fontFamily: FONTS.MEDIUM,
            fontSize: SCALE.h(28),
            color: COLORS.WHITE,
            textAlign: 'center'
          }}>Aready a Member? <Text style={{fontFamily: FONTS.HEAVY}}>Sign in</Text></Text>
        </TouchableOpacity>
      </View>
    </NavigationSetting>);
  }
};
