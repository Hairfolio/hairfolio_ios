import React from 'react';
import _ from 'lodash';
import {BlurView} from 'react-native-blur';
import PureComponent from '../components/PureComponent';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {environment} from '../selectors/environment';
import {COLORS, FONTS, SCALE} from '../style';
import UserProfileNavigationBar from '../components/UserProfile/Bar';

import ProfileStack from '../stacks/Profile';

import utils from '../utils';

import ProfileButton from '../components/Buttons/Profile';
import Icon from '../components/Icon';
import BannerErrorContainer from '../components/BannerErrorContainer';

import ChannelResponder from '../components/Channel/ChannelResponder';
import Channel from '../components/Channel/Channel';

import {registrationActions} from '../actions/registration';

import {STATUSBAR_HEIGHT, Dims} from '../constants';

import {editCustomerStack, UserPostsRoute, UserHairfolioRoute, UserAboutRoute, UserStylistsRoute} from '../routes';

@connect(app, user, environment)
export default class Profile extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    environment: React.PropTypes.object.isRequired,
    followingStates: React.PropTypes.object.isRequired,
    profile: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  channel = new Channel();

  getName() {
    if (this.props.profile.get('account_type') === 'brand' || this.props.profile.get('account_type') === 'salon')
      return this.props.profile.get('business_name') || 'Business Name';

    return `${this.props.profile.get('first_name')} ${this.props.profile.get('last_name')}`;
  }

  renderAccountIcon() {
    var icon, iconColor, iconSize;
    switch (this.props.profile.get('account_type')) {
      case 'stylist':
        icon = 'stylist';
        iconColor = COLORS.STYLIST;
        iconSize = SCALE.h(32);
        break;
      case 'salon':
        icon = 'salon';
        iconColor = COLORS.SALON;
        iconSize = SCALE.h(18);
        break;
      case 'brand':
        icon = 'brand';
        iconColor = COLORS.BRAND;
        iconSize = SCALE.h(25);
        break;
    }

    if (!icon)
      return null;

    return (<Icon
      color={iconColor}
      name={icon}
      size={iconSize}
    />);
  }

  render() {
    var height = (this.props.profile === this.props.user ? 183.5 : 223.5) + 40;

    return (<BannerErrorContainer ref="ebc" style={{
      flex: 1
    }}>
      <View style={{flex: 1}}>
        <Image
          ref="headerImageWrapper"
          resizeMode="cover"
          source={{uri: utils.getUserProfilePicURI(this.props.profile, this.props.environment)}}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height
          }}
        />

        <BlurView blurType="light" style={{
          flex: 1,
          position: 'relative'
        }}>
          <ScrollView
            onScroll={(e) => {
              this.refs.headerImageWrapper.setNativeProps({
                style: {
                  height: e.nativeEvent.contentOffset.y < 0 ? height - e.nativeEvent.contentOffset.y : height
                }
              });
            }}
            ref="scrollView"
            scrollEventThrottle={48}
            stickyHeaderIndices={[1]}
            style={{
              flex: 1,
              backgroundColor: 'transparent'
            }}
          >
            <View style={{
              padding: SCALE.h(60),
              position: 'relative',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}>
              <View style={{
                position: 'relative'
              }}>
                <Image
                  source={{uri: utils.getUserProfilePicURI(this.props.profile, this.props.environment)}}
                  style={{
                    height: SCALE.h(130),
                    width: SCALE.h(130),
                    borderRadius: SCALE.h(130) / 2
                  }}
                />
                {this.props.profile.get('account_type') !== 'consumer' ? <View style={{
                  height: SCALE.h(46),
                  width: SCALE.h(46),
                  borderRadius: SCALE.h(23),
                  backgroundColor: COLORS.WHITE,
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {this.renderAccountIcon()}
                </View> : null}
              </View>
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
                  <View style={{width: 10}} />
                  <Text style={{
                    color: COLORS.WHITE,
                    fontFamily: FONTS.BOOK_OBLIQUE,
                    fontSize: SCALE.h(28),
                    textAlign: 'center',
                    backgroundColor: 'transparent'
                  }}>{this.props.profile.get('followers_count')} Followers</Text>
                </View>
                {this.props.profile !== this.props.user ? <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: SCALE.h(20)
                }}>
                  <View>
                    {!utils.isFollowing(this.props.user, this.props.profile) ?
                      <ProfileButton
                        disabled={utils.isLoading(this.props.followingStates.get(this.props.profile.get('id')))}
                        label="FOLLOW"
                        onPress={() => {
                          this.props.dispatch(registrationActions.followUser(this.props.profile.get('id')));
                        }}
                      />
                    :
                      <ProfileButton
                        color={COLORS.FOLLOWING}
                        disabled={utils.isLoading(this.props.followingStates.get(this.props.profile.get('id')))}
                        icon="check"
                        label="FOLLOWED"
                        onPress={() => {
                          this.props.dispatch(registrationActions.unfollowUser(this.props.profile.get('id')));
                        }}
                      />
                    }
                  </View>
                  <View style={{width: 15}} />
                  <View>
                    <ProfileButton label="MESSAGE" />
                  </View>
                </View> : null}
              </View>
            </View>
            <ChannelResponder
              channel={this.channel}
              commands={[
                'updateProgress'
              ]}
              properties={{
                navState: 'navState',
                navigator: 'navigator'
              }}
            >
              {this.props.profile.get('account_type') && <UserProfileNavigationBar color={COLORS[this.props.profile.get('account_type').toUpperCase()]} />}
            </ChannelResponder>
            <ProfileStack
              channel={this.channel}
              key={this.props.profile}
              profile={this.props.profile}
            />
          </ScrollView>

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
        </BlurView>
      </View>

    </BannerErrorContainer>);
  }
};
