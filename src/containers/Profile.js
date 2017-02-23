import React from 'react';
import _ from 'lodash';
import {BlurView} from 'react-native-blur';
import PureComponent from '../components/PureComponent';
import {View, Text, Image, TouchableOpacity, ScrollView, StatusBar} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user, users} from '../selectors/user';
import {environment} from '../selectors/environment';
import {COLORS, FONTS, SCALE} from '../style';
import UserProfileNavigationBar from '../components/UserProfile/Bar';
import Service from 'hairfolio/src/services/index.js'

import ProfileStack from '../stacks/Profile';

import utils from '../utils';

import ProfileButton from '../components/Buttons/Profile';
import Icon from '../components/Icon';
import BannerErrorContainer from '../components/BannerErrorContainer';

import ChannelResponder from '../components/Channel/ChannelResponder';
import Channel from '../components/Channel/Channel';

import {registrationActions} from '../actions/registration';
import MessageDetailsStore from 'stores/MessageDetailsStore';

import * as routes from 'hairfolio/src/routes.js'

import {
  h
} from 'hairfolio/src/helpers.js';

import {STATUSBAR_HEIGHT} from '../constants';

import BlackBookStore from 'stores/BlackBookStore'

import {editCustomerStack, appStack, blackBook, createPostStack} from '../routes';

