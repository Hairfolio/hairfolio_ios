import {
  _, // lodash
  v4,
  observable,
  computed,
  moment,
  action,
  observer, // mobx
} from 'Hairfolio/src/helpers.js';
import { READY, EMPTY, LOADING, LOADING_ERROR } from '../../constants';
import { persist } from 'mobx-persist';
import hydrate from './hydrate';

class UserStore {
  @persist @observable token;
  @persist('object') @observable user;
  @persist @observable userState;
  @persist('object') @observable followingStates;
  @persist @observable changePasswordState;
  @persist @observable forgotPasswordState;
  @persist @observable registrationMethod;

  constructor() {
    this.user = {
      educations: [],
      offerings: [],
    };
    this.userState = EMPTY;
    this.followingStates = {};
    this.changePasswordState = EMPTY;
    this.forgotPasswordState = EMPTY;
    this.registrationMethod = null;
  }

  @action loadUser = (user) => {
    this.user = user;
  }

  @action setMethod = (method) => {
    this.registrationMethod = method;
  }

  @action editUser = (values = {}, type) => {
    this.userState = LOADING;
    if (values.experience_ids) {
      values.experience_ids = values.experience_ids.split(',').map(e => Math.floor(e));
    } else {
      values.experience_ids = [];
    }
    if (values.certificate_ids) {
      values.certificate_ids = values.certificate_ids.split(',').map(e => Math.floor(e));
    } else {
      values.certificate_ids = [];
    }
    if (values.business) {
      if (type == 'ambassador') {
        let brand = {};
        _.each(values.business, (v, key) => brand[`${key}`] = v);
        delete values.business;
        values.brand_attributes = brand;

        // delete brand  attributes if they don't have a value
        if (values.brand_attributes && (!values.brand_attributes.name || values.brand_attributes.name == '')) {
          delete values.brand_attributes;
        }
      } else {
        let salon = {};
        _.each(values.business, (v, key) => salon[`${key}`] = v);
        delete values.business;
        values.salon_attributes = salon;

        // delete salon attributes if they don't have a value
        if (values.salon_attributes && (!values.salon_attributes.name || values.salon_attributes.name == '')) {
          delete values.salon_attributes;
        }
      }
    }
    values['salon_user_id'] = values['business_salon_user_id'];
    delete values['business_salon_user_id'];
    if (values['salon_user_id'] === -1) {
      values['salon_user_id'] = null;
    }
    if (_.isEmpty(values)) {
      this.userState = READY;
    } else {
      try {
        var user = values;
        var body = _.pick(values, ['experience_ids', 'certificate_ids']);
        if(!_.isEmpty(user)) {
          body.user = user;
        }
        return fetch.fetch(`/users/${this.user.id})}`, {
          method: 'PATCH',
          body
        })
          .then(user => {
            this.user = {
              ...this.user,
              ...user,
            };
            this.userState = READY;
          });
      } catch (error) {
        this.userState = LOADING_ERROR;
        throw error;
      }
    }

  }

  @action logout = () => {
    fetch.fetch(`/sessions/${this.user.auth_token}`, {method: 'DELETE'});
    this.user = {
      educations: [],
      offerings: [],
    };
    this.userState = EMPTY;
    this.followingStates = {};
    this.token = null;
  }

  @action setToken = (val) => {
    this.token = val;
  }

  @action addOffering = (offering) => {
    this.user.offerings.push(offering);
  }

  @action editOffering = (id, offering) => {
    const index = this.user.offerings.indexOf(offering);
    if (index < 0) {
      this.user.offerings[index] = offering;
    }
  }

  @action deleteOffering = (id) => {
    let index = -1;
    this.user.offerings.forEach((offering, i) => {
      if (offering.id === id) {
        index = i;
      }
    });
    this.user.offerings.splice(index, 1);
  }

  @action addEducation = (education) => {
    this.user.educations.push(education);
  }

  @action editEducation = (id, education) => {
    const index = this.user.educations.indexOf(education);
    if (index < 0) {
      this.user.educations[index] = education;
    }
  }

  @action deleteEducation = (id) => {
    let index = -1;
    this.user.educations.forEach((education, i) => {
      if (education.id === id) {
        index = i;
      }
    });
    this.user.educations.splice(index, 1);
  }

  @action followUser = (id) => {
    this.followingStates[id] = LOADING;
    fetch.fetch(
      `/users/${id}/follows`,
      {
        method: 'POST',
        body: {
          user: {id}
        }
      }
    )
      .then(({followers_count}) => {
        this.user.following.push({id});
        this.user.follow_count = followers_count;
        this.followingStates[id] = READY;
      })
      .catch(error => {
        this.followingStates[id] = LOADING_ERROR;
      });
  }

