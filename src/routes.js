import Route from './navigation/Route';

import CustomScenesConfig from './stacks/ScenesConfig';

import Hello from './containers/Hello';
import Register from './containers/Register';
import Register2 from './containers/Register2';
import Login from './containers/Login';
import ForgottenPassword from './containers/ForgottenPassword';
import OnboardingStack from './stacks/Onboarding';
import ForgottenPasswordStack from './stacks/ForgottenPassword';

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
class LoginRoute extends Route {
  SceneComponent = Login;
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

export const hello = new HelloRoute();
export const register = new RegisterRoute();
export const register2 = new Register2Route();
export const login = new LoginRoute();
export const forgottenPassword = new ForgottenPasswordRoute();
export const loginStack = new OnboardingStackRoute();
export const forgottenPasswordStack = new ForgottenPasswordStackRoute();

export const constructors = {
  HelloRoute,
  RegisterRoute,
  Register2Route,
  LoginRoute,
  ForgottenPasswordRoute,
  OnboardingStackRoute,
  ForgottenPasswordStackRoute
};
