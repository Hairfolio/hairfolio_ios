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

import DeleteButton from '../components/Buttons/Delete';

import utils from '../utils';

import ProfileButton from '../components/Buttons/Profile';
import Icon from '../components/Icon';
import BannerErrorContainer from '../components/BannerErrorContainer';

import appEmitter from '../appEmitter';

import {registrationActions} from '../actions/registration';

import {STATUSBAR_HEIGHT, Dims} from '../constants';

import {editCustomerStack, loginStack} from '../routes';

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

  renderNextMilestone() {
    return (<View style={{justifyContent: 'center', flex: 1}}>
      <Text style={{
        textAlign: 'center'
      }}>full {this.props.profile.get('account_type')} profile in next milestone</Text>

      <View style={{height: 30}} />
      {this.props.profile === this.props.user ? <View>
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
            appEmitter.emit('logout', {destroy: true});
            _.first(this.context.navigators).jumpTo(loginStack);
          }}
        />
      </View> : null}
    </View>);
  }

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
      :
        this.renderNextMilestone()
      }
    </BannerErrorContainer>);
  }
};
