import React from 'react';
import _ from 'lodash';
import {BlurView} from 'react-native-blur';
import PureComponent from '../components/PureComponent';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {environment} from '../selectors/environment';
import {COLORS, FONTS, SCALE} from '../style';

import ConsumerProfileStack from '../stacks/ConsumerProfile';
import StylistProfileStack from '../stacks/StylistProfile';

import utils from '../utils';

import ProfileButton from '../components/Buttons/Profile';
import Icon from '../components/Icon';
import BannerErrorContainer from '../components/BannerErrorContainer';

import {registrationActions} from '../actions/registration';

import {STATUSBAR_HEIGHT, Dims} from '../constants';

import {editCustomerStack} from '../routes';

@connect(app, user, environment)
export default class Profile extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    environment: React.PropTypes.object.isRequired,
    profile: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  getName() {
    if (this.props.profile.get('account_type') === 'brand' || this.props.profile.get('account_type') === 'salon')
      return this.props.profile.get('business_name') || 'Business Name';

    return `${this.props.profile.get('first_name')} ${this.props.profile.get('last_name')}`;
  }

  render() {
    return (<BannerErrorContainer ref="ebc" style={{
      flex: 1
    }}>
      <Image
        resizeMode="cover"
        source={{uri: utils.getUserProfilePicURI(this.props.profile, this.props.environment)}}
        style={{
          width: Dims.deviceWidth
        }}
      >
        <BlurView blurType="light" style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: SCALE.h(60)
        }}>
          {this.props.profile === this.props.user ? <TouchableOpacity
            onPress={() => {
              _.first(this.context.navigators).jumpTo(editCustomerStack);
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
          </TouchableOpacity> : null}
          <Image
            source={{uri: utils.getUserProfilePicURI(this.props.profile, this.props.environment)}}
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
            }}>{this.getName()}</Text>
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
            {this.props.profile !== this.props.user ? <View style={{
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
            </View> : null}
          </View>
        </BlurView>
      </Image>
      {this.props.profile.get('account_type') === 'consumer' ?
        <ConsumerProfileStack key={this.props.profile} profile={this.props.profile} />
      : null}
      {this.props.profile.get('account_type') === 'stylist' ?
        <StylistProfileStack key={this.props.profile} profile={this.props.profile} />
      : null}
    </BannerErrorContainer>);
  }
};
