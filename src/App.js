import { reaction, toJS } from 'mobx';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './NavigationRoutes';
import { COLORS } from './style';
import { READY, LOADING } from './constants';
import utils from './utils';
import NavigatorStyles from './common/NavigatorStyles';
import UserStore from './mobx/stores/UserStore';
import EnvironmentStore from './mobx/stores/EnvironmentStore';
import house from 'img/house.png';
import loupe from 'img/loupe.png';
import camera from 'img/camera.png';
import star from 'img/star.png';
import profile from 'img/profile_placeholder.png';

class App {
  constructor() {
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
          screen: 'hairfolio.Favourites',
          icon: star,
          selectedIcon: star,
          navigatorStyle: NavigatorStyles.tab,
        },
        {
          screen: 'hairfolio.Profile',
          icon: profile,
          selectedIcon: profile,
          navigatorStyle: NavigatorStyles.tab,
        },
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
}

export default new App();
