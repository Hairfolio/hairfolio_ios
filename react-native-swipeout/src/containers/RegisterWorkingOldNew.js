import { reaction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Image, StyleSheet, View,Alert } from "react-native";
import { AccessToken, LoginManager } from "react-native-fbsdk";
import whiteBack from "../../resources/img/nav_white_back.png";
import App from "../App";
import ServiceBackend from "../backend/ServiceBackend";
import NavigatorStyles from "../common/NavigatorStyles";
import BannerErrorContainer2 from "../components/BannerErrorContainer2";
import Picker from "../components/Picker";
import PureComponent from "../components/PureComponent";
import { Dims, READY, EMPTY } from "../constants";
import EnvironmentStore from "../mobx/stores/EnvironmentStore";
import OAuthStore from "../mobx/stores/OAuthStore";
import UserStore from "../mobx/stores/UserStore";
import { h } from "../style";
import utils from "../utils";
import { showLog, showAlert } from "../helpers";

const styles = StyleSheet.create({
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: Dims.deviceHeight,
    width: Dims.deviceWidth
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch"
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    alignSelf: "center"
  },
  logo: {
    height: h(42),
    width: h(383),
    marginBottom: 30
  }
});

const CHOICES = [
  { label: "Consumer" },
  { label: "Stylist" },
  { label: "Salon" },
  { label: "Brand" }
];
const TYPES = {
  Consumer: "consumer",
  Stylist: "stylist",
  Salon: "salon",
  Brand: "brand"
};

var client_id = "c9ef6f5790154ba9ac777fccb6740e97";
var redirect_url = "https://www.google.com";
var auth_url =
  "https://api.instagram.com/oauth/authorize/?client_id=" +
  client_id +
  "&redirect_uri=" +
  redirect_url +
  "&response_type=token&scope=basic";
var consumer_item = null;

@observer
export default class Register2 extends PureComponent {
  state = {};

  constructor(props) {
    super(props);
  }

  onNavigatorEvent(event) {
    showLog("register2 event id ==> " + event.id);

    switch (event.id) {
      case 'willAppear':
      this.registerInstaStore();
        break;
      case 'bottomTabSelected':
        break;
      case "didAppear":
        break;
      case "bottomTabReselected":
        break;
      case "willDisappear":
        break;
      case "didDisappear":
        break;
      case "back":
      this.props.navigator.pop({
        animated: true,
        animationStyle: 'fade',
      });
      break;
        
      default:
        break;
    }
  }

  static navigatorButtons = {
    leftButtons: [
      {
        id: "back",
        icon: whiteBack
      }
    ]
  };

  registerInstaStore() {
    let counter = 0;

    if (OAuthStore.token && OAuthStore.status === READY) {

      showLog("counter ==>" + counter++);

      UserStore.checkUserExistence2(OAuthStore.token, "instagram_token")
        .then((res) => {
          showLog("insta login check ==>" + res);
          if (!res) {
            this.showSocialRefDialogAndValidateCode(OAuthStore.token, OAuthStore.userType, false)
          }
          else {
            this.showExistingUserDialog(true)
          }
        },
          (error) => {
            showAlert(error)
          }
        );
    }

  }

