import Route from './navigation/Route';

import CustomScenesConfig from './stacks/ScenesConfig';

import Hello from './containers/Hello';
import LoginOAuth from './containers/LoginOAuth';
import Register from './containers/Register';
import Register2 from './containers/Register2';
import BasicInfo from './containers/BasicInfo';
import StylistInfo from './containers/StylistInfo';
import StylistEducation from './containers/StylistEducation';
import Login from './containers/Login';
import LoginEmail from './containers/LoginEmail';
import ForgottenPassword from './containers/ForgottenPassword';
import Feed from './containers/Feed';
import Search from './containers/Search';
import CreatePost from './containers/CreatePost';
import Favourites from './containers/Favourites';
import Profile from './containers/Profile';
import OnboardingStack from './stacks/Onboarding';
import ForgottenPasswordStack from './stacks/ForgottenPassword';
import SignupConsumerStack from './stacks/SignupConsumer';
import SignupBrandStack from './stacks/SignupBrand';
import SignupSalonStack from './stacks/SignupSalon';
import SignupStylistStack from './stacks/SignupStylist';
import AppStack from './stacks/App';
import OAuthStack from './stacks/OAuth';

class HelloRoute extends Route {
  SceneComponent = Hello;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class LoginOAuthRoute extends Route {
  SceneComponent = LoginOAuth;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}

class RegisterRoute extends Route {
  SceneComponent = Register;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class Register2Route extends Route {
  SceneComponent = Register2;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class BasicInfoRoute extends Route {
  SceneComponent = BasicInfo;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class StylistInfoRoute extends Route {
  SceneComponent = StylistInfo;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class StylistEducationRoute extends Route {
  SceneComponent = StylistEducation;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class LoginRoute extends Route {
  SceneComponent = Login;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class LoginEmailRoute extends Route {
  SceneComponent = LoginEmail;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}

class ForgottenPasswordRoute extends Route {
  SceneComponent = ForgottenPassword;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}

class FeedRoute extends Route {
  SceneComponent = Feed;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };

  icon = 'house';
}
class SearchRoute extends Route {
  SceneComponent = Search;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };

  icon = 'loupe';
}
class CreatePostRoute extends Route {
  SceneComponent = CreatePost;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };

  icon = 'camera';
}
class FavouritesRoute extends Route {
  SceneComponent = Favourites;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };

  icon = 'star';
}
class ProfileRoute extends Route {
  SceneComponent = Profile;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}

class OnboardingStackRoute extends Route {
  SceneComponent = OnboardingStack;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class ForgottenPasswordStackRoute extends Route {
  SceneComponent = ForgottenPasswordStack;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class SignupConsumerStackRoute extends Route {
  SceneComponent = SignupConsumerStack;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class SignupBrandStackRoute extends Route {
  SceneComponent = SignupBrandStack;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class SignupSalonStackRoute extends Route {
  SceneComponent = SignupSalonStack;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class SignupStylistStackRoute extends Route {
  SceneComponent = SignupStylistStack;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class AppStackRoute extends Route {
  SceneComponent = AppStack;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class OAuthStackRoute extends Route {
  SceneComponent = OAuthStack;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}

export const hello = new HelloRoute();
export const loginOAuth = new LoginOAuthRoute();
export const register = new RegisterRoute();
export const register2 = new Register2Route();
export const login = new LoginRoute();
export const loginEmail = new LoginEmailRoute();
export const forgottenPassword = new ForgottenPasswordRoute();
export const stylistInfo = new StylistInfoRoute();
export const stylistEducation = new StylistEducationRoute();
export const feed = new FeedRoute();
export const search = new SearchRoute();
export const createPost = new CreatePostRoute();
export const favourites = new FavouritesRoute();
export const profile = new ProfileRoute();
export const loginStack = new OnboardingStackRoute();
export const forgottenPasswordStack = new ForgottenPasswordStackRoute();
export const signupConsumerStack = new SignupConsumerStackRoute();
export const signupBrandStack = new SignupBrandStackRoute();
export const signupSalonStack = new SignupSalonStackRoute();
export const signupStylistStack = new SignupStylistStackRoute();
export const appStack = new AppStackRoute();
export const oauthStack = new OAuthStackRoute();

export const basicInfoConsumer = new BasicInfoRoute({
  accountType: 'consumer',
  nextRoute: appStack,
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
  title: 'Consumer Account'
});

export const basicInfoStylist = new BasicInfoRoute({
  accountType: 'stylist',
  nextRoute: stylistInfo,
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
  title: 'Stylist Account'
});
export const basicInfoBrand = new BasicInfoRoute({
  accountType: 'brand',
  detailFields: [
    {
      placeholder: 'Brand Name',
      ppte: 'brand_name'
    }
  ],
  title: 'Brand Account'
});
export const basicInfoSalon = new BasicInfoRoute({
  accountType: 'salon',
  detailFields: [
    {
      placeholder: 'Salon Name',
      ppte: 'salon_name'
    }
  ],
  title: 'Salon Account'
});

export const constructors = {
  HelloRoute,
  LoginOAuthRoute,
  RegisterRoute,
  Register2Route,
  BasicInfoRoute,
  LoginRoute,
  LoginEmailRoute,
  ForgottenPasswordRoute,
  StylistInfoRoute,
  StylistEducationRoute,
  FeedRoute,
  SearchRoute,
  CreatePostRoute,
  FavouritesRoute,
  ProfileRoute,
  OnboardingStackRoute,
  ForgottenPasswordStackRoute,
  SignupConsumerStackRoute,
  SignupBrandStackRoute,
  SignupSalonStackRoute,
  SignupStylistStackRoute,
  AppStackRoute,
  OAuthStackRoute
};
