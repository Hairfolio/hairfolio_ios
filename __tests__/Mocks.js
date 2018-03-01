// TODO: Fill with data from an API Response.

export const userMock = {
  account_type: "ambassador",
  auth_token: "4sCnGxpTA2iSBJ5dYbec",
  avatar_cloudinary_id: "k5dshqxt1idkhmz3xlnf",
  avatar_url: null,
  brand: {
    address: "",
    city: "",
    created_at: "2018-02-02T12:41:00.942Z",
    id: 48,
    info: "",
    name: "A",
    phone: "",
    services: [],
    state: null,
    website: "",
    zip:"",
  },
  career_opportunity: null,
  certificates: [],
  default_pinterest_board: null,
  description: null,
  educations: [],
  email: "uuu7@a.com",
  experiences: [],
  facebook_id: null,
  first_name: null,
  followers_count: 0,
  id: 236,
  instagram_id: null,
  is_followed_by_me: false,
  is_following_me: false,
  last_name: null,
  likes: [],
  likes_count: 0,
  offerings: [],
  prof_desc: null,
  salon: null,
  share_facebook: false,
  share_instagram: false,
  share_pinterest: false,
  share_tumblr: false,
  share_twitter: false,
  unread_messages_count: 0,
  years_exp: null,
  educations: [],
  offerings: [],
};

export const environmentMock = {
  cloud_name: "www-hairfolioapp-com",
  cloud_preset: "gvlqj5s4",
  facebook_app_id: "653107098196959",
  facebook_redirect_url: "https://www.facebook.com/connect/login_success.html",
  insta_client_id: "8160642e7b65405ab953e7003f619e34",
};

export const degreesMock = {
  degrees: [],
};

export const certsMock = {
  certificates: [],
};

export const servicesMock = [];

export const categoriesMock = [];

export const experiencesMock = {
  experiences: [],
};

export const mockPost = {
  createdTime: null,
  creator: {
    id: 236,
    name: 'A',
    pictureUrl: {uri: 'asdasdasda'},
    profilePicture: {},
  },
  currentIndex: 0,
  description: 'add',
  hasStarred: false,
  id: 568,
  key: "2b75936b-ecec-4eb7-a102-9345e348a67a",
  numberOfComents: 0,
  pictures: [],
  starNumber: 0,
};

export const mockFeedStore = {
  isLoading: false,
  hasLoaded: true,
  elements: [mockPost],
  nextPage: null,
};

export const mockEmptyFeedStore = {
  isLoading: false,
  hasLoaded: true,
  elements: [],
  nextPage: null,
};
