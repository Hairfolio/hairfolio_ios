import { h } from 'Hairfolio/src/helpers';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Dimensions, Image, StatusBar, Text, TouchableOpacity, View, AsyncStorage } from 'react-native';
import { BlurView } from 'react-native-blur';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import whiteBack from '../../resources/img/nav_white_back.png';
import NavigatorStyles from '../common/NavigatorStyles';
import BannerErrorContainer from '../components/BannerErrorContainer';
import ProfileButton from '../components/Buttons/Profile';
import Icon from '../components/Icon';
import LoadingContainer from '../components/LoadingContainer';
import LinkTabBar from '../components/post/LinkTabBar';
import UserProfileNavigationBar from '../components/UserProfile/Bar';
import WrappingScrollView from '../components/WrappingScrollView';
import { EMPTY, LOADING, READY, STATUSBAR_HEIGHT } from '../constants';
import UserAbout from '../containers/UserAbout';
import BlackBookStore from '../mobx/stores/BlackBookStore';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import FavoriteStore from '../mobx/stores/FavoriteStore';
import HairfolioStore from '../mobx/stores/HairfolioStore';
import FeedStore from '../mobx/stores/FeedStore';
import MessageDetailsStore from '../mobx/stores/MessageDetailsStore';
import SearchDetailsStore from '../mobx/stores/search/SearchDetailsStore';
import { StoreFactory } from '../mobx/stores/UserPostStoreFactory';
import UsersStore from '../mobx/stores/UsersStore';
import UserStore from '../mobx/stores/UserStore';
import { COLORS, FONTS, SCALE } from '../style';
import utils from '../utils';
import ActivityTab from './ActivityTab';
import Starred from './Starred';
import { showLog, getUserId, showAlert, windowHeight, ActivityIndicator } from '../helpers';
import ServiceBackend from '../backend/ServiceBackend';
// import AndroidRemoteInput from '../../react-native-firebase/dist/modules/notifications/AndroidRemoteInput';
import AndroidRemoteInput from 'react-native-firebase/dist/modules/notifications/AndroidRemoteInput';
import UserPostStore from '../mobx/stores/UserPostStore';
var { height, width } = Dimensions.get('window');

