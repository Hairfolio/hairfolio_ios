import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import SimpleButton from '../components/Buttons/Simple';
import OnboardingLayout from '../components/OnboardingLayout';
import KeyboardScrollView from '../components/KeyboardScrollView';
import KeyboardPaddingView from '../components/KeyboardPaddingView';

import {login, hello} from '../routes';

import {Dims} from '../constants';

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
      <KeyboardPaddingView
        style={{flex: 1}}
      >
        <KeyboardScrollView
          scrollEnabled={false}
          scrollToTopOnBlur
          showsVerticalScrollIndicator={false}
          space={Platform.OS === 'ios' ? 60 : 90}
          style={{flex: 1}}
        >
          <View style={{
            height: Dims.deviceHeight
          }}>
            <OnboardingLayout>
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
                      }}
                    />
                  </View>
                  <View style={{paddingBottom: 10}}>
                    <SimpleButton
                      color={COLORS.IG}
                      icon="instagram"
                      label="Use Instagram"
                      onPress={() => {
                      }}
                    />
                  </View>
                  <View style={{paddingBottom: 10}}>
                    <SimpleButton
                      color={COLORS.DARK}
                      icon="email"
                      label="Use your email"
                      onPress={() => {
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
            </OnboardingLayout>
          </View>
        </KeyboardScrollView>
      </KeyboardPaddingView>
    </NavigationSetting>);
  }
};