  @action unfollowUser = (id) => {
    this.followingStates[id] = LOADING;
    fetch.fetch(`/users/${id}/follows`, { method: 'DELETE' })
      .then(response => {
        this.user.following = this.user.following.filter(user => user.id !== id);
        this.user.follow_count = this.user.follow_count - 1;
        this.followingStates[id] = READY;
      })
      .catch(error => {
        this.followingStates[id] = LOADING_ERROR;
      });
  }

  getUserEducations = () => {
    return fetch.fetch(`/users/${this.user.id}/educations`);
  }

  getUserOfferings = () => {
    return fetch.fetch(`/users/${this.user.id}/offerings`);
  }

  getUserFollowing = () => {
    return fetch.fetch(`/users/${this.user.id}/follows`);
  }

  @action forgotPassword = async (email) => {
    try {
      this.forgotPasswordState = LOADING;
      const response = await fetch.fetch(
        '/sessions/recover',
        {
          method: 'POST',
          body: {email}
        }
      );
      this.forgotPasswordState = READY;
    } catch(error) {
      this.forgotPasswordState = LOADING_ERROR;
    }
  }
  @action changePassword = async (value) => {
    try {
      this.changePasswordState = LOADING;
      const response = await fetch.fetch(
        `/users/${this.user.id}/change_password`,
        {
          method: 'POST',
          body: {
            user: value
          }
        }
      )
      this.changePasswordState = READY;
    } catch(error) {
      this.changePasswordState = LOADING_ERROR;
    }
  }

  loadUserInformation = async () => {
    const educations = await this.getUserEducations();
    const offerings = await this.getUserOfferings();
    const following = await this.getUserFollowing();
    this.user.following = following;
    this.user.educations = educations;
    this.user.offerings = offerings;
  }

  @action loginWithFacebook = async (token) => {
    this.userState = LOADING;
    try {
      const user = await fetch.fetch(
        '/sessions/facebook',
        {
          method: 'POST',
          body: {
            'facebook_token': token
          }
        }
      );
      this.user = user;
      await this.loadUserInformation();
      this.userState = READY;
    } catch(error) {
      this.userState = LOADING_ERROR;
    }
  }

  @action signupWithFacebook = async (token, type) => {
    this.userState = LOADING;
    try {
      const user = await fetch.fetch(
        '/sessions/facebook',
        {
          method: 'POST',
          body: {
            'facebook_token': token
          }
        }
      );
      this.user = user;
      this.userState = READY;
    } catch(error) {
      this.userState = LOADING_ERROR;
    }
  }

  @action loginWithInstagram = async (token) => {
    this.userState = LOADING;
    try {
      const user = await fetch.fetch(
        '/sessions/instagram',
        {
          method: 'POST',
          body: {
            'instagram_token': token
          }
        }
      );
      this.user = user;
      await this.loadUserInformation();
      this.userState = READY;
    } catch(error) {
      this.userState = LOADING_ERROR;
    }
  }

  @action signupWithInstagram = async (token, type) => {
    this.userState = LOADING;
    try {
      const user = await fetch.fetch(
        '/sessions/instagram',
        {
          method: 'POST',
          body: {
            'instragram_token': token
          }
        }
      );
      this.user = user;
      this.userState = READY;
    } catch(error) {
      this.userState = LOADING_ERROR;
    }
  }

  @action signUpWithEmail = async (value = {}, type) => {
    this.userState = LOADING;
    if (value.business) {
      _.each(value.business, (v, key) => value[`business_${key}`] = v);
      delete value.business;
    }
    if (type == 'brand') {
      let name = value['business_name'];
      delete value.business_name;
      value.brand_attributes = {
        name: name
      };
      type = 'ambassador'
    } else if (type == 'salon') {
      let name = value['business_name'];
      delete value.business_name;
      value.salon_attributes = {
        name: name
      };
      type = 'owner'
    }
    try {
      const user = await fetch.fetch('/users', {
        method: 'POST',
        body: {
          user: {
            ...value,
            'account_type': type
          }
        }
      })
      this.user = user;
      this.userState = READY;
    } catch (error) {
      this.userState = LOADING_ERROR;
    }
  }

  @action loginWithEmail = async (value, type) => {
    this.userState = LOADING;
    try {
      const user = await fetch.fetch(
        '/sessions',
        {
          method: 'POST',
          body: {
            session: {
              ...value
            }
          }
        }
      );
      this.user = user;
      await this.loadUserInformation();
      this.userState = READY;
      return this.user;
    } catch (error) {
      this.userState = LOADING_ERROR;
      throw error;
    }
  }

  @action destroy = async () => {
    fetch.fetch(`/users/${this.user.id}`, {method: 'DELETE'})
        .catch(e => console.log(e));
    this.user = {
      educations: [],
      offerings: [],
    };
    this.userState = EMPTY;
    this.followingStates = {};
    this.token = null;
  }
}

const store =  new UserStore();
hydrate('user', store);

window.userStore = store;

export default store;
