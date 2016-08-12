import Route from './navigation/Route';

import CustomScenesConfig from './stacks/ScenesConfig';

import Hello from './containers/Hello';
import Register from './containers/Register';
import Register2 from './containers/Register2';
import BasicInfoConsumer from './containers/BasicInfo/Consumer';
import Login from './containers/Login';
import LoginEmail from './containers/LoginEmail';
import ForgottenPassword from './containers/ForgottenPassword';
import Landing from './containers/Landing';
import OnboardingStack from './stacks/Onboarding';
import ForgottenPasswordStack from './stacks/ForgottenPassword';
import SignupConsumerStack from './stacks/SignupConsumer';
import AppStack from './stacks/App';

class HelloRoute extends Route {
  SceneComponent = Hello;
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
class BasicInfoConsumerRoute extends Route {
  SceneComponent = BasicInfoConsumer;
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
class LandingRoute extends Route {
  SceneComponent = Landing;
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
class AppStackRoute extends Route {
  SceneComponent = AppStack;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}

export const hello = new HelloRoute();
export const register = new RegisterRoute();
export const register2 = new Register2Route();
export const basicInfoConsumer = new BasicInfoConsumerRoute();
export const login = new LoginRoute();
export const loginEmail = new LoginEmailRoute();
export const forgottenPassword = new ForgottenPasswordRoute();
export const landing = new LandingRoute();
export const loginStack = new OnboardingStackRoute();
export const forgottenPasswordStack = new ForgottenPasswordStackRoute();
export const signupConsumerStack = new SignupConsumerStackRoute();
export const appStack = new AppStackRoute();

export const constructors = {
  HelloRoute,
  RegisterRoute,
  Register2Route,
  BasicInfoConsumerRoute,
  LoginRoute,
  LoginEmailRoute,
  ForgottenPasswordRoute,
  LandingRoute,
  OnboardingStackRoute,
  ForgottenPasswordStackRoute,
  SignupConsumerStackRoute,
  AppStackRoute
};
