import React from 'react';
import _ from 'lodash';
import {BlurView} from 'react-native-blur';
import {View, Text, Image, TouchableOpacity, ScrollView, StatusBar} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { observer } from 'mobx-react';
import { toJS, reaction } from 'mobx';
import {COLORS, FONTS, SCALE} from '../style';
import LoadingContainer from '../components/LoadingContainer';
import PureComponent from '../components/PureComponent';
import UserProfileNavigationBar from '../components/UserProfile/Bar';
import Service from 'Hairfolio/src/services/index';
import WrappingScrollView from '../components/WrappingScrollView';
import utils from '../utils';
import ProfileButton from '../components/Buttons/Profile';
import Icon from '../components/Icon';
import BannerErrorContainer from '../components/BannerErrorContainer';
import MessageDetailsStore from '../mobx/stores/MessageDetailsStore';
import UserStore from '../mobx/stores/UserStore';
import UsersStore from '../mobx/stores/UsersStore';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import { h } from 'Hairfolio/src/helpers';
import {STATUSBAR_HEIGHT, EMPTY, READY, LOADING} from '../constants';
import BlackBookStore from '../mobx/stores/BlackBookStore';
import LinkTabBar from '../components/post/LinkTabBar';
import UserPosts from '../containers/UserPosts';
// import UserPostsStore from '../mobx/stores/UserPostStore';
import { storeFactory } from '../mobx/stores/UserPostStoreFactory';
import UserHairfolio from '../containers/UserHairfolio';
import HairfolioStore from '../mobx/stores/HairfolioStore'
import UserAbout from '../containers/UserAbout';
import UserStylists from '../containers/UserStylists';
import NavigatorStyles from '../common/NavigatorStyles';
import whiteBack from '../../resources/img/nav_white_back.png';

@observer
export default class Profile extends PureComponent {
  constructor(props) {
    super(props);
    if (this.props.userId) {
      this._fetchProfile();
      this.state = {
        followed: false,
        loading: UsersStore.usersStates.get(this.props.userId) || LOADING,
        user: UsersStore.users.get(this.props.userId),
      };
    } else {
      this.state = {
        followed: UserStore.user.is_followed_by_me,
        loading: READY,
        user: UserStore.user,
      };
    }
  }

  componentDidMount() {
    this.state.user.userId
    UserPostStoreFactory.ge
  }

  componentWillUnmount() {

  }

  onNavigatorEvent(event) {
    switch(event.id) {
      case 'willAppear':
        this.props.navigator.toggleTabs({
          to: 'shown',
        });
        break;
      default:
        break;
    }
  }

  _fetchProfile = () => {
    UsersStore.getUser(this.props.userId)
    .then(() =>{
      UserPostsStore.load(this.props.userId);
      HairfolioStore.load(this.props.userId);
      this._userStateChanged(UsersStore.usersStates.get(this.props.userId))
    });

  }

  _userStateChanged = (newState) => {
    if (newState === READY) {
      const user = UsersStore.users.get(this.props.userId);
      this.setState({
        followed: user.is_followed_by_me,
        loading: READY,
        user: user,
      });
    }
  }

  getName() {
    if (this.state.user.account_type == 'ambassador') {
      return this.state.user.brand.name;
    }

    if (this.state.user.account_type == 'owner') {
      return this.state.user.salon.name;
    }

    return `${this.state.user.first_name} ${this.state.user.last_name}`;
  }

