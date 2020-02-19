import { observer } from 'mobx-react';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import firebase from 'react-native-firebase';
import NavigatorStyles from '../common/NavigatorStyles';
import SimpleButton from '../components/Buttons/Simple';
import Intro from '../components/Intro';
import PureComponent from '../components/PureComponent';
import { Dims, LOADING, READY } from '../constants';
import FB from '../firebaseMethod';
import UserStore from '../mobx/stores/UserStore';
import { COLORS, FONTS, h, SCALE } from '../style';
import { showLog } from '../helpers';
import OAuthStore from '../mobx/stores/OAuthStore';


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
export default class Register extends PureComponent {
  
  constructor(props) {
    super(props);
    hairfolioApp = FB.initialize();
    this.initFirebase();
    this.props.navigator.setOnNavigatorEvent((e) => {
      this.onNavigatorEvent(e);
    });
  }

  initFirebase () {
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

  onNavigatorEvent(event) {
    showLog("event.id ==>"+event.id)
    switch(event.id) {
      case 'willDisappear':
        
        break;
      case 'willAppear':
          setTimeout(()=>{
            // UserStore.needsMoreInfo = true;
          },500)
        break;
      default:
        break;
    }
  }

  render() {
    if (UserStore.userState === LOADING) {
      return <Intro />;
    }
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
                icon="facebook"
                label="Use Facebook"
                onPress={() => {
                  UserStore.setMethod('facebook');
                  this.props.navigator.push({
                    screen: 'hairfolio.Register2',
                    animationType: 'fade',
                    navigatorStyle: NavigatorStyles.onboarding,
                  });
                }}
              />
            </View>
            <View style={{paddingBottom: 10, alignSelf: 'stretch'}}>
              <SimpleButton
                color={COLORS.IG}
                icon="instagram"
                label="Use Instagram"
                onPress={() => {
                  UserStore.setMethod('instagram');
                  // OAuthStore.reset();
                  // OAuthStore.isFromInstaLogin = false;
                  this.props.navigator.push({
                    screen: 'hairfolio.Register2',
                    animationType: 'fade',
                    navigatorStyle: NavigatorStyles.onboarding,
                  });
                }}
              />
            </View>
            <View style={{paddingBottom: 10, alignSelf: 'stretch'}}>
              <SimpleButton
                color={COLORS.DARK}
                icon="email"
                label="Use your email"
                onPress={() => {
                  
                  UserStore.setMethod('email');
                  this.props.navigator.push({
                    screen: 'hairfolio.Register2',
                    animationType: 'fade',
                    navigatorStyle: NavigatorStyles.onboarding,
                  });
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigator.resetTo({
                screen: 'hairfolio.Login',
                animationType: 'fade',
                navigatorStyle: NavigatorStyles.onboarding,
              });
            }}
            style={{backgroundColor: COLORS.TRANSPARENT}}
          >
            <Text style={{
              fontFamily: FONTS.MEDIUM,
              fontSize: SCALE.h(28),
              color: COLORS.WHITE,
              textAlign: 'center',
              marginBottom: 10,
            }}>Already a Member? <Text style={{fontFamily: FONTS.HEAVY}}>Sign in</Text></Text>
          </TouchableOpacity>
        </View>
      </Image>
    );
  }
};
