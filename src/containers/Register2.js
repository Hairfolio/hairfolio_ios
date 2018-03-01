import React from 'react';
import _ from 'lodash';
import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import utils from '../utils';
import { h } from '../style';
import { Dims, READY } from '../constants';
import Picker from '../components/Picker';
import ServiceBackend from '../backend/ServiceBackend';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import UserStore from '../mobx/stores/UserStore';
import NavigatorStyles from '../common/NavigatorStyles';
import whiteBack from '../../resources/img/nav_white_back.png';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import OAuthStore from '../mobx/stores/OAuthStore';
import CloudinaryStore from '../mobx/stores/CloudinaryStore';
import BannerErrorContainer from '../components/BannerErrorContainer';

const styles = StyleSheet.create({
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dims.deviceHeight,
    width: Dims.deviceWidth,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  logo: {
    height: h(42),
    width: h(383),
    marginBottom: 30,
  },
});

const CHOICES = [ { label: 'Consumer' }, { label: 'Stylist' }, { label: 'Salon' }, { label: 'Brand' }]
const TYPES = {
  Consumer: 'consumer',
  Stylist: 'stylist',
  Salon: 'salon',
  Brand: 'brand',
};

@observer
export default class Register2 extends PureComponent {
  state = {};

  constructor(props) {
    super(props);

    reaction(
      () => OAuthStore.token,
      () => {
        if (OAuthStore.status === READY) {
          UserStore.signupWithInstagram(OAuthStore.token, OAuthStore.userType)
            .then(() =>  OAuthStore.reset())
            .catch(e => {
              this.refs.ebc.error(e);
              OAuthStore.reset();
            });
        }
      }
    );
  }

  static navigatorButtons = {
    leftButtons: [
      {
        id: 'back',
        icon: whiteBack,
      }
    ]
  }

  _doneTapped = (item) => {
    if (item && UserStore.registrationMethod === 'email') {
      this.props.navigator.push({
        screen: 'hairfolio.BasicInfo',
        title: this._titleForAccountType(item),
        passProps: this._propsForAccountType(item),
        navigatorStyle: NavigatorStyles.basicInfo,
      });
    } else if (UserStore.registrationMethod === 'facebook') {
      this._loginWithFacebook(item);
    } else {
      this._loginWithInstagram(item);
    }
  }

  _titleForAccountType = (item) => {
    var type = TYPES[item.label];
    switch (type) {
      case 'stylist':
        return 'Stylist Account';
      case 'brand':
        return 'Brand Account';
      case 'salon':
        return 'Salon Account';
      default:
        return 'Consumer Account';
    }
  }

  _propsForAccountType = (item) => {
    var type = TYPES[item.label];
    switch (type) {
      case 'stylist':
        return {
          accountType: 'stylist',
          detailFields: [
            {
              placeholder: 'First Name',
              ppte: 'first_name'
            },
            {
              placeholder: 'Last Name',
              ppte: 'last_name'
            }
          ],
        };
      case 'brand':
        return {
          accountType: 'brand',
          detailFields: [
            {
              placeholder: 'Brand Name',
              ppte: 'business.name'
            }
          ],
        };
      case 'salon':
        return {
          accountType: 'salon',
          detailFields: [
            {
              placeholder: 'Salon Name',
              ppte: 'business.name'
            }
          ],
        };
      default:
        return {
          accountType: 'consumer',
          detailFields: [
            {
              placeholder: 'First Name',
              ppte: 'first_name'
            },
            {
              placeholder: 'Last Name',
              ppte: 'last_name'
            }
          ],
        };
    }
  }

  _loginWithFacebook= (item) => {
    var type = TYPES[item.label];
    EnvironmentStore.loadEnv()
      .then(() => LoginManager.logInWithReadPermissions(['email']))
      .then(() => AccessToken.getCurrentAccessToken())
      .then(data => data.accessToken.toString())
      .then(token => {
        UserStore.signupWithFacebook(token, type)
      })
      .then(() => {
        let userId = UserStore.user.id;
        ServiceBackend.put('users/' + userId,
          {
            user: {
              account_type: type
            }
          }
        );
        this._navigateToNextStep(type);
      },
      (e) => {
        this.refs.ebc.error(e);
      }
    );
  }

  _loginWithInstagram = (item) => {
    var type = TYPES[item.label];
    OAuthStore.setInstagramOauthConfig()
    .then(() => {
      OAuthStore.setUserType(type);
      this.props.navigator.push({
        screen: 'hairfolio.LoginOAuth',
        title: 'Instagram',
        navigatorStyle: NavigatorStyles.basicInfo,
      });
    });
  }

  _navigateToNextStep = (type) => {
    switch (type) {
      case 'stylist':
        this.props.navigator.resetTo({
          screen: 'hairfolio.StylistInfo',
          animationType: 'fade',
          title: 'Professional Info',
          navigatorStyle: NavigatorStyles.basicInfo,
        });
        break;
      case 'salon':
        this.props.navigator.resetTo({
          screen: 'hairfolio.SalonInfo',
          animationType: 'fade',
          title: 'Professional Info',
          navigatorStyle: NavigatorStyles.basicInfo,
        });
        break;
      case 'brand':
        this.props.navigator.resetTo({
          screen: 'hairfolio.BrandInfo',
          animationType: 'fade',
          title: 'Professional Info',
          navigatorStyle: NavigatorStyles.basicInfo,
        });
        break;
      default:
        break;
    }
  }

  render() {
    const disabled = utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth]);
    return (
      <Image
        resizeMode="cover"
        source={require('../images/onboarding.jpg')}
        style={styles.backgroundContainer}
      >
        <BannerErrorContainer style={styles.container} ref="ebc">
          <View
            style={styles.buttonContainer}
          >
            <Image
              style={styles.logo}
              source={require('img/onboarding_logo.png')}
            />
            <Picker
              choices={CHOICES}
              disabled={disabled}
              onDone={(item = {}) => {
                this._doneTapped(item);
              }}
              placeholder="Select account type"
            />
          </View>
        </BannerErrorContainer>
      </Image>
    );
  }
};