  renderAccountIcon() {
    var icon, iconColor, iconSize;
    switch (this.state.user.account_type) {
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

  _tabsForStylistAmbassador = () => {
    return (
      <ScrollableTabView
        renderTabBar={() => <LinkTabBar />}
        initialPage={0}
        style={{ backgroundColor: 'white' }}
      >
        <UserAbout
          tabLabel="About"
          navigator={this.props.navigator}
          profile={this.state.user}
        />
        <UserPosts
          tabLabel="Posts"
          navigator={this.props.navigator}
          profile={this.state.user}
        />
        <UserHairfolio
          tabLabel="Hairfolio"
          navigator={this.props.navigator}
          profile={this.state.user}
        />
      </ScrollableTabView>
    );
  }

  _tabsForConsumer = () => {
    return (
      <ScrollableTabView
        renderTabBar={() => <LinkTabBar />}
        initialPage={0}
        style={{ backgroundColor: 'white' }}
      >
        <UserPosts
          tabLabel="Posts"
          navigator={this.props.navigator}
          profile={this.state.user}
        />
        <UserHairfolio
          tabLabel="Hairfolio"
          navigator={this.props.navigator}
          profile={this.state.user}
        />
      </ScrollableTabView>
    );
  }

  _tabsForOwner = () => {
    return (
      <ScrollableTabView
        renderTabBar={() => <LinkTabBar />}
        initialPage={0}
        style={{ backgroundColor: 'white' }}
      >
        <UserAbout
          tabLabel="About"
          navigator={this.props.navigator}
          profile={this.state.user}
        />
        <UserPosts
          tabLabel="Posts"
          navigator={this.props.navigator}
          profile={this.state.user}
        />
        <UserHairfolio
          tabLabel="Hairfolio"
          navigator={this.props.navigator}
          profile={this.state.user}
        />
        <UserStylists
          tabLabel="Stylists"
          navigator={this.props.navigator}
          profile={this.state.user}
        />
      </ScrollableTabView>
    );
  }

  _tabsForAccountType = () => {
    switch (this.state.user.account_type) {
      case 'stylist':
        return this._tabsForStylistAmbassador();
      case 'ambassador':
        return this._tabsForStylistAmbassador();
      case 'owner':
        return this._tabsForOwner();
      default:
        return this._tabsForConsumer();
    }
  }

  _renderLoadingContainer = () => {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.WHITE,
      }}>
        <LoadingContainer
          loadingStyle={{
            textAlign: 'center'
          }}
          ref="loadingC"
          state={[this.state.loading]}
        />
      </View>
    );
  }

  _renderBackButton = () => {
    if (this.state.user.id !== toJS(UserStore.user).id) {
      return (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: STATUSBAR_HEIGHT + 5,
            left: 10
          }}
          onPress={() => this.props.navigator.pop({ animated: true })}
        >
          <Image
            source={whiteBack}
            style={{height: 16, width: 26}}
          />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  _renderProfile = () => {
    this.height = (this.state.user.id === toJS(UserStore.user).id ? 183.5 : 223.5) + 40;
    window.profile = toJS(this.state.user);
    window.user2 = toJS(UserStore.user);
    const isMe = window.profile.id === window.user2.id;
    window.profileState = this;
    setTimeout(() => this.scrollToFakeTop(), 400);
    return (
      <BannerErrorContainer
        ref="ebc"
        style={{ flex: 1 }}
      >
        <View style={{flex: 1}}>
          <Image
            ref="headerImageWrapper"
            resizeMode="cover"
            source={{uri: utils.getUserProfilePicURI(this.state.user, EnvironmentStore.environment)}}
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
            <WrappingScrollView
              onScroll={(e) => {

                this.y = e.nativeEvent.contentOffset.y;

                this.refs.headerImageWrapper.setNativeProps({
                  style: {
                    height: e.nativeEvent.contentOffset.y < 0 ? this.height - e.nativeEvent.contentOffset.y : this.height
                  }
                });
                var opacityQuote = Math.min(Math.max(0, -e.nativeEvent.contentOffset.y / 20), 1);
                this.refs.quote.setNativeProps({
                  style: {
                    opacity: opacityQuote
                  }
                });

                var opacityContent = opacityQuote;
                if (e.nativeEvent.contentOffset.y < 60)
                  opacityContent = 1 - Math.min((-e.nativeEvent.contentOffset.y - 60) / 30, 1);

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
                    pointerEvents: opacityContent > 0 ? 'auto' : 'none'
                  });
                }

                if (this.refs.blackbook) {
                  this.refs.blackbook.setNativeProps({
                    style: {
                      opacity: opacityContent
                    },
                    pointerEvents: opacityContent > 0 ? 'auto' : 'none'
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
                    opacity: 1
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
                      source={{uri: utils.getUserProfilePicURI(this.state.user, EnvironmentStore.environment)}}
                      style={{
                        height: SCALE.h(130),
                        width: SCALE.h(130),
                        borderRadius: SCALE.h(130) / 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)'
                      }}
                    />
                    {this.state.user.account_type !== 'consumer' ? <View style={{
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
                      }}>{this.state.user.likes_count} Stars</Text>
                      <View style={{width: 10}} />
                      <Text style={{
                        color: COLORS.WHITE,
                        fontFamily: FONTS.BOOK_OBLIQUE,
                        fontSize: SCALE.h(28),
                        textAlign: 'center',
                        backgroundColor: 'transparent'
                      }}>{this.state.user.followers_count} Followers</Text>
                  </View>
                    {this.state.user.id !== UserStore.user.id ? <View style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: SCALE.h(20)
                    }}>
                      <View>
                        {!this.state.followed ?
                          <ProfileButton
                            disabled={utils.isLoading(UserStore.followingStates.get(this.state.user.i) || EMPTY)}
                            label="FOLLOW"
                            onPress={() => {
                              UserStore.followUser(this.state.user.id);
                            }}
                          />
                        :
                          <ProfileButton
                            color={COLORS.FOLLOWING}
                            disabled={utils.isLoading(UserStore.followingStates.get(this.state.user.id) || EMPTY)}
                            label="FOLLOWING"
                            onPress={() => {
                              UserStore.unfollowUser(this.state.user.id);
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
                              let userObjects = [
                                {
                                  user : {
                                    id: this.state.user.id
                                  }
                                }
                              ];

                              MessageDetailsStore.createConversation(userObjects);
                              MessageDetailsStore.title = this.getName();
                              this.props.navigator.push({
                                screen: 'hairfolio.MessageDetails',
                                navigatorStyle: NavigatorStyles.basicInfo,
                              });
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
                {this.state.user.account_type && <UserProfileNavigationBar color={COLORS[this.state.user.account_type.toUpperCase()]} />}
              </View>
              {this._tabsForAccountType()}
            </WrappingScrollView>
            {this._renderBackButton()}
            {this.state.user === UserStore.user ? <View ref="settings" style={{
              position: 'absolute',
              top: STATUSBAR_HEIGHT + 5,
              right: 10
            }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigator.push({
                    screen: 'hairfolio.EditCustomer',
                    navigatorStyle: NavigatorStyles.basicInfo,
                    title: 'Settings',
                  });
                }}
              >
                <Icon
                  color={COLORS.WHITE}
                  name="settings"
                  size={SCALE.h(48)}
                />
              </TouchableOpacity>
            </View> : null}
            {this.state.user.id === toJS(UserStore.user).id ?
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
                      this.props.navigator.push({
                        screen: 'hairfolio.BlackBook',
                        navigatorStyle: NavigatorStyles.tab,
                      });
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
      </BannerErrorContainer>
    );
  }

  render() {
    if (this.state.loading === READY) {
      return this._renderProfile();
    } else {
      return this._renderLoadingContainer();
    }
  }
};
