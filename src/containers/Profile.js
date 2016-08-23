import React from 'react';
import _ from 'lodash';
import {BlurView} from 'react-native-blur';
import {autobind} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, Text, Image, StatusBar} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {environment} from '../selectors/environment';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import appEmitter from '../appEmitter';
import utils from '../utils';

import {registrationActions} from '../actions/registration';

import ProfileButton from '../components/Buttons/Profile';

import {BOTTOMBAR_HEIGHT, STATUSBAR_HEIGHT, Dims} from '../constants';

import {loginStack, login} from '../routes';

/*
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
        */

@connect(app, user, environment)
export default class Profile extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    environment: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  @autobind
  onWillFocus() {
    StatusBar.setHidden(false, 'fade');
    StatusBar.setBarStyle('light-content', true);
  }

  render() {
    return (<NavigationSetting
      forceUpdateEvents={['login']}
      onWillFocus={this.onWillFocus}
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        paddingBottom: BOTTOMBAR_HEIGHT
      }}
    >
      <View style={{
        flex: 1
      }}>
        <Image
          resizeMode="cover"
          source={{uri: utils.getUserProfilePicURI(this.props.user, this.props.environment)}}
          style={{
            height: SCALE.h(470),
            width: Dims.deviceWidth
          }}
        >
          <BlurView blurType="light" style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image
              source={{uri: utils.getUserProfilePicURI(this.props.user, this.props.environment)}}
              style={{
                height: SCALE.h(130),
                width: SCALE.h(130),
                borderRadius: SCALE.h(130) / 2
              }}
            />
            <View>
              <Text style={{
                color: COLORS.WHITE,
                fontFamily: FONTS.HEAVY,
                fontSize: SCALE.h(42),
                marginTop: SCALE.h(20),
                textAlign: 'center',
                backgroundColor: 'transparent'
              }}>{this.props.user.get('first_name')} {this.props.user.get('last_name')}</Text>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <Text style={{
                  color: COLORS.WHITE,
                  fontFamily: FONTS.BOOK_OBLIQUE,
                  fontSize: SCALE.h(28),
                  textAlign: 'center',
                  backgroundColor: 'transparent'
                }}>X Stars</Text>
                <Text style={{
                  color: COLORS.WHITE,
                  fontFamily: FONTS.BOOK_OBLIQUE,
                  fontSize: SCALE.h(28),
                  textAlign: 'center',
                  backgroundColor: 'transparent'
                }}>Y Followers</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: SCALE.h(20)
              }}>
                <View style={{flex: 1}}>
                  <ProfileButton label="FOLLOW" />
                </View>
                <View style={{width: 15}} />
                <View style={{flex: 1}}>
                  <ProfileButton label="MESSAGE" />
                </View>
              </View>
            </View>
          </BlurView>
        </Image>
      </View>
    </NavigationSetting>);
  }
};
