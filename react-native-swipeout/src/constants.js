import { Dimensions, NativeModules, Platform } from "react-native";
import { SCALE } from "./style";

export const EMPTY = "EMPTY";
export const LOADING = "LOADING";
export const LOADING_MORE = "LOADING_MORE";
export const REFRESHING = "REFRESHING";
export const LOADING_ERROR = "LOADING_ERROR";
export const READY = "READY";
export const UPDATING = "UPDATING";
export const UPDATING_ERROR = "UPDATING_ERROR";

export const BOTTOMBAR_HEIGHT = SCALE.h(105);
export const STATUSBAR_HEIGHT = 20;
export const USERPROFILEBAR_HEIGHT = SCALE.h(102);
export const BASE_URL = "http://54.183.167.119/v2/";
export const CLOUD_PRESET = "lbftvax4"; //"fbms4wmw";
export const CLOUD_URL =
  "https://api.cloudinary.com/v1_1/drdal2urr/image/upload";
export const CLOUD_NAME = "drdal2urr";
export const PER_PAGE = 12;
export const PER_PAGE_FAV_POSTS = 3;
export const PER_PAGE_FOR_SEARCH = 6;
export const PER_PAGE_FOR_FEED = 5;
export const POST_INPUT_MODE = {
  LIBRARY: "Library",
  PHOTO: "Photo",
  VIDEO: "Video"
};

var { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

deviceHeight =
  Platform.OS === "ios"
    ? deviceHeight
    : NativeModules.ExtraDimensions["REAL_WINDOW_HEIGHT"] -
      (NativeModules.ExtraDimensions["STATUS_BAR_HEIGHT"] || 0) -
      (NativeModules.ExtraDimensions["SOFT_MENU_BAR_HEIGHT"] || 0) -
      (NativeModules.ExtraDimensions["SMART_BAR_HEIGHT"] || 0);

export const Dims = {
  deviceWidth,
  deviceHeight,
  softBarHeight:
    (NativeModules.ExtraDimensions &&
      NativeModules.ExtraDimensions["SOFT_MENU_BAR_HEIGHT"]) ||
    0
};

export const ENDPOINT = {
  add_to_cart: "carts/",
  minus_from_cart: "cart/minus_from_cart",
  remove_from_cart: "remove_from_cart",
  cart_listing: "carts",
  update_cart: "update_cart",
  get_Address: "addresses/",
  add_Address: "addresses/",
  get_Coupons: "coupons",
  add_Card: "cards",
  get_CardList: "cards",
  place_order: "orders",
  fetch_cart: "users/fetch_wallet",
  bank_account: "bank_accounts",
  wallet_payOut:"wallets/payout",
  check_User_Existence:'users/check_social_user_existence?',
  check_referralCode_Existence:'users/check_referral_code_existence?',
  get_bank_details:'bank_accounts/get_bank_details',
  bank_list:'bank_accounts?',
  fetch_commission_list:'wallets/commission_list',
  fetch_transaction_history:'wallet_payment_transaction_histories',
  newArrivals_old:"products",
  newArrivals:'newarrival_products',
  mobile_store_banners:'mobile_store_banners',
  trendingProducts:"trending_products",
  updateProduct : "products/",
  fetch_Sale : "sales/fetch_sale",
  wallet_info : "wallets/wallet_transfer_info"
};
