import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import appEmitter from '../appEmitter';

import {registrationActions} from '../actions/registration';

import SimpleButton from '../components/Buttons/Simple';

import {NAVBAR_HEIGHT} from '../constants';

import {loginStack, login, appStack} from '../routes';

@connect(app, user)
export default class EditCustomer extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  render() {
    return (<NavigationSetting
      forceUpdateEvents={['login']}
      leftAction={() => {
        _.first(this.context.navigators).jumpTo(appStack);
      }}
      leftDisabled={this.state.submitting}
      leftIcon="back"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="Settings"
    >
      <View style={{
        flex: 1,
        padding: 20,
        justifyContent: 'center'
      }}>
        <Text style={{
          fontFamily: FONTS.MEDIUM,
          textAlign: 'center'
        }}>Hello {this.props.user.get('first_name')}</Text>
        <View style={{height: 20}} />
        <SimpleButton
          color={COLORS.DARK}
          label="Log Out"
          onPress={() => {
            this.props.dispatch(registrationActions.logout());
            appEmitter.emit('logout');
            _.first(this.context.navigators).jumpTo(loginStack);
          }}
          ref="submit"
        />
        <View style={{height: 20}} />
        <SimpleButton
          color={COLORS.DARK}
          label="Destroy"
          onPress={() => {
            this.props.dispatch(registrationActions.destroy());
            appEmitter.emit('logout');
            _.first(this.context.navigators).jumpTo(loginStack);
          }}
          ref="submit"
        />
      </View>
    </NavigationSetting>);
  }
};
