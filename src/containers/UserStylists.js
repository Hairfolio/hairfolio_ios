import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import UserStore from '../mobx/stores/UsersStore';
import AppStore from '../mobx/stores/AppStore';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import FollowButton from '../components/Buttons/Follow';

import utils from '../utils';

import {appStack} from '../routes';

export default class UserStylist extends PureComponent {
  static propTypes = {
    onLayout: React.PropTypes.func.isRequired,
    profile: React.PropTypes.object.isRequired,
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  renderFollowButton(stylist) {
    if (stylist.id === this.props.user.id)
      return null;

    return (<FollowButton
      disabled={utils.isLoading(UserStore.followingStates[stylist.id])}
      icon={utils.isFollowing(UserStore.user, stylist) ? 'check' : null}
      label={utils.isFollowing(UserStore.user, stylist) ? 'FOLLOWED' : 'FOLLOW'}
      onPress={() => {
        if (utils.isFollowing(UserStore.user, stylist))
          UserStore.unfollowUser(stylist.id);
        else
          UserStore.followUser(stylist.id);
      }}
    />);
  }

  render() {
    // if the map is not good for the performance.
    // even if the scroll component is the wrapping profile scrollview which has multiple tabs
    // it is still possible to use the ListView component by leveraging the renderScrollComponent
    // the idea would be to pass a sort of proxy that relay/pass to/from the wrapping scrollview
    // methods to implements can be seen in the react-native/ListView implementation

    return (<NavigationSetting
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
      }}
    >
      <View
        onLayout={this.props.onLayout}
      >
        {this.props.profile.stylists && this.props.profile.stylists.count() ?
          this.props.profile.stylists.map(stylist => <TouchableOpacity
            key={stylist.id}
            onPress={() => {
              appStack.scene().goToProfile(stylist.id);
            }}
            style={{
              flexDirection: 'row'
            }}
          >
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: SCALE.w(120),
              height: SCALE.w(120),
              marginRight: 5
            }}>
              <Image
                source={{uri: utils.getUserProfilePicURI(this.props.profile, EnvironmentStore.environment)}}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  width: SCALE.h(80),
                  height: SCALE.h(80),
                  borderRadius: SCALE.h(80) / 2
                }}
              />
            </View>

            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: COLORS.LIGHT4
            }}>
              <Text style={{
                fontFamily: FONTS.MEDIUM,
                fontSize: SCALE.h(28),
                color: COLORS.DARK
              }}>{stylist.first_name} {stylist.last_name}</Text>

              {this.renderFollowButton(stylist)}
            </View>
          </TouchableOpacity>)
        :
          <Text style={{
            fontFamily: FONTS.MEDIUM,
            fontSize: SCALE.h(26),
            color: COLORS.TEXT,
            marginTop: 10
          }}>No stylists for the moment</Text>
        }
      </View>
    </NavigationSetting>);
  }
};
