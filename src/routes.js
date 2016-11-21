import Route from './navigation/Route';

import CustomScenesConfig from './stacks/ScenesConfig';

import Hello from './containers/Hello';
import LoginOAuth from './containers/LoginOAuth';
import Register from './containers/Register';
import Register2 from './containers/Register2';
import BasicInfo from './containers/BasicInfo';
import BrandInfo from './containers/BrandInfo';
import SalonInfo from './containers/SalonInfo';
import SalonStylists from './containers/SalonStylists';
import SalonSP from './containers/SalonSP';
import SalonAddSP from './containers/SalonAddSP';
import StylistInfo from './containers/StylistInfo';
import StylistEducation from './containers/StylistEducation';
import StylistAddEducation from './containers/StylistAddEducation';
import StylistCertificates from './containers/StylistCertificates';
import StylistPlaceOfWork from './containers/StylistPlaceOfWork';
import StylistProductExperience from './containers/StylistProductExperience';
import Login from './containers/Login';
import LoginEmail from './containers/LoginEmail';
import ForgottenPassword from './containers/ForgottenPassword';
import EditCustomer from './containers/EditCustomer';
import EditCustomerAddress from './containers/EditCustomerAddress';
import ChangePassword from './containers/ChangePassword';
import UserStylists from './containers/UserStylists';
import UserAbout from './containers/UserAbout';
import GalleryPage from './containers/GalleryPage';
import FilterPage from './containers/FilterPage';
import UserPosts from './containers/UserPosts';
import UserHairfolio from './containers/UserHairfolio';

import AddServicePageOne from 'containers/AddServicePageOne';
import AddServicePageTwo from 'containers/AddServicePageTwo';
import AddServicePageThree from 'containers/AddServicePageThree';
import Feed from './containers/Feed';
import Search from './containers/Search';
import CreatePost from './containers/CreatePost';
import AddLink from './containers/AddLink';
import AlbumPage from './containers/AlbumPage';
import Favourites from './containers/Favourites';
import Profile from './containers/ProfileWrapper';
import Comments from './containers/Comments';
import OnboardingStack from './stacks/Onboarding';
import ForgottenPasswordStack from './stacks/ForgottenPassword';
import CreatePostStack from './stacks/CreatePost';
import CommentsStack from './stacks/CommentsStack'
import EditCustomerStack from './stacks/EditCustomer';
import SignupConsumerStack from './stacks/SignupConsumer';
import SignupBrandStack from './stacks/SignupBrand';
import SignupSalonStack from './stacks/SignupSalon';
import SignupStylistStack from './stacks/SignupStylist';
import AppStack from './stacks/App';
import OAuthStack from './stacks/OAuth';

// Feed
import StarGivers from './containers/StarGivers';
import PostDetails from './containers/PostDetails.js';
import TagPosts from './containers/TagPosts.js';
import HairfolioPosts from './containers/HairfolioPosts.js';

// search
import SearchDetails from './containers/SearchDetails.js';

// post
import PostFilter from './containers/PostFilter';

class GalleryRoute extends Route {
  SceneComponent = GalleryPage;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}

class FilterRoute extends Route {
  SceneComponent = FilterPage;
}

class AddServiceOneRoute extends Route {
  SceneComponent = AddServicePageOne;
}

class AddServiceTwoRoute extends Route {
  SceneComponent = AddServicePageTwo;
}

