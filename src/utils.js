import {LOADING, LOADING_ERROR, READY} from './constants';

var is = (what, state) => {
  if (!state)
    return false;

  if (state.constructor !== Array)
    state = [state];

  var isList = [];

  state.forEach((v) => {
    if (v === what)
      isList.push(v);
  });

  return !!isList.length;
};

const utils = {
  isReady(state) {
    return is(READY, state);
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
    return `http://res.cloudinary.com/${environment.get('cloud_name')}/image/upload/${id}.jpg`;
  },
  getUserProfilePicURI(user, environment) {
    if (user.get('avatar_cloudinary_id'))
      return utils.getCloudinaryPicFromId(user.get('avatar_cloudinary_id'), environment);
    else if (user.get('facebook_id'))
      return `http://res.cloudinary.com/${environment.get('cloud_name')}/image/facebook/${user.get('facebook_id')}.jpg`;
    else if (user.get('insta_id'))
      return `http://res.cloudinary.com/${environment.get('cloud_name')}/image/instagram_name/${user.get('email').split('@')[0]}.jpg`;
  },
  isFollowing(me, profile) {
    return me.get('following') && !!me.get('following').find((user) => user.get('id') === profile.get('id'));
  }
};

export default utils;