@observer
export default class Profile extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      is_loaded : false
    };

    if (this.props.userId) {

      showLog("PROFILE MINE ==> "+JSON.stringify(this.props.userId))
      this.state = {
        followed: false,
        loading: UsersStore.usersStates.get(this.props.userId) || LOADING,
        user: UsersStore.users.get(this.props.userId),
      };
    } else {

      showLog("PROFILE OTHERS ==> "+JSON.stringify(this.props.userId))
      this.state = {
        followed: UserStore.user.is_followed_by_me,
        loading: READY,
        user: UserStore.user,
      };
    }

    this.userId = this.props.userId || this.state.user.id;
    UserStore.opponentUser = this.state.user;

    this.props.navigator.addOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    // this.unsuscribeNavEvent = this.props.navigator.addOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  /* onNavigatorEvent(event) {
    switch(event.id) {
      case 'willAppear':
      this.props.navigator.popToRoot({
        animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
        animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
      });
        
        this.props.navigator.toggleTabs({
          to: 'shown',
        });
        break;        
      default:
        break;
    }
  } */

  componentWillMount() {
    // this.fetchProfile();
  }

  loadScreenOnAppear() {  
    this.fetchProfile();  
    this._fetchUserPosts();
    this._fetchUserHairfolios();
    this._fetchFavoritesPosts();
    // UserPostStore.load();
    // FavoriteStore.load();
  }  

  componentWillUnmount() {
    // StoreFactory.freeUserStore(this.userId);
    // this.unsuscribeNavEvent();
  }

  fetchProfile() {
    showLog("fetchProfile ==> " + this.userId);
    StoreFactory.initUserStore(this.userId);
    this._fetchProfile();
    // this._fetchUserPosts();
    this._fetchUserHairfolios();
    StatusBar.setBarStyle('light-content', true);
    this.props.navigator.toggleTabs({
      to: 'shown',
    });
  }

  onNavigatorEvent(event) {
    showLog("event.id profile11==> " + event.id);
    
    switch (event.id) {
        case 'willAppear':
        
        break;
        case 'bottomTabSelected':
        this.props.navigator.toggleTabs({
          to: 'shown',
        });        
       
        // if (this.props.from_feed) {
        //   this.props.navigator.resetTo({
        //     screen: 'hairfolio.Feed',
        //     animationType: 'fade',
        //     navigatorStyle: NavigatorStyles.tab
        //   });
        // }
        // if (this.props.from_star) {
        //   this.props.navigator.resetTo({
        //     screen: 'hairfolio.Favourites',
        //     animationType: 'fade',
        //     navigatorStyle: NavigatorStyles.tab
        //   });
        // }
        break;

        case "didAppear":
        StoreFactory.initUserStore(this.userId);
        this.setState({ is_loaded: true });
        this.loadScreenOnAppear();
        break;

        case "bottomTabReselected":     
        // StoreFactory.initUserStore(this.userId);
        // this.loadScreenOnAppear();
        break;

        case "willDisappear":
        // StoreFactory.freeUserStore(this.userId);
        // this._fetchUserHairfolios();
        break;

        case "didDisappear":
        StoreFactory.freeUserStore(this.userId);
        // this.userId = UserStore.user.id;   
        // StoreFactory.initUserStore(this.userId);
        // this.loadScreenOnAppear();
        // this._fetchUserHairfolios();
        // this._fetchUserPosts();
        // FavoriteStore.load();
        break;

      default:
        break;
    }
  }

  _fetchProfile = async() => {
    UsersStore.getUser(this.userId)
      .then(() => {
        HairfolioStore.load(this.userId);
        this._userStateChanged(UsersStore.usersStates.get(this.userId))
      });
      if(!UserStore.opponentUser){
        let result2 = await ServiceBackend.get(`users/${this.userId}`);
        if(result2){
          UserStore.opponentUser = (result2.user) && result2.user;
        }
      }
  }

  _fetchUserPosts = () => {
    StoreFactory.load(this.userId);
  }

  _fetchUserHairfolios = () => {
   
    HairfolioStore.load(this.userId);
  }

  _fetchFavoritesPosts = () => {
    FavoriteStore.reset();
    let obj = {"user_id" : this.userId}
    FavoriteStore.load(obj);
  }

  _userStateChanged = (newState) => {


    if (newState === READY) {
      const user = UsersStore.users.get(this.userId);

      this.setState({
        followed: user.is_followed_by_me,
        loading: READY,
        user: user,
      });
      UserStore.opponentUser = user;
    }
  }

  getName() {
    // showLog("getname ==>" + JSON.stringify(this.state.user))
    if (this.state.user.account_type == 'ambassador') {
      if (this.state.user.brand) {
        return (this.state.user.brand.name.toLowerCase() == "null" || this.state.user.brand.name == null) ? "" : this.state.user.brand.name;
      }
      return '';

    }

    if (this.state.user.account_type == 'owner') {
      if (this.state.user.salon) {
        return (this.state.user.salon.name.toLowerCase() == "null" || this.state.user.salon.name == null) ? "" : this.state.user.salon.name;
      }
      return '';
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
    // if (this.y >= (this.height - 50))
    //   this.refs.scrollView.scrollTo({
    //     animated: false,
    //     y: this.height - 50
    //   });
  }

  _tabsForStylistAmbassador = (from) => {
    return (
      <ScrollableTabView
        locked={true}
        renderTabBar={() => <LinkTabBar />}
        initialPage={0}
        style={{ backgroundColor: 'white' }}
      >
        <UserAbout
          tabLabel="About"
          navigator={this.props.navigator}
          profile={this.state.user}
        />
        {/* <UserPosts
          tabLabel="Posts"
          navigator={this.props.navigator}
          profile={this.state.user}
        /> */}
        {/* <UserHairfolio
          tabLabel="Hairfolio"
          navigator={this.props.navigator}
          profile={this.state.user}
          from_star={from}
        /> */}

        <Starred
          tabLabel="Hairfolio"
          navigator={this.props.navigator}
          profile={this.state.user}
          // profile={UserStore.opponentUser}
          from={from}
          id={this.userId}
        />

        { (this.userId == UserStore.user.id) &&
        <ActivityTab
          tabLabel="Activity"
          navigator={this.props.navigator}
          profile={this.state.user}
          from={from}
        />
        }
      </ScrollableTabView>
    );
  }

  _tabsForConsumer = (from) => {
    return (
      <ScrollableTabView
        locked={true}
        renderTabBar={() => <LinkTabBar />}
        initialPage={0}
        style={{ backgroundColor: 'white' }}
      >
        {/* <UserPosts
          tabLabel="Posts"
          navigator={this.props.navigator}
          profile={this.state.user}
        />
        <UserHairfolio
          tabLabel="Hairfolio"
          navigator={this.props.navigator}
          profile={this.state.user}
          from_star={from}
        /> */}
        <Starred
          tabLabel="Hairfolio"
          navigator={this.props.navigator}
          profile={this.state.user}
          // profile={UserStore.opponentUser}
          from={from}
          id={this.userId}
        />

        { (this.userId == UserStore.user.id) &&
        <ActivityTab
          tabLabel="Activity"
          navigator={this.props.navigator}
          profile={this.state.user}
          from={from}
        />
        }
      </ScrollableTabView>
    );
  }

  _tabsForOwner = (from) => {
    return (
      <ScrollableTabView
        locked={true}
        renderTabBar={() => <LinkTabBar />}
        initialPage={0}
        style={{ backgroundColor: 'white' }}
      >
        <UserAbout
          tabLabel="About"
          navigator={this.props.navigator}
          profile={this.state.user}
        />
        {/* <UserPosts
          tabLabel="Posts"
          navigator={this.props.navigator}
          profile={this.state.user}
        />
        <UserHairfolio
          tabLabel="Hairfolio"
          navigator={this.props.navigator}
          profile={this.state.user}
          from_star={from}
        />
        <UserStylists
          tabLabel="Stylists"
          navigator={this.props.navigator}
          profile={this.state.user}
        /> */}

        <Starred
          tabLabel="Hairfolio"
          navigator={this.props.navigator}
          profile={this.state.user}
          // profile={UserStore.opponentUser}
          from={from}
          id={this.userId}
        />

        { (this.userId == UserStore.user.id) &&
        <ActivityTab
          tabLabel="Activity"
          navigator={this.props.navigator}
          profile={this.state.user}
          from={from}
        />
        }
      </ScrollableTabView>
    );
  }

  _tabsForAccountType = () => {
    switch (this.state.user.account_type) {
      case 'stylist':
        return this._tabsForStylistAmbassador(this.props.from_star);
      case 'ambassador':
        return this._tabsForStylistAmbassador(this.props.from_star);
      case 'owner':
        return this._tabsForOwner(this.props.from_star);
      default:
        return this._tabsForConsumer(this.props.from_star);
    }
  }

  _renderLoadingContainer = (isLoading = false) => {
    if(isLoading){
      return(<View style={{ flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" />
      </View>)
    } else {
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
  }

  _renderBackButton = () => {
    if (this.state.user.id !== toJS(UserStore.user).id) {
      return (
        <TouchableOpacity
          style={{
            position: 'absolute',
            // top: STATUSBAR_HEIGHT + 5,
            // left: 10
            top: (height > 800) ? STATUSBAR_HEIGHT + 25 : STATUSBAR_HEIGHT + 5,
            left: (height > 800) ? 18 : 10,
          }}
          onPress={() => {
            this.state = {
              followed: UserStore.user.is_followed_by_me,
              loading: READY,
              user: UserStore.user,
            };
    
            setTimeout(() => {
              this.userId = this.state.user.id;
              UserStore.opponentUser = this.state.user;
              this.props.navigator.popToRoot({
                animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
                animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
              });
              this.props.navigator.toggleTabs({
                to: 'shown',
              });
            }, 1000);   
            
            // this.props.navigator.pop({ animated: true })         
          }}
        >
          <Image
            source={whiteBack}
            style={{ height: 16, width: 26 }}
          />
        </TouchableOpacity>
      );
    }else if (this.props.from_feed) {
      return (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: (height > 800) ? STATUSBAR_HEIGHT + 25 : STATUSBAR_HEIGHT + 5,
            left: (height > 800) ? 18 : 10,
          }}
          onPress={() => this.props.navigator.pop({ animated: true })}
        >
          <Image
            source={whiteBack}
            style={{ height: 16, width: 26 }}
          />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  _renderBackButtonOld = () => {
    if (this.state.user.id !== toJS(UserStore.user).id) {
      return (
        <TouchableOpacity
          style={{
            position: 'absolute',
            // top: STATUSBAR_HEIGHT + 5,
            // left: 10
            top: (height > 800) ? STATUSBAR_HEIGHT + 25 : STATUSBAR_HEIGHT + 5,
            left: (height > 800) ? 18 : 10,
          }}
          onPress={() => this.props.navigator.pop({ animated: true })}
        >
          <Image
            source={whiteBack}
            style={{ height: 16, width: 26 }}
          />
        </TouchableOpacity>
      );
    }else if (this.props.from_feed) {
      return (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: (height > 800) ? STATUSBAR_HEIGHT + 25 : STATUSBAR_HEIGHT + 5,
            left: (height > 800) ? 18 : 10,
          }}
          onPress={() => this.props.navigator.pop({ animated: true })}
        >
          <Image
            source={whiteBack}
            style={{ height: 16, width: 26 }}
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
        <View style={{ flex: 1 }}>
          <Image
            ref="headerImageWrapper"
            resizeMode="cover"
            source={{ uri: utils.getUserProfilePicURI(this.state.user, EnvironmentStore.environment) }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: this.height,
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
                    // opacity: opacityContent
                  }
                });

                if (this.refs.settings) {
                  this.refs.settings.setNativeProps({
                    style: {
                      // opacity: opacityContent
                    },
                    pointerEvents: opacityContent > 0 ? 'auto' : 'none'
                  });
                }

                if (this.refs.blackbook) {
                  this.refs.blackbook.setNativeProps({
                    style: {
                      // opacity: opacityContent
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
                <View ref="headerContent" style={{ position: 'relative', alignItems: 'center' }}>
                  <View style={{
                    position: 'relative'
                  }}>
                    <Image
                      source={{ uri: utils.getUserProfilePicURI(this.state.user, EnvironmentStore.environment) }}
                      style={{
                        height: SCALE.h(130),
                        width: SCALE.h(130),
                        borderRadius: SCALE.h(130) / 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
                      }}

                      >{this.state.user.likes_count} Stars</Text>
                      <View style={{ width: 10 }} />
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
                            // disabled={utils.isLoading(UserStore.followingStates.get(this.state.user.i) || EMPTY)}
                            label="FOLLOW"
                            onPress={async() => {
                              this.setState({
                                loading: LOADING
                              })
                              let res = await UserStore.followUser(this.state.user.id);
                              if(res) {
                                this.setState({
                                  followed: res.is_followed_by_me
                                })
                              }
                              this.setState({
                                loading: READY
                              })
                              // this._fetchUserPosts();
                              // let s_store = SearchDetailsStore[this.props.store_name];
                              // // alert(this.props.store_name)
                              // //let s_store = SearchDetailsStore.salonStore;

                              // s_store = s_store.allUsers;

                              // for (var i = 0; i < s_store.length; i++) {
                              //   if (s_store[i].user.id == this.state.user.id) {
                              //     s_store[i].isFollowing = true;
                              //   }
                              // }
                              // showLog("SalonSearch ==>" + JSON.stringify(s_store));
                            }}
                          />
                          :
                          <ProfileButton
                            color={COLORS.FOLLOWING}
                            // disabled={utils.isLoading(UserStore.followingStates.get(this.state.user.id) || EMPTY)}
                            label="FOLLOWING"
                            onPress={ async() => {
                              this.setState({
                                loading: LOADING
                              })
                              let res = await UserStore.unfollowUser(this.state.user.id);
                              if(res) {
                                this.setState({
                                  followed: res.is_followed_by_me
                                })
                              }
                              this.setState({
                                loading: READY
                              })
                              // this._fetchUserPosts();
                              
                              //let s_store = SearchDetailsStore.salonStore;
                              // let s_store = SearchDetailsStore[this.props.store_name];
                              // s_store = s_store.allUsers;

                              // for (var i = 0; i < s_store.length; i++) {
                              //   if (s_store[i].user.id == this.state.user.id) {
                              //     s_store[i].isFollowing = false;

                              //   }
                              // }
                              // showLog("SalonSearch ==>" + JSON.stringify(s_store));

                            }}
                          />
                        }
                      </View>
                      <View style={{ width: SCALE.w(25) }} />
                      <View>
                        <ProfileButton
                          label="MESSAGE"
                          onPress={
                            () => {
                              let userObjects = [
                                {
                                  user: {
                                    id: this.state.user.id
                                  }
                                }
                              ];

                              MessageDetailsStore.createConversation(userObjects);
                              MessageDetailsStore.title = this.getName();
                              if (this.props.from_star) {
                                this.props.navigator.push({
                                  screen: 'hairfolio.MessageDetails',
                                  navigatorStyle: NavigatorStyles.basicInfo,
                                  passProps: {
                                    'from_star': true
                                  }
                                });

                              } else {
                                this.props.navigator.push({
                                  screen: 'hairfolio.MessageDetails',
                                  navigatorStyle: NavigatorStyles.basicInfo,
                                });
                              }

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


              {this._renderBackButton()}
            {this.userId === toJS(UserStore.user).id ? <View ref="settings" style={{
              position: 'absolute',
              top: (height > 800) ? STATUSBAR_HEIGHT + 25 : STATUSBAR_HEIGHT + 5,
              right: (height > 800) ? 15 : 10,
              padding: 0,

            }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigator.push({
                    screen: 'hairfolio.EditCustomer',
                    navigatorStyle: NavigatorStyles.basicInfo,
                    title: 'Settings'
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
            {this.userId === toJS(UserStore.user).id ?
              <View
                style={{
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
                    style={{ height: h(64), width: h(48) }}
                    source={require('img/black_book.png')}
                  />
                </TouchableOpacity>
              </View> : null}
            </WrappingScrollView>
            
          </BlurView>
        </View>
      </BannerErrorContainer>
    );
  }

  render() {    
    if(this.state.is_loaded){
      return this.render2();
    }else{
      return null;
    }    
  }

  render2() {
    if (this.state.loading === READY) {
      return this._renderProfile();
    } else {
      return this._renderLoadingContainer(true);
    }
  }
};
AndroidRemoteInput