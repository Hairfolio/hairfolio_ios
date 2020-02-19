import camera from 'img/camera.png';
import house from 'img/house.png';
import loupe from 'img/loupe.png';
import profile from 'img/profile_placeholder.png';
import shoppingBagOne from 'img/shopping_bag_1.png';
import { reaction } from 'mobx';
import { Navigation } from 'react-native-navigation';
import NavigatorStyles from './common/NavigatorStyles';
import { LOADING, READY } from './constants';
import EnvironmentStore from './mobx/stores/EnvironmentStore';
import UserStore from './mobx/stores/UserStore';
import { registerScreens } from './NavigationRoutes';
import { COLORS } from './style';
import utils from './utils';
import { showAlert, Alert , Text, TextInput} from './helpers';

class App {
  constructor() {

    // Irrespective to device font size 
    // Keep application fonts normal
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
    
    reaction(
      () => UserStore.user.auth_token,
      () => this.startApplication(),
    );
    reaction(
      () => UserStore.sessionHasExpired,
      (hasExpired) => (hasExpired && this.restartExpiredSessionApplication()),
    );
    this.startApplication();
  }

  startApplication = () => {
    registerScreens();
    if (UserStore.userState === READY && UserStore.token && !UserStore.needsMoreInfo) {
      this.startLoggedInApplication();
    } else if (UserStore.userState !== LOADING && !UserStore.needsMoreInfo) {
      this.startLoggedOutApplication();
    }
  }

  _setUserPicture = () => {
    const picture = utils.getUserProfilePicURI(UserStore.user, EnvironmentStore.getEnv());
  }

  startLoggedInApplication = () => {
    Navigation.startTabBasedApp({
      tabs: [
        {
          screen: 'hairfolio.Feed',
          icon: house,
          selectedIcon: house,
          navigatorStyle: NavigatorStyles.tab
        },  
        {
          screen: 'hairfolio.Search',
          icon: loupe,
          selectedIcon: loupe,
          navigatorStyle: NavigatorStyles.tab,
        },
        {
          screen: 'hairfolio.CreatePost',
          icon: camera,
          selectedIcon: camera,
          navigatorStyle: NavigatorStyles.tab,
        },
        {
          // screen: 'hairfolio.Favourites',
          screen: 'hairfolio.ProductModule',
          icon: shoppingBagOne,
          selectedIcon: shoppingBagOne,
          navigatorStyle: NavigatorStyles.tab,
        },
        {
          screen: 'hairfolio.Profile',
          icon: profile,
          selectedIcon: profile,
          navigatorStyle: NavigatorStyles.tab,
        }               
      ],
      tabsStyle: {
        tabBarButtonColor: COLORS.BOTTOMBAR_NOTSELECTED,
        tabBarBackgroundColor: COLORS.WHITE,
        tabBarSelectedButtonColor: COLORS.BOTTOMBAR_SELECTED,
        tabBarLabelColor: COLORS.BOTTOMBAR_NOTSELECTED,
        tabBarSelectedLabelColor: COLORS.BOTTOMBAR_SELECTED,
      }
    });
  }

  startLoggedOutApplication = () => {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'hairfolio.Register',
        navigatorStyle: NavigatorStyles.onboarding,
      },
    });
  }

  restartExpiredSessionApplication = () => {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'hairfolio.Login',
        navigatorStyle: NavigatorStyles.onboarding,
      },
      passProps: {
        sessionHasExpired: true,
      },
    });
  }

  restartLoginSessionApplication2 = () => {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'hairfolio.Login',
        navigatorStyle: NavigatorStyles.onboarding,
      },
      screen: {
        screen: 'hairfolio.Register',
        navigatorStyle: NavigatorStyles.onboarding,
      },
    });
  }

  restartLoginSessionApplication = () => {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'hairfolio.Login',
        navigatorStyle: NavigatorStyles.onboarding,
      },
      // passProps: {
      //   sessionHasExpired: true,
      // },
      // screen: {
      //   screen: 'hairfolio.Register',
      //   navigatorStyle: NavigatorStyles.onboarding,
      // },
    });
  }

  restartLoginInstaSessionApplication = () => {
    Navigation.startSingleScreenApp({     
      screen: {
        screen: 'hairfolio.Register',
        navigatorStyle: NavigatorStyles.onboarding,
      },
    });
    setTimeout(()=>{

      Alert.alert(
        'Hairfolio',
        "You're an existing user. Please do login.",
        [
          { text: "OK", onPress: () =>{}},         
        ],
        { cancelable: false }
      );

    },250)
  }

  restartLoginSessionApplicationFB = () => {
    Navigation.startSingleScreenApp({     
      screen: {
        screen: 'hairfolio.Register',
        navigatorStyle: NavigatorStyles.onboarding,
      },
    });
  }
  
}



export default new App();
