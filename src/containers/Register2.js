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
import App from '../App';

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

var client_id = 'c9ef6f5790154ba9ac777fccb6740e97';
var redirect_url = 'https://www.google.com';
var auth_url='https://api.instagram.com/oauth/authorize/?client_id='+client_id+'&redirect_uri='+redirect_url+'&response_type=token&scope=basic';
var consumer_item=null;

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
            .then(() =>  {
              console.log("STORE 123==>"+OAuthStore.token+" TYPE ==>"+OAuthStore.userType)

              let userId = UserStore.user.id;


              let post_data = {};

            if(OAuthStore.userType == 'brand'){
               post_data = {
                user: {
                  'brand_attributes':{
                    "name": 'null',
                    "info": null,
                    "address": null,
                    "city": null,
                    "state": null,
                    "zip": null,
                    "website": null,
                    "phone": null,
                    "services": []
                  },
                  'account_type': this.checkUserType(OAuthStore.userType)
                }
              }              

            }else if(OAuthStore.userType == 'salon'){

              post_data = {
                user: {
                  'salon_attributes': {
                    "name": "null",
                    "info": null,
                    "address":null,
                    "city": null,
                    "state": null,
                    "zip": null,
                    "website": null,
                    "phone": null
                  },
                  'account_type': this.checkUserType(OAuthStore.userType)
                }
              };              

            }else{
               post_data = {
                user: {
                  'account_type': this.checkUserType(OAuthStore.userType)
                }
              }
            }

           
            
            ServiceBackend.put('users/'+userId, post_data).then(
              (response)=>{
                console.log("signupWithInstagram response==>"+JSON.stringify(response))
                this._navigateToNextStep(OAuthStore.userType);
                OAuthStore.reset()
              },
              (err)=>{
                console.log("signupWithInstagram error==>"+JSON.stringify(err))
              }
            ); 

              /* this._navigateToNextStep(OAuthStore.userType);
              OAuthStore.reset() */
            })
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
      consumer_item = item;
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

  _loginWithFacebook2= (item) => {
    consumer_item = item;
    var type = TYPES[item.label];
    EnvironmentStore.loadEnv()
      .then(() => LoginManager.logInWithReadPermissions(['public_profile']))
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
        // alert(e)
        this.refs.ebc.error(e);
      }
    );
  }  

  checkUserType(user_role){
    if(user_role == 'salon'){
      return 'owner';
    }else if(user_role == 'brand'){
      return 'ambassador';
    }else{
      return user_role;
    }     
  }

  _loginWithFacebook3= (item) => {
    consumer_item = item;
    var type = TYPES[item.label];
    EnvironmentStore.loadEnv()
      .then(() => LoginManager.logInWithReadPermissions(['public_profile']))
      .then(() => AccessToken.getCurrentAccessToken())
      .then(data => data.accessToken.toString())
      .then(token => {
        console.log("token==>" + token)

        UserStore.signupWithFacebook(token, type).then(
          (res)=>{
            console.log("signupWithFacebook response==>" + JSON.stringify(res))
            UserStore.user = res.user;
            let userId = res.user.id;

            let post_data = {
              user: {
                'account_type': this.checkUserType(type)
              }
            }
            
            ServiceBackend.put('users/'+userId, post_data).then(
              (response)=>{
                console.log("_loginWithFacebook response==>"+JSON.stringify(response))
                this._navigateToNextStep(type);
              },
              (err)=>{
                console.log("_loginWithFacebook error==>"+JSON.stringify(err))
              }
            ); 
          },
          (error)=>{
            console.log("signupWithFacebook error==>" + JSON.stringify(error))

          }
        )
      });
  } 

  _loginWithFacebook= (item) => {
    consumer_item = item;
    var type = TYPES[item.label];
    EnvironmentStore.loadEnv()
      .then(() => LoginManager.logInWithReadPermissions(['public_profile']))
      .then(() => AccessToken.getCurrentAccessToken())
      .then(data => data.accessToken.toString())
      .then(token => {
        console.log("token==>" + token)

        UserStore.signupWithFacebook(token, type).then(
          (res)=>{
            console.log("signupWithFacebook response==>" + JSON.stringify(res))
            UserStore.user = res.user;
            let userId = res.user.id;

            let post_data = {};

            if(type == 'brand'){
               post_data = {
                user: {
                  'brand_attributes':{
                    "name": 'null',
                    "info": null,
                    "address": null,
                    "city": null,
                    "state": null,
                    "zip": null,
                    "website": null,
                    "phone": null,
                    "services": []
                  },
                  'account_type': this.checkUserType(type)
                }
              }              

            }else if(type == 'salon'){

              post_data = {
                user: {
                  'salon_attributes': {
                    "name": "null",
                    "info": null,
                    "address":null,
                    "city": null,
                    "state": null,
                    "zip": null,
                    "website": null,
                    "phone": null
                  },
                  'account_type': this.checkUserType(type)
                }
              };              

            }else{
               post_data = {
                user: {
                  'account_type': this.checkUserType(type)
                }
              }
            }

            console.log("post_data ==>"+JSON.stringify(post_data))
            
            ServiceBackend.put('users/'+userId, post_data).then(
              (response)=>{
                console.log("_loginWithFacebook response==>"+JSON.stringify(response))
                this._navigateToNextStep(type);
              },
              (err)=>{
                console.log("_loginWithFacebook error==>"+JSON.stringify(err))
              }
            ); 
          },
          (error)=>{
            console.log("signupWithFacebook error==>" + JSON.stringify(error))

          }
        )
      });
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

        console.log("Usertype stylist==>"+type);

        this.props.navigator.resetTo({
          screen: 'hairfolio.StylistInfo',
          animationType: 'fade',
          title: 'Professional Info',
          navigatorStyle: NavigatorStyles.basicInfo,
        });
        break;
      case 'salon':
      console.log("Usertype salon==>"+type);
        this.props.navigator.resetTo({
          screen: 'hairfolio.SalonInfo',
          animationType: 'fade',
          title: 'Professional Info',
          navigatorStyle: NavigatorStyles.basicInfo,
        });
        break;
      case 'brand':
      console.log("Usertype brand==>"+type);
        this.props.navigator.resetTo({
          screen: 'hairfolio.BrandInfo',
          animationType: 'fade',
          title: 'Professional Info',
          navigatorStyle: NavigatorStyles.basicInfo,
        });
        break;
      case 'consumer':
      console.log("Usertype consumer==>"+type);

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
