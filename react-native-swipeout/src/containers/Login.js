import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Image, StyleSheet, Text, View, Alert } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import App from '../App';
import NavigatorStyles from '../common/NavigatorStyles';
import BannerErrorContainer2 from '../components/BannerErrorContainer2';
import SimpleButton from '../components/Buttons/Simple';
import CustomTouchableOpacity from '../components/CustomTouchableOpacity';
import PureComponent from '../components/PureComponent';
import { Dims, READY, EMPTY } from '../constants';
import FB from '../firebaseMethod';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import OAuthStore from '../mobx/stores/OAuthStore';
import UserStore from '../mobx/stores/UserStore';
import { COLORS, FONTS, h, SCALE } from '../style';
import utils from '../utils';
import { showLog, showAlert } from '../helpers';

var consumer_item = null;

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
const hairfolioApp = null;

@observer
export default class Login extends PureComponent {
  state = {};

  constructor(props) {
    super(props);
    hairfolioApp = FB.initialize();
    this.initFirebase();
    // reaction(
    //   () => OAuthStore.token,
    //   () => {
    //     if (OAuthStore.status === READY) {
    //       UserStore.loginWithInstagram(OAuthStore.token).then(
    //         () => {

    //           showLog("Logged in user ==>" + JSON.stringify(UserStore.user))
    //           var user = UserStore.user;
    //           consumer_item = user;
    //           this._navigateToNextStep(user.account_type);
    //           OAuthStore.reset();

    //         },
    //         (e) => {
    //           showLog("Error instagram login==>" + JSON.stringify(e))
    //           OAuthStore.reset();
    //         }
    //       );

    //     }
    //   }
    // );
  }

  initFirebase() {
    this.isFirebaseReady();
  }

  isFirebaseReady() {

    hairfolioApp.onReady().then(
      app => {
        this.getFcmToken();
      },
      err => {
        this.isFirebaseReady();
      }
    );
  }