  showRefDialogAndValidateCode() {
    return new Promise((resolve, reject) => {
      UserStore.showReferralCodeDialog().then(
        refCode => {
          if (refCode == "") {
            resolve(true);
          } else {
            UserStore.checkReferralCodeExistence(refCode).then(
              res => {
                if (res) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              },
              error => {
                reject(error);
              }
            );
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  _doneTapped = item => {
    if (item && UserStore.registrationMethod === "email") {
      this.showRefDialogAndValidateCode().then(
        res => {
          if (res) {
            this.props.navigator.push({
              screen: "hairfolio.BasicInfo",
              title: this._titleForAccountType(item),
              passProps: this._propsForAccountType(item),
              navigatorStyle: NavigatorStyles.basicInfo
            });
          } else {
            UserStore.showRefConfirmation().then(
              confirm => {
                if (confirm) {
                  this._doneTapped(item);
                } else {
                  this.props.navigator.push({
                    screen: "hairfolio.BasicInfo",
                    title: this._titleForAccountType(item),
                    passProps: this._propsForAccountType(item),
                    navigatorStyle: NavigatorStyles.basicInfo
                  });
                }
              },
              error => {}
            );
          }
        },
        error => {
          showAlert(error);
        }
      );
    } else if (UserStore.registrationMethod === "facebook") {
      this._loginWithFacebook(item);
    } else {
      consumer_item = item;
      // this._loginWithInstagram(item);
      var type = TYPES[item.label];
      OAuthStore.setInstagramOauthConfig().then(() => {
        OAuthStore.setUserType(type);
        this.props.navigator.push({
          screen: "hairfolio.LoginOAuth",
          title: "Instagram",
          navigatorStyle: NavigatorStyles.basicInfo
        });
      });
    }
  };

  _titleForAccountType = item => {
    var type = TYPES[item.label];
    switch (type) {
      case "stylist":
        return "Stylist Account";
      case "brand":
        return "Brand Account";
      case "salon":
        return "Salon Account";
      default:
        return "Consumer Account";
    }
  };

  _propsForAccountType = item => {
    var type = TYPES[item.label];
    switch (type) {
      case "stylist":
        return {
          accountType: "stylist",
          detailFields: [
            {
              placeholder: "First Name",
              ppte: "first_name"
            },
            {
              placeholder: "Last Name",
              ppte: "last_name"
            }
          ]
        };
      case "brand":
        return {
          accountType: "brand",
          detailFields: [
            {
              placeholder: "Brand Name",
              ppte: "business.name"
            }
          ]
        };
      case "salon":
        return {
          accountType: "salon",
          detailFields: [
            {
              placeholder: "Salon Name",
              ppte: "business.name"
            }
          ]
        };
      default:
        return {
          accountType: "consumer",
          detailFields: [
            {
              placeholder: "First Name",
              ppte: "first_name"
            },
            {
              placeholder: "Last Name",
              ppte: "last_name"
            }
          ]
        };
    }
  };

  checkUserType(user_role) {
    if (user_role == "salon") {
      return "owner";
    } else if (user_role == "brand") {
      return "ambassador";
    } else {
      return user_role;
    }
  }

  signUpwithInstagramFun(token, type, refCode) {
    UserStore.signupWithInstagram(token, userType, refCode)
      .then(() => {
        showLog(
          "STORE 123==>" + OAuthStore.token + " TYPE ==>" + OAuthStore.userType
        );

        let userId = UserStore.user.id;
        let post_data = {};

        if (OAuthStore.userType == "brand") {
          post_data = {
            user: {
              brand_attributes: {
                name: "null",
                info: null,
                address: null,
                city: null,
                state: null,
                zip: null,
                website: null,
                phone: null,
                services: []
              },
              account_type: this.checkUserType(OAuthStore.userType),
              salon_attributes: null
            }
          };
        } else if (OAuthStore.userType == "salon") {
          post_data = {
            user: {
              salon_attributes: {
                name: "null",
                info: null,
                address: null,
                city: null,
                state: null,
                zip: null,
                website: null,
                phone: null
              },
              account_type: this.checkUserType(OAuthStore.userType),
              brand_attributes: null
            }
          };
        } else {
          post_data = {
            user: {
              account_type: this.checkUserType(OAuthStore.userType),
              brand_attributes: null,
              salon_attributes: null
            }
          };
        }

        ServiceBackend.put("users/" + userId, post_data).then(
          response => {
            showLog(
              "signupWithInstagram response==>" + JSON.stringify(response)
            );
            this._navigateToNextStep(OAuthStore.userType);
            OAuthStore.reset();
          },
          err => {
            showLog("signupWithInstagram error==>" + JSON.stringify(err));
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

  showExistingUserDialog(isFromInsta = false){
    OAuthStore.token = null;
    OAuthStore.reset();
    UserStore.userState = EMPTY;
    LoginManager.logOut();
    UserStore.setHasSessionExpired(false);

    Alert.alert(
      'Hairfolio',
      "You're an existing user. Please do login.",
      [
        { text: "OK", onPress: () =>{ 
          

          if(isFromInsta == true || isFromInsta == "true"){
            App.restartLoginInstaSessionApplication()
          }else{
            App.restartLoginSessionApplication()
          }
          
         
        } 
      },
       
      ],
      { cancelable: false }
    );
  
}

signUpwithFaceBookFun(token, type, refCode) {
  showLog("SELECTED TYPE ==>" + type);

  UserStore.checkUserExistence(token, "facebook_token").then(
    res => {
      if (res) {
        // alert("You're an existing user. Please do login.");

        Alert.alert(
          'Hairfolio',
          "You're an existing user. Please do login.",
          [
            { text: "OK", onPress: () =>{ 
              OAuthStore.token = null;
              OAuthStore.reset();
              UserStore.userState = EMPTY;
              LoginManager.logOut();
              UserStore.setHasSessionExpired(false);
              App.restartLoginInstaSessionApplication();
            } 
          },
           
          ],
          { cancelable: false }
        );
        
      } else {
        UserStore.signupWithFacebook(token, type, refCode).then(
          res => {
            showLog("signupWithFacebook response==>" + JSON.stringify(res));
            UserStore.user = res.user;
            let userId = res.user.id;

            if (type === res.user.account_type) {
              this._navigateToRegisteredUser(res.user.account_type);
            } else {
              let post_data = {};

              if (type == "brand") {
                post_data = {
                  user: {
                    salon_attributes: null,
                    brand_attributes: {
                      name: "null",
                      info: null,
                      address: null,
                      city: null,
                      state: null,
                      zip: null,
                      website: null,
                      phone: null,
                      services: []
                    },
                    account_type: this.checkUserType(type)
                  }
                };
              } else if (type == "salon") {
                post_data = {
                  user: {
                    brand_attributes: null,
                    salon_attributes: {
                      name: "null",
                      info: null,
                      address: null,
                      city: null,
                      state: null,
                      zip: null,
                      website: null,
                      phone: null
                    },
                    account_type: this.checkUserType(type)
                  }
                };
              } else {
                post_data = {
                  user: {
                    account_type: this.checkUserType(type),
                    brand_attributes: null,
                    salon_attributes: null
                  }
                };
              }

              showLog("post_data ==>" + JSON.stringify(post_data));

              ServiceBackend.put("users/" + userId, post_data).then(
                response => {
                  showLog("Edituser response==>" + JSON.stringify(response));
                  this._navigateToNextStep(type);
                },
                err => {
                  showLog("Edituser error==>" + JSON.stringify(err));
                }
              );
            }
          },
          error => {
            LoginManager.logOut();
            showLog("signupWithFacebook error==>" + JSON.stringify(error));
          }
        );
      }
    },
    error => {
      showAlert(error);
    }
  );
}
  signUpwithFaceBookFunaaa(token, type, refCode) {
    showLog("SELECTED TYPE ==>" + type);

    UserStore.checkUserExistence(token, "facebook_token").then(
      res => {
        if (res) {
          // alert("You're an existing user. Please do login.");

          Alert.alert(
            'Hairfolio',
            "You're an existing user. Please do login.",
            [
              { text: "OK", onPress: () =>{ 
                OAuthStore.token = null;
                OAuthStore.reset();
                UserStore.userState = EMPTY;
                LoginManager.logOut();
                UserStore.setHasSessionExpired(false);
                App.restartExpiredSessionApplication2();
              } 
            },
             
            ],
            { cancelable: false }
          );
          
        } else {
          UserStore.signupWithFacebook(token, type, refCode).then(
            res => {
              showLog("signupWithFacebook response==>" + JSON.stringify(res));
              UserStore.user = res.user;
              let userId = res.user.id;

              if (type === res.user.account_type) {
                this._navigateToRegisteredUser(res.user.account_type);
              } else {
                let post_data = {};

                if (type == "brand") {
                  post_data = {
                    user: {
                      salon_attributes: null,
                      brand_attributes: {
                        name: "null",
                        info: null,
                        address: null,
                        city: null,
                        state: null,
                        zip: null,
                        website: null,
                        phone: null,
                        services: []
                      },
                      account_type: this.checkUserType(type)
                    }
                  };
                } else if (type == "salon") {
                  post_data = {
                    user: {
                      brand_attributes: null,
                      salon_attributes: {
                        name: "null",
                        info: null,
                        address: null,
                        city: null,
                        state: null,
                        zip: null,
                        website: null,
                        phone: null
                      },
                      account_type: this.checkUserType(type)
                    }
                  };
                } else {
                  post_data = {
                    user: {
                      account_type: this.checkUserType(type),
                      brand_attributes: null,
                      salon_attributes: null
                    }
                  };
                }

                showLog("post_data ==>" + JSON.stringify(post_data));

                ServiceBackend.put("users/" + userId, post_data).then(
                  response => {
                    showLog("Edituser response==>" + JSON.stringify(response));
                    this._navigateToNextStep(type);
                  },
                  err => {
                    showLog("Edituser error==>" + JSON.stringify(err));
                  }
                );
              }
            },
            error => {
              LoginManager.logOut();
              showLog("signupWithFacebook error==>" + JSON.stringify(error));
            }
          );
        }
      },
      error => {
        showAlert(error);
      }
    );
  }

  signUpwithFaceBookFunOLD(token, type, refCode) {
    UserStore.signupWithFacebook(token, type, refCode).then(
      res => {
        showLog("signupWithFacebook response==>" + JSON.stringify(res));
        UserStore.user = res.user;
        let userId = res.user.id;

        let post_data = {};

        if (type == "brand") {
          post_data = {
            user: {
              salon_attributes: null,
              brand_attributes: {
                name: "null",
                info: null,
                address: null,
                city: null,
                state: null,
                zip: null,
                website: null,
                phone: null,
                services: []
              },
              account_type: this.checkUserType(type)
            }
          };
        } else if (type == "salon") {
          post_data = {
            user: {
              brand_attributes: null,
              salon_attributes: {
                name: "null",
                info: null,
                address: null,
                city: null,
                state: null,
                zip: null,
                website: null,
                phone: null
              },
              account_type: this.checkUserType(type)
            }
          };
        } else {
          post_data = {
            user: {
              account_type: this.checkUserType(type),
              brand_attributes: null,
              salon_attributes: null
            }
          };
        }

        showLog("post_data ==>" + JSON.stringify(post_data));

        ServiceBackend.put("users/" + userId, post_data).then(
          response => {
            showLog("Edituser response==>" + JSON.stringify(response));
            this._navigateToNextStep(type);
          },
          err => {
            showLog("Edituser error==>" + JSON.stringify(err));
          }
        );
      },
      error => {
        LoginManager.logOut();
        showLog("signupWithFacebook error==>" + JSON.stringify(error));
      }
    );
  }

  showSocialRefDialogAndValidateCode(token, type, isFromFBLogin = true) {
    this.showRefDialogAndValidateCode().then(refCode => {
      showLog("SHOW REF DIALOG AND VALIDATE CODE ==> " + isFromFBLogin);

      if (refCode) {
        if (isFromFBLogin) {
          showLog("SHOW REF DIALOG FACEBOOK ==> ");
          this.signUpwithFaceBookFun(token, type, UserStore.refferlCode);
        }else {
          this.signUpwithInstagramFun(refCode);
        }
      } else {
        UserStore.showRefConfirmation().then(
          confirm => {
            if (confirm) {
              this.showSocialRefDialogAndValidateCode(token, type, true);
            } else {
              if (isFromFBLogin) {
                this.signUpwithFaceBookFun(token, type, UserStore.refferlCode);
              }else {
                this.signUpwithInstagramFun(refCode);
              }
            }
          },
          error => {}
        );
      }
    });
  }

  _loginWithFacebook = item => {
    consumer_item = item;
    var type = TYPES[item.label];
    var refCode = "";
    EnvironmentStore.loadEnv()
      .then(() => LoginManager.logInWithReadPermissions(["public_profile"]))
      .then(() => AccessToken.getCurrentAccessToken())
      .then(data => data.accessToken.toString())
      .then(token => {
        showLog("token==>" + token);

        UserStore.checkUserExistence(token, "facebook_token").then(
          res => {
            showLog("TEST  ==>" + JSON.stringify(res));

            if (!res) {
              this.showSocialRefDialogAndValidateCode(token, type, true);
            } else {
              this.signUpwithFaceBookFun(token, type, "");
            }
          },
          error => {
            showAlert(error);
          }
        );
      });
  };

  _loginWithInstagram = item => {
    var type = TYPES[item.label];
    OAuthStore.setInstagramOauthConfig().then(() => {
      OAuthStore.setUserType(type);
      this.props.navigator.push({
        screen: "hairfolio.LoginOAuth",
        title: "Instagram",
        navigatorStyle: NavigatorStyles.basicInfo
      });
    });
  };

  // _navigateToRegisteredUser = type => {
  //   App.startLoggedInApplication();
  // };

  _navigateToNextStep = type => {
    switch (type) {
      case "stylist":
        showLog("Usertype stylist==>" + type);

        this.props.navigator.resetTo({
          screen: "hairfolio.StylistInfo",
          animationType: "fade",
          title: "Professional Info",
          navigatorStyle: NavigatorStyles.basicInfo
        });
        break;
      case "salon":
        showLog("Usertype salon==>" + type);
        this.props.navigator.resetTo({
          screen: "hairfolio.SalonInfo",
          animationType: "fade",
          title: "Professional Info",
          navigatorStyle: NavigatorStyles.basicInfo
        });
        break;
      case "brand":
        showLog("Usertype brand==>" + type);
        this.props.navigator.resetTo({
          screen: "hairfolio.BrandInfo",
          animationType: "fade",
          title: "Professional Info",
          navigatorStyle: NavigatorStyles.basicInfo
        });
        break;
      case "consumer":
        showLog("Usertype consumer==>" + type);

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
  };

  render() {
    const disabled = utils.isLoading([
      EnvironmentStore.environmentState,
      UserStore.userState,
      this.state.oauth
    ]);
    return (
      <Image
        resizeMode="cover"
        source={require("../images/onboarding.jpg")}
        style={styles.backgroundContainer}
      >
        <BannerErrorContainer2 style={styles.container} ref="ebc">
          <View style={styles.buttonContainer}>
            <Image
              style={styles.logo}
              source={require("img/onboarding_logo.png")}
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
        </BannerErrorContainer2>
      </Image>
    );
  }
}
