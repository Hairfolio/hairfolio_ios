import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NavigatorStyles from '../common/NavigatorStyles';
import FollowButton from '../components/Buttons/Follow';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import UserStore from '../mobx/stores/UserStore';
import { COLORS, FONTS, SCALE } from '../style';
import utils from '../utils';

export default class UserStylist extends React.Component {
  static propTypes = {
    profile: React.PropTypes.object.isRequired,
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
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 10
        }}
      >
        {this.props.profile.stylists && this.props.profile.stylists.count() ?
          this.props.profile.stylists.map(stylist => <TouchableOpacity
            key={stylist.id}
            onPress={() => {
              navigator.push({
                screen: 'hairfolio.Profile',
                navigatorStyle: NavigatorStyles.tab,
                passProps: {
                  userId: stylist.id,
                }
              });
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
    );
  }
};