  getFcmToken() {
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          firebase.messaging().getToken().then(token => {
            showLog("Firebase token ==> ", token);
          })
        } else {
          firebase.messaging().requestPermission()
            .then(() => {
              showLog("User Now Has Permission")
              firebase.messaging().getToken().then(token => {
                showLog("Firebase token ==> ", token);
              })
            })
            .catch(error => {
              showLog("Error", error)
            });
        }
      });
  }

  componentDidMount() {
    if (this.props.sessionHasExpired) {
      alert('Session expired');
      OAuthStore.reset();
      UserStore.setHasSessionExpired(false);
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    showLog("login event id ==> " + event.id);

    switch (event.id) {
      case 'willAppear':
        break;
      case 'bottomTabSelected':
        break;
      case "didAppear":
        if(OAuthStore.token && OAuthStore.token != null) {
            let token = OAuthStore.token;
            UserStore.checkUserExistence(token, "instagram_token")
              .then((res) => {
                  if (res == "true" || res == true) {

                    UserStore.loginWithInstagram(OAuthStore.token).then(
                      () => {          
                        
                        if(UserStore.user.account_type == 'owner'){
                          OAuthStore.setUserType('salon');
                        }else if(UserStore.user.account_type == 'ambassador'){
                          OAuthStore.setUserType('brand');
                        }else if(UserStore.user.account_type == 'consumer'){
                          OAuthStore.setUserType('consumer');
                        }else if(UserStore.user.account_type == 'stylist'){
                          OAuthStore.setUserType('stylist');
                        }
                        

                        showLog("INSIDE UserStore.loginWithInstagram ==>" + OAuthStore.token)
                        showLog("Logged in user ==>" + JSON.stringify(UserStore.user))
                        var user = UserStore.user;
                        consumer_item = user;
                        this._navigateToNextStep(user.account_type);
                        OAuthStore.reset();
                      },
                      (e) => {
                        showLog("Error instagram login==>" + JSON.stringify(e))
                        OAuthStore.reset();
                      }
                    ); 
                      
                  } else {
                    OAuthStore.token = null;
                    OAuthStore.reset();
                    UserStore.userState = EMPTY;
                    LoginManager.logOut();
                    UserStore.setHasSessionExpiredRegister(false);
                  }
                },
                (error) => {
                  showAlert('Something went wrong!')
                }
              );
          
        } else {
          showLog('Waiting for insta token ==> ' + OAuthStore.token);
        }
        break;
      case "bottomTabReselected":
        break;
      case "willDisappear":
        break;
      case "didDisappear":
        break;
      case "back":
        break;
      default:
        break;
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

    App.startLoggedInApplication();
  }

  render() {
    return (

      <BannerErrorContainer2 ref="ebc" style={{ flex: 1 }}>
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
              <View style={{ paddingBottom: 10, alignSelf: 'stretch' }}>
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
                      .then(token => {
                        if(token){
                          UserStore.checkUserExistence(token, "facebook_token")
                          .then((res) => {
                            if(res == "true" || res == true) {
                              UserStore.loginWithFacebook(token)
                              .then(() => {
                                showLog("Logged in user ==>" + JSON.stringify(UserStore.user))
                                var user = UserStore.user;
                                consumer_item = user;
                                this._navigateToNextStep(user.account_type);
                              },
                                (e) => {
                                  LoginManager.logOut();
                                  alert("FB login failed, please try again");
                                })
                            } else {
                              OAuthStore.token = null;
                              OAuthStore.reset();
                              UserStore.userState = EMPTY;
                              LoginManager.logOut();
                              UserStore.setHasSessionExpiredRegister(false);                              
                            }
                          },
                          (error) => {
                            showAlert('Something went wrong!')
                          }
                          );
                        }
                      })
                  }}
                />
              </View>
              <View style={{ paddingBottom: 10, alignSelf: 'stretch' }}>
                <SimpleButton
                  color={COLORS.IG}
                  disabled={utils.isLoading([EnvironmentStore.environmentState, UserStore.userState, this.state.oauth])}
                  icon="instagram"
                  label="Sign In with Instagram"
                  onPress={() => {
                    OAuthStore.reset();
                    OAuthStore.isFromInstaLogin = true;
                    OAuthStore.setInstagramOauthConfig()
                                .then(() => {

                                    this.props.navigator.push({
                                    screen: 'hairfolio.LoginOAuth',
                                    title: 'Instagram',
                                    navigatorStyle: NavigatorStyles.basicInfo,
                                    });
                                });





                    
                    
                  
                    // OAuthStore.setInstagramOauthConfig().then(() => {
                    //   showLog("INSIDE OAuthStore.setInstagramOauthConfig" + OAuthStore.token)
                    //   UserStore.loginWithInstagram(OAuthStore.token).then(
                    //     () => {
                    //       showLog("INSIDE UserStore.loginWithInstagram ==>" + OAuthStore.token)
                   

                    //       showLog("Logged in user ==>" + JSON.stringify(UserStore.user))
                    //       var user = UserStore.user;
                    //       consumer_item = user;
                    //       // this._navigateToNextStep(user.account_type);
                    //       OAuthStore.reset();

                    //     },
                    //     (e) => {
                    //       showLog("Error instagram login==>" + JSON.stringify(e))
                    //       OAuthStore.reset();
                    //     }
                    //   );
                    
                    // })
                  }}
                />
              </View>
              <View style={{ paddingBottom: SCALE.h(54), alignSelf: 'stretch' }}>
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
                {/* <Text style={{
                  fontFamily: FONTS.MEDIUM,
                  fontSize: SCALE.h(28),
                  color: COLORS.WHITE,
                  textAlign: 'center'
                }}>Forgot your password?</Text> */}
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
              }}>Don’t Have an Account? <Text style={{ fontFamily: FONTS.HEAVY }}>Sign up</Text></Text>
            </CustomTouchableOpacity>
          </View>
        </Image>
      </BannerErrorContainer2>
    );
  }
};