@connect(app, user, users, environment)
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

  constructor(props) {
    super(props);
    this.state = {
      followed: this.props.profile.get('is_followed_by_me')
    }
  }

  channel = new Channel();

  getName() {

    if (this.props.profile.get('account_type') == 'ambassador') {
      return this.props.profile.get('brand').get('name');
    }

    if (this.props.profile.get('account_type') == 'owner') {
      return this.props.profile.get('salon').get('name');
    }

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
      case 'owner':
        icon = 'salon';
        iconColor = COLORS.SALON;
        iconSize = SCALE.h(18);
        break;
      case 'ambassador':
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

  getStyle() {
    return this.y >= (this.height - 50) ? 'default' : 'light-content';
  }

  scrollToFakeTop() {
    if (this.y >= (this.height - 50))
      this.refs.scrollView.scrollTo({
        animated: false,
        y: this.height - 50
      });
  }

  render() {

    this.height = (this.props.profile === this.props.user ? 183.5 : 223.5) + 40;

    window.profile = this.props.profile;
    window.user2 = this.props.user;

    window.profileState = this;


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
            height: this.height,
            backgroundColor: 'rgba(0, 0, 0, 0.25)'
          }}
        />

        <BlurView blurType="light" style={{
          flex: 1,
          position: 'relative'
        }}>
          <ScrollView
            onScroll={(e) => {

              this.y = e.nativeEvent.contentOffset.y;

              this.refs.headerImageWrapper.setNativeProps({
                style: {
                  height: e.nativeEvent.contentOffset.y < 0 ? this.height - e.nativeEvent.contentOffset.y : this.height
                }
              });

              var opacityQuote = Math.min(Math.max(0, -e.nativeEvent.contentOffset.y / 30), 1);

              this.refs.quote.setNativeProps({
                style: {
                  opacity: opacityQuote
                }
              });

              var opacityContent = 1 - opacityQuote;
              if (e.nativeEvent.contentOffset.y > 60)
                opacityContent = 1 - Math.min((e.nativeEvent.contentOffset.y - 60) / 30, 1);


              let opacityContent2 = opacityContent;
              if (e.nativeEvent.contentOffset.y > 50) {
                opacityContent2 = 0;
              }


              this.refs.headerContent.setNativeProps({
                style: {
                  opacity: opacityContent
                }
              });

              if (this.refs.settings) {
                this.refs.settings.setNativeProps({
                  style: {
                    opacity: opacityContent
                  },
                  pointerEvents: opacityContent === 1 ? 'auto' : 'none'
                });
              }

              if (this.refs.blackbook) {
                this.refs.blackbook.setNativeProps({
                  style: {
                    opacity: opacityContent2
                  },
                  pointerEvents: opacityContent2 === 1 ? 'auto' : 'none'
                });
              }

              this.refs.statusBarCache.setNativeProps({
                style: {
                  opacity: e.nativeEvent.contentOffset.y >= (this.height - 50) ? 1 : 0
                }
              });

              if (e.nativeEvent.contentOffset.y < this.height - 50)
                StatusBar.setBarStyle('light-content', true);
              else
                StatusBar.setBarStyle('default', true);
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
              paddingBottom: SCALE.h(60) - 10,
              position: 'relative',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}>
              <View
                ref="quote"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0
                }}
              >
                <Text style={{
                  fontFamily: FONTS.MEDIUM,
                  fontSize: SCALE.h(32),
                  color: COLORS.WHITE,
                  textAlign: 'center'
                }}></Text>
              </View>
              <View ref="headerContent" style={{position: 'relative', alignItems: 'center'}}>

                <View style={{
                  position: 'relative'
                }}>
                  <Image
                    source={{uri: utils.getUserProfilePicURI(this.props.profile, this.props.environment)}}
                    style={{
                      height: SCALE.h(130),
                      width: SCALE.h(130),
                      borderRadius: SCALE.h(130) / 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)'
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
                    justifyContent: 'center'
                  }}>
                    <Text style={{
                      color: COLORS.WHITE,
                      fontFamily: FONTS.BOOK_OBLIQUE,
                      fontSize: SCALE.h(28),
                      textAlign: 'center',
                      backgroundColor: 'transparent'
                    }}>{this.props.profile.get('likes_count')} Stars</Text>
                    <View style={{width: 10}} />
                    <Text style={{
                      color: COLORS.WHITE,
                      fontFamily: FONTS.BOOK_OBLIQUE,
                      fontSize: SCALE.h(28),
                      textAlign: 'center',
                      backgroundColor: 'transparent'
                    }}>{this.props.profile.get('followers_count')} Followers</Text>


                </View>

                  {this.props.profile.get('id') !== this.props.user.get('id') ? <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: SCALE.h(20)
                  }}>
                    <View>
                      {!this.state.followed ?
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
                          label="FOLLOWING"
                          onPress={() => {
                            this.props.dispatch(registrationActions.unfollowUser(this.props.profile.get('id')));
                          }}
                        />
                      }
                    </View>



                    <View style={{width: SCALE.w(25)}} />
                    <View>
                      <ProfileButton
                        label="MESSAGE"
                        onPress={
                          () => {
                            MessageDetailsStore.myBack = () => window.navigators[0].jumpTo(routes.appStack);

                            let userObjects = [
                              {
                                user : {
                                  id: this.props.profile.get('id')
                                }
                              }
                            ];

                            MessageDetailsStore.createConversation(userObjects);
                            MessageDetailsStore.title = this.getName();
                            window.navigators[0].jumpTo(routes.messageDetailsRoute);
                          }
                        }
                      />
                    </View>
                  </View> : null}


                </View>
              </View>

            </View>



            <View>
              <View ref="statusBarCache" style={{
                height: 10,
                backgroundColor: 'white',
                opacity: 0
              }} />
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
            </View>
            <ProfileStack
              channel={this.channel}
              key={this.props.profile.get('id')}
              profile={this.props.profile}
              scrollToFakeTop={() => this.scrollToFakeTop()}
            />
          </ScrollView>

          {this.props.profile === this.props.user ? <View ref="settings" style={{
            position: 'absolute',
            top: STATUSBAR_HEIGHT + 5,
            right: 10
          }}>
            <TouchableOpacity
              onPress={() => {
                _.first(this.context.navigators).jumpTo(
                  editCustomerStack
                );
              }}
            >
              <Icon
                color={COLORS.WHITE}
                name="settings"
                size={SCALE.h(48)}
              />
            </TouchableOpacity>
          </View> : null}

          {this.props.profile === this.props.user ?
              <View
                style = {{
                  position: 'absolute',
                  right: 15,
                  top: 140
                }}
                ref="blackbook">
                <TouchableOpacity
                  style={{
                    flexDirection: 'row'
                  }}
                  onPress={() => {
                    BlackBookStore.reset();
                    BlackBookStore.show = true;
                    BlackBookStore.myBack = () => {
                      window.navigators[0].jumpTo(routes.appStack);
                      BlackBookStore.show = false;
                    };
                    window.navigators[0].jumpTo(routes.blackBook);
                  }}
                >
                  <Image
                    style={{height: h(64), width: h(48)}}
                    source={require('img/black_book.png')}
                  />
                </TouchableOpacity>
              </View> : null}
        </BlurView>
      </View>

    </BannerErrorContainer>);
  }
};
