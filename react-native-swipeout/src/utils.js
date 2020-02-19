import {LOADING, LOADING_ERROR, READY} from './constants';
import { showLog } from './helpers';

var is = (what, state, full = false) => {
  if (!state)
    return false;

  if (state.constructor !== Array)
    state = [state];

  var isList = [];

  state.forEach((v) => {
    if (v === what)
      isList.push(v);
  });

  return full ? isList.length === state.length : !!isList.length;
};

const utils = {
  isReady(state) {
    return is(READY, state, true);
  },
  isLoading(state) {
    return is(LOADING, state);
  },
  isLoadingError(state) {
    return is(LOADING_ERROR, state);
  },
  parseJSON(response) {
    if (response.json)
      return response.json().then((json) => {
        response.jsonData = json;
        return response;
      }, () => response);
    return response;
  },
  getCloudinaryPicFromId(id, environment) {
    // showLog("getCloudinaryPicFromId ==>" + JSON.stringify(id))

    var str = id;
    if (str.includes("https")) {
      return str;
    } else {
      return `http://res.cloudinary.com/${environment.cloud_name}/image/upload/${id}.jpg`;
    }

    // return `http://res.cloudinary.com/${environment.cloud_name}/image/upload/${id}.jpg`;
  },
  getUserProfilePicURI(user, environment) {
    // showLog("getUserProfilePicURI ==>"+JSON.stringify(user))
    if (!user)
      return '';
    if (user.avatar_cloudinary_id) {
      var str = user.avatar_cloudinary_id;
      if (str.includes("https")) {
        return str;
      } else {
        return utils.getCloudinaryPicFromId(user.avatar_cloudinary_id, environment);
      }
    }else if (user.facebook_id)
      return `http://res.cloudinary.com/${environment.cloud_name}/image/facebook/${user.facebook_id}.jpg`;
    else if (user.instagram_id)
      return `http://res.cloudinary.com/${environment.cloud_name}/image/instagram_name/${user.instagram_username}.jpg`;
  },
  isFollowing(me, profile) {
    return me.is_following_me && !!me.following.find((user) => user.id === profile.id);
  }
};

export default utils;
