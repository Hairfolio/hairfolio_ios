import React from 'react';
import _ from 'lodash';
import {BlurView} from 'react-native-blur';
import {autobind} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, Text, Image, StatusBar, TouchableOpacity} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {environment} from '../selectors/environment';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import ConsumerProfileStack from '../stacks/ConsumerProfile';

import DeleteButton from '../components/Buttons/Delete';

import utils from '../utils';

import ProfileButton from '../components/Buttons/Profile';
import Icon from '../components/Icon';
import BannerErrorContainer from '../components/BannerErrorContainer';

import appEmitter from '../appEmitter';

import {registrationActions} from '../actions/registration';

import {BOTTOMBAR_HEIGHT, STATUSBAR_HEIGHT, Dims} from '../constants';

import {editCustomerStack, loginStack} from '../routes';

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
    if (this.props.user.get('account_type') === 'consumer') {
      StatusBar.setHidden(false, 'fade');
      StatusBar.setBarStyle('light-content', true);
    }
  }

  renderNextMilestone() {
    return (<View style={{justifyContent: 'center', flex: 1}}>
      <Text style={{
        textAlign: 'center'
      }}>full {this.props.user.get('account_type')} profile in next milestone</Text>

      <View style={{height: 30}} />
        <DeleteButton
          label="LOG OUT"
          onPress={() => {
            this.props.dispatch(registrationActions.logout());
            appEmitter.emit('logout');
            _.first(this.context.navigators).jumpTo(loginStack);
          }}
        />
        <View style={{height: 10}} />
        <DeleteButton
          label="DESTROY"
          onPress={() => {
            this.props.dispatch(registrationActions.destroy());
            appEmitter.emit('logout');
            _.first(this.context.navigators).jumpTo(loginStack);
          }}
        />
    </View>);
  }

  render() {
    return (<NavigationSetting
      forceUpdateEvents={['login', 'user-edited']}
      onWillFocus={this.onWillFocus}
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        paddingBottom: BOTTOMBAR_HEIGHT
      }}
    >
      <BannerErrorContainer ref="ebc" style={{
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
            alignItems: 'center',
            position: 'relative'
          }}>
            <TouchableOpacity
              onPress={() => {
                if (this.props.user.get('account_type') === 'consumer')
                  return _.first(this.context.navigators).jumpTo(editCustomerStack);

                this.refs.ebc.error(`${this.props.user.get('account_type')} edit profile in next milestone`);
              }}
              style={{
                position: 'absolute',
                top: STATUSBAR_HEIGHT + 5,
                right: 10
              }}
            >
              <Icon
                color={COLORS.WHITE}
                name="settings"
                size={SCALE.h(48)}
              />
            </TouchableOpacity>
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
                <View>
                  <ProfileButton label="FOLLOW" />
                </View>
                <View style={{width: 15}} />
                <View>
                  <ProfileButton label="MESSAGE" />
                </View>
              </View>
            </View>
          </BlurView>
        </Image>
        {this.props.user.get('account_type') === 'consumer' ?
          <ConsumerProfileStack />
        :
          this.renderNextMilestone()
        }
      </BannerErrorContainer>
    </NavigationSetting>);
  }
};