class AddServiceThreeRoute extends Route {
  SceneComponent = AddServicePageThree;
}

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
class SalonInfoRoute extends Route {
  SceneComponent = SalonInfo;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class BrandInfoRoute extends Route {
  SceneComponent = BrandInfo;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class SalonStylistsRoute extends Route {
  SceneComponent = SalonStylists;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class SalonSPRoute extends Route {
  SceneComponent = SalonSP;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class SalonAddSPRoute extends Route {
  SceneComponent = SalonAddSP;
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
class StylistCertificatesRoute extends Route {
  SceneComponent = StylistCertificates;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class StylistPlaceOfWorkRoute extends Route {
  SceneComponent = StylistPlaceOfWork;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class StylistProductExperienceRoute extends Route {
  SceneComponent = StylistProductExperience;
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
class StylistAddEducationRoute extends Route {
  SceneComponent = StylistAddEducation;
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
class EditCustomerRoute extends Route {
  SceneComponent = EditCustomer;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class EditCustomerAddressRoute extends Route {
  SceneComponent = EditCustomerAddress;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}
class ChangePasswordRoute extends Route {
  SceneComponent = ChangePassword;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}

export class UserStylistsRoute extends Route {
  SceneComponent = UserStylists;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOutTAB
  };

  label = 'Stylists';
}

export class UserAboutRoute extends Route {
  SceneComponent = UserAbout;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOutTAB
  };

  label = 'About';
}

export class UserPostsRoute extends Route {
  SceneComponent = UserPosts;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOutTAB
  };

  label = 'Posts';
}

export class UserHairfolioRoute extends Route {
  SceneComponent = UserHairfolio;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOutTAB
  };

  label = 'Hairfolio';
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

class PostFilterRoute extends Route {
  SceneComponent = PostFilter;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}

class AddLinkRoute extends Route {
  SceneComponent = AddLink;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}


class CreatePostRoute extends Route {
  SceneComponent = CreatePost;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };

  icon = 'camera';
}

class AlbumPageRoute extends Route {
  SceneComponent = AlbumPage;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
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

class CommentsRoute extends Route {
  SceneComponent = Comments;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}


class PostDetailsRoute extends Route {
  SceneComponent = PostDetails;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}

class TagPostsRoute extends Route {
  SceneComponent = TagPosts;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}

class HairfolioPostsRoute extends Route {
  SceneComponent = HairfolioPosts;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}

class StarGiversRoute extends Route {
  SceneComponent = StarGivers;
  SceneConfig = {
    ...CustomScenesConfig.FadeInOut
  };
}

class SearchDetailsRoute extends Route {
  SceneComponent = SearchDetails;
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

class CreatePostStackRoute extends Route {
  SceneComponent = CreatePostStack;
  SceneConfig = {
    ... CustomScenesConfig.FadeInOut
  };
}

class CommentsStackRoute extends Route {
  SceneComponent = CommentsStack;
  SceneConfig = {
    ... CustomScenesConfig.FadeInOut
  };
}

class EditCustomerStackRoute extends Route {
  SceneComponent = EditCustomerStack;
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
export const gallery = new GalleryRoute();
export const filter = new FilterRoute();
export const addServiceOne = new AddServiceOneRoute();
export const addServiceTwo = new AddServiceTwoRoute();
export const addServiceThree = new AddServiceThreeRoute();
export const loginOAuth = new LoginOAuthRoute();
export const register = new RegisterRoute();
export const register2 = new Register2Route();
export const login = new LoginRoute();
export const loginEmail = new LoginEmailRoute();
export const forgottenPassword = new ForgottenPasswordRoute();
export const editCustomer = new EditCustomerRoute();
export const editCustomerAddress = new EditCustomerAddressRoute();
export const salonInfo = new SalonInfoRoute();
export const brandInfo = new BrandInfoRoute();


export const salonStylists = new SalonStylistsRoute({
  backTo: salonInfo
});
export const salonAddSP = new SalonAddSPRoute();
export const salonSP = new SalonSPRoute({
  backTo: salonInfo,
  addSP: salonAddSP
});

export const salonStylistsEU = new SalonStylistsRoute({
  backTo: editCustomer
});
export const salonAddSPEU = new SalonAddSPRoute();
export const salonSPEU = new SalonSPRoute({
  backTo: editCustomer,
  addSP: salonAddSPEU
});

export const salonProductExperience = new StylistProductExperienceRoute({
  backTo: salonInfo,
  title: 'Products'
});

export const salonProductExperienceEU = new StylistProductExperienceRoute({
  backTo: editCustomer,
  title: 'Products'
});


export const stylistInfo = new StylistInfoRoute();

export const stylistAddSP = new SalonAddSPRoute();
export const stylistSP = new SalonSPRoute({
  backTo: stylistInfo,
  addSP: stylistAddSP
});

export const stylistAddEducation = new StylistAddEducationRoute();
export const stylistAddEducationEU = new StylistAddEducationRoute();

export const stylistEducation = new StylistEducationRoute({
  backTo: stylistInfo,
  addEducation: stylistAddEducation
});

export const stylistEducationEU = new StylistEducationRoute({
  backTo: editCustomer,
  addEducation: stylistAddEducationEU
});

export const stylistCertificates = new StylistCertificatesRoute({
  backTo: stylistInfo
});
export const stylistProductExperience = new StylistProductExperienceRoute({
  backTo: stylistInfo
});
export const stylistCertificatesEU = new StylistCertificatesRoute({
  backTo: editCustomer
});
export const stylistProductExperienceEU = new StylistProductExperienceRoute({
  backTo: editCustomer
});

export const stylistPlaceOfWork = new StylistPlaceOfWorkRoute({
  backTo: stylistInfo
});
export const stylistPlaceOfWorkEU = new StylistPlaceOfWorkRoute({
  backTo: editCustomer
});
export const feed = new FeedRoute();
export const search = new SearchRoute();
export const favourites = new FavouritesRoute();
export const profile = new ProfileRoute();
export const profileExternal = new ProfileRoute();
export const loginStack = new OnboardingStackRoute();
export const forgottenPasswordStack = new ForgottenPasswordStackRoute();
export const editCustomerStack = new EditCustomerStackRoute();
export const createPostStack = new CreatePostStackRoute();
export const changePassword = new ChangePasswordRoute();
export const signupConsumerStack = new SignupConsumerStackRoute();
export const signupBrandStack = new SignupBrandStackRoute();
export const signupSalonStack = new SignupSalonStackRoute();
export const signupStylistStack = new SignupStylistStackRoute();
export const appStack = new AppStackRoute();
export const oauthStack = new OAuthStackRoute();

// create Post
export const createPost = new CreatePostRoute();
export const postFilter = new PostFilterRoute();
export const albumPage = new AlbumPageRoute();
export const addLink = new AddLinkRoute();

// routes with one element
export const commentsStack = new CommentsStackRoute();

// search
export const searchDetails = new SearchDetailsRoute();

// feed
export const starGivers = new StarGiversRoute();
export const comments = new CommentsRoute();
export const postDetails = new PostDetailsRoute();
export const tagPosts = new TagPostsRoute();
export const hairfolioPosts = new HairfolioPostsRoute();

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
  nextRoute: brandInfo,
  detailFields: [
    {
      placeholder: 'Brand Name',
      ppte: 'business.name'
    }
  ],
  title: 'Brand Account'
});
export const basicInfoSalon = new BasicInfoRoute({
  accountType: 'salon',
  nextRoute: salonInfo,
  detailFields: [
    {
      placeholder: 'Salon Name',
      ppte: 'business.name'
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
  EditCustomerRoute,
  EditCustomerAddressRoute,
  SalonInfoRoute,
  SalonStylistsRoute,
  SalonSPRoute,
  SalonAddSPRoute,
  StylistInfoRoute,
  BrandInfoRoute,
  StylistCertificatesRoute,
  StylistEducationRoute,
  StylistAddEducationRoute,
  StylistPlaceOfWorkRoute,
  StylistProductExperienceRoute,
  UserHairfolioRoute,
  UserPostsRoute,
  FeedRoute,
  SearchRoute,
  CreatePostRoute,
  AlbumPageRoute,
  PostFilterRoute,
  FavouritesRoute,
  ProfileRoute,
  OnboardingStackRoute,
  ForgottenPasswordStackRoute,
  EditCustomerStackRoute,
  CreatePostStackRoute,
  ChangePasswordRoute,
  SignupConsumerStackRoute,
  SignupBrandStackRoute,
  SignupSalonStackRoute,
  SignupStylistStackRoute,
  AppStackRoute,
  OAuthStackRoute,
  StarGiversRoute,
  CommentsRoute,
  PostDetailsRoute,
  CommentsStackRoute
};
