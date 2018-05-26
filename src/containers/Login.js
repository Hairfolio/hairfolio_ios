import React from 'react';
import _ from 'lodash';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
// import {mixin} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS, SCALE, h } from '../style';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import SimpleButton from '../components/Buttons/Simple';
import CustomTouchableOpacity from '../components/CustomTouchableOpacity';
import { Dims, READY, LOADING_ERROR } from '../constants';
import NavigatorStyles from '../common/NavigatorStyles';
import utils from '../utils';
import { LOADING } from '../constants';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import UserStore from '../mobx/stores/UserStore';
import OAuthStore from '../mobx/stores/OAuthStore';
import Intro from '../components/Intro';
import ServiceBackend from '../backend/ServiceBackend';
import App from '../App';
var consumer_item=null;

const TYPES = {
  Consumer: 'consumer',
  Stylist: 'stylist',
  Salon: 'salon',
  Brand: 'brand',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dims.deviceHeight,
    width: Dims.deviceWidth,
  },
  buttonContainer: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: h(42),
    width: h(383),
    marginBottom: 30,
  },
});

@observer
export default class Login extends PureComponent {
  state = {};

  constructor(props) {
    super(props);

     reaction(
      () => OAuthStore.token,
      () => {
        if (OAuthStore.status === READY) {
          UserStore.loginWithInstagram(OAuthStore.token).then(
            ()=>{

              console.log("Logged in user ==>"+JSON.stringify(UserStore.user))
                    var user = UserStore.user;
                    consumer_item = user;
                    this._navigateToNextStep(user.account_type);    
                    OAuthStore.reset();

            },
            (e)=>{
              console.log("Error==>"+JSON.stringify(e))
              OAuthStore.reset();
            }
          );
          
        }
      }
    ); 


    /* reaction(
      () => OAuthStore.token,
      () => {
        if (OAuthStore.status === READY) {
          UserStore.loginWithInstagram(OAuthStore.token)
            .then(() =>  {
                    console.log("Logged in user ==>"+JSON.stringify(UserStore.user))
                    var user = UserStore.user;
                    consumer_item = user;
                    this._navigateToNextStep(user.account_type);    
              // console.log("STORE 123==>"+JSON.stringify(OAuthStore))
              // console.log("STORE 123==>"+OAuthStore.token+" TYPE ==>"+OAuthStore.userType)
              // this._navigateToNextStep(OAuthStore.userType);
              OAuthStore.reset()
            })
            .catch(e => {
              console.log("Error==>"+JSON.stringify(e))

              // this.refs.ebc.error(e);
              OAuthStore.reset();
            });
        }
      }
    ); */
  }

  componentDidMount() {
    if(this.props.sessionHasExpired) {
      alert('Session expired');
      OAuthStore.reset();
      UserStore.setHasSessionExpired(false);
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
      case 'consumer':

        App.startLoggedInApplication();


        // this.props.navigator.push({
        //   screen: 'hairfolio.BasicInfo',
        //   title: this._titleForAccountType(consumer_item),
        //   passProps: this._propsForAccountType(consumer_item),
        //   navigatorStyle: NavigatorStyles.basicInfo,
        // });     
      
      // this.props.navigator.resetTo({
      //   screen: 'hairfolio.BasicInfo',
      //   animationType: 'fade',
      //   title: 'Basic Info',
      //   navigatorStyle: NavigatorStyles.basicInfo,
      // });
      break;
      default:
        break;
    }
  }

  render() {
    return (
      <Image
        resizeMode="cover"
        source={require('../images/onboarding.jpg')}
        style={styles.backgroundContainer}
      >
      <View
        style={styles.container}
      >
        <View style={styles.buttonContainer}>
          <Image
            style={styles.logo}
            source={require('img/onboarding_logo.png')}
          />
          <View style={{paddingBottom: 10, alignSelf: 'stretch'}}>
            <SimpleButton
              color={COLORS.FB}
              disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
              icon="facebook"
              label="Sign In with Facebook"
              onPress={() => {
                EnvironmentStore.loadEnv()
                  .then(() => LoginManager.logInWithReadPermissions(['email']))
                  .then(() => AccessToken.getCurrentAccessToken())
                  .then(data => data.accessToken.toString())
                  .then(token => UserStore.loginWithFacebook(token))
                  .then(() => {
                    // console.log("Logged in user ==>"+JSON.stringify(UserStore.user))
                    var user = UserStore.user;
                    consumer_item = user;
                    this._navigateToNextStep(user.account_type);                    
                  },
                  (e) => {
                    // alert(e)
                    this.refs.ebc.error(e);
                  })                  
              }}
            />
          </View>
          <View style={{paddingBottom: 10, alignSelf: 'stretch'}}>
            <SimpleButton
              color={COLORS.IG}
              disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
              icon="instagram"
              label="Sign In with Instagram"
              onPress={() => {
                OAuthStore.setInstagramOauthConfig().then(() =>{
                  this.props.navigator.push({
                    screen: 'hairfolio.LoginOAuth',
                    title: 'Instagram',
                    navigatorStyle: NavigatorStyles.basicInfo,
                  });
                })
              }}
            />
          </View>
          <View style={{paddingBottom: SCALE.h(54), alignSelf: 'stretch'}}>
            <SimpleButton
              color={COLORS.DARK}
              disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
              icon="email"
              label="Sign In with email"
              onPress={() => {
                this.props.navigator.push({
                  screen: 'hairfolio.LoginEmail',
                  animationType: 'fade',
                  navigatorStyle: NavigatorStyles.onboarding,
                });
              }}
            />
          </View>
          <CustomTouchableOpacity
            disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
            onPress={() => {
              this.props.navigator.push({
                screen: 'hairfolio.ForgotPassword',
                navigatorStyle: NavigatorStyles.basicInfo,
                title: 'Forgot Password',
              });
            }}
          >
            <Text style={{
              fontFamily: FONTS.MEDIUM,
              fontSize: SCALE.h(28),
              color: COLORS.WHITE,
              textAlign: 'center'
            }}>Forgot your password?</Text>
          </CustomTouchableOpacity>
        </View>
        <CustomTouchableOpacity
          disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
          onPress={() => {
            this.props.navigator.resetTo({
              screen: 'hairfolio.Register',
              animationType: 'fade',
              navigatorStyle: NavigatorStyles.onboarding,
            });
          }}
        >
          <Text style={{
            fontFamily: FONTS.MEDIUM,
            fontSize: SCALE.h(28),
            color: COLORS.WHITE,
            textAlign: 'center',
            marginBottom: 10,
          }}>Don’t Have an Account? <Text style={{fontFamily: FONTS.HEAVY}}>Sign up</Text></Text>
        </CustomTouchableOpacity>
      </View>
      </Image>
    );
  }
};
