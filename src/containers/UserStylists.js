import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {environment} from '../selectors/environment';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import {registrationActions} from '../actions/registration';

import FollowButton from '../components/Buttons/Follow';

import utils from '../utils';

import {appStack} from '../routes';

@connect(app, user, environment)
export default class UserStylist extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    environment: React.PropTypes.object.isRequired,
    followingStates: React.PropTypes.object.isRequired,
    onLayout: React.PropTypes.func.isRequired,
    profile: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  renderFollowButton(stylist) {
    if (stylist.get('id') === this.props.user.get('id'))
      return null;

    return (<FollowButton
      disabled={utils.isLoading(this.props.followingStates.get(stylist.get('id')))}
      icon={utils.isFollowing(this.props.user, stylist) ? 'check' : null}
      label={utils.isFollowing(this.props.user, stylist) ? 'FOLLOWED' : 'FOLLOW'}
      onPress={() => {
        if (utils.isFollowing(this.props.user, stylist))
          this.props.dispatch(registrationActions.unfollowUser(stylist.get('id')));
        else
          this.props.dispatch(registrationActions.followUser(stylist.get('id')));
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
        {this.props.profile.get('stylists') && this.props.profile.get('stylists').count() ?
          this.props.profile.get('stylists').map(stylist => <TouchableOpacity
            key={stylist.get('id')}
            onPress={() => {
              appStack.scene().goToProfile(stylist.get('id'));
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
                source={{uri: utils.getUserProfilePicURI(this.props.profile, this.props.environment)}}
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
              }}>{stylist.get('first_name')} {stylist.get('last_name')}</Text>

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
