import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, TouchableOpacity, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import TextInput from '../components/Form/TextInput';
import SimpleButton from '../components/Buttons/Simple';

import {login, register, forgottenPasswordStack} from '../routes';

@connect(app)
export default class LoginEmail extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired,
    kbScrollViewEmitter: React.PropTypes.object
  };

  state = {};

  componentDidMount() {
    this.listeners = [
      this.context.kbScrollViewEmitter.addListener('focus', () => {
        this.setState({hideBack: true});
      }),
      this.context.kbScrollViewEmitter.addListener('blur', () => {
        this.setState({hideBack: false});
      })
    ];
  }

  componentWillUnmount() {
    _.each(this.listener, l => l.remove());
  }

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.last(this.context.navigators).jumpTo(login);
      }}
      leftIcon={this.state.hideBack ? null : 'back'}
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
            <TextInput
              check
              placeholder="Email"
            />
          </View>
          <View style={{paddingBottom: 10}}>
            <TextInput
              error
              placeholder="Password"
              secureTextEntry
            />
          </View>
          <View style={{paddingBottom: SCALE.h(54)}}>
            <SimpleButton
              color={COLORS.DARK}
              label="Sign In"
              onPress={() => {
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              _.first(this.context.navigators).jumpTo(forgottenPasswordStack);
            }}
          >
            <Text style={{
              fontFamily: FONTS.MEDIUM,
              fontSize: SCALE.h(28),
              color: COLORS.WHITE,
              textAlign: 'center'
            }}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            _.last(this.context.navigators).jumpTo(register);
          }}
        >
          <Text style={{
            fontFamily: FONTS.MEDIUM,
            fontSize: SCALE.h(28),
            color: COLORS.WHITE,
            textAlign: 'center'
          }}>Don’t Have an Account? <Text style={{fontFamily: FONTS.HEAVY}}>Sign up</Text></Text>
        </TouchableOpacity>
      </View>
    </NavigationSetting>);
  }
};
