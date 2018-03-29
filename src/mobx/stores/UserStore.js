
import {
  _, // lodash
  v4,
  observable,
  computed,
  moment,
  action,
  observer, // mobx
} from 'Hairfolio/src/helpers';
import { READY, EMPTY, LOADING, LOADING_ERROR } from '../../constants';
import { persist } from 'mobx-persist';
import hydrate from './hydrate';
import ServiceBackend from '../../backend/ServiceBackend';

class UserStore {
  @persist('object') @observable user;
  @persist @observable userState;
  @persist('map') @observable followingStates;
  @persist @observable changePasswordState;
  @persist @observable forgotPasswordState;
  @persist @observable registrationMethod;
  @observable needsMoreInfo = false;
  @observable sessionHasExpired;

  constructor() {
    this.user = {
      educations: [],
      offerings: [],
    };
    this.userState = EMPTY;
    this.followingStates = observable.map();
    this.changePasswordState = EMPTY;
    this.forgotPasswordState = EMPTY;
    this.registrationMethod = null;
  }

  @computed get token() {
    return this.user.auth_token;
  }

  @action setNeedsMoreInfo(value) {
    this.needsMoreInfo = value;
  }

  @action setHasSessionExpired(value) {
    this.sessionHasExpired = value;
    this.user.auth_token = (value) ? null : this.user.auth_token;
    UserStore
  }

  @action loadUser(user) {
    this.user = user;
  }

  @action setMethod(method) {
    this.registrationMethod = method;
  }

  @action editUser(values = {}, type) {
    this.userState = LOADING;
    if (values.experience_ids) {
      values.experience_ids = values.experience_ids;
    } else {
      values.experience_ids = [];
    }
    if (values.certificate_ids) {
      values.certificate_ids = values.certificate_ids;
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
        return ServiceBackend.patch(`/users/${this.user.id})}`, body)
          .then(res => {
            this.user = {
              ...this.user,
              ...res.user,
            };
            this.userState = READY;
          });
      } catch (error) {
        this.userState = LOADING_ERROR;
        throw error;
      }
    }

  }

  @action logout() {
    ServiceBackend.delete(`/sessions/${this.user.auth_token}`);
    this.user = {
      educations: [],
      offerings: [],
    };
    this.userState = EMPTY;
    this.followingStates = observable.map();
  }

  @action setToken(val) {
    this.user.auth_token = val;
  }

  @action addOffering(offering) {
    this.user.offerings.push(offering);
  }

  @action editOffering(id, offering) {
    const index = this.user.offerings.indexOf(offering);
    if (index < 0) {
      this.user.offerings[index] = offering;
    }
  }

  @action deleteOffering(id) {
    let index = -1;
    this.user.offerings.forEach((offering, i) => {
      if (offering.id === id) {
        index = i;
      }
    });
    this.user.offerings.splice(index, 1);
  }

  @action async addEducation(education) {
    ServiceBackend.post(`/users/${this.user.id}/educations`, { education: education })
      .then(response => {
        const newEducations = this.user.educations;
        newEducations.push(education);
        this.user.educations = newEducations;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  @action editEducation(id, education) {
    ServiceBackend.put(`/users/${this.user.id}/educations/${id}`, { education: education})
      .then(response => {
        const newEducations = this.user.educations;
        const index = newEducations.indexOf(education);
        if (index < 0) {
          newEducations[index] = education;
        }
        this.user.educations = newEducations;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });

  }

  @action deleteEducation(id) {
    let index = -1;
    ServiceBackend.delete(`/users/${this.user.id}/educations/${id}`)
      .then(response => {
        const newEducations = this.user.educations;
        newEducations.forEach((education, i) => {
          if (education.id === id) {
            index = i;
          }
        });
        newEducations.splice(index, 1);
        this.user.educations = newEducations;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  @action followUser(id) {
    this.followingStates.set(id, LOADING);
    ServiceBackend.post(
      `/users/${id}/follows`,
      {
        user: {id}
      }
    )
      .then(({followers_count}) => {
        this.user.following.push({id});
        this.user.follow_count = followers_count;
        this.followingStates.set(id, READY);
      })
      .catch(error => {
        this.followingStates.set(id, LOADING_ERROR);
      });
  }

  @action unfollowUser(id) {
    this.followingStates.set(id, LOADING);
    ServiceBackend.delete(`/users/${id}/follows`)
      .then(response => {
        this.user.following = this.user.following.filter(user => user.id !== id);
        this.user.follow_count = this.user.follow_count - 1;
        this.followingStates.set(id, READY);
      })
      .catch(error => {
        this.followingStates.set(id, LOADING_ERROR);
      });
  }

  async getUserEducations() {
    const response = await ServiceBackend.get(`/users/${this.user.id}/educations`);
    return response.educations;
  }

  async getUserOfferings() {
    const response = await ServiceBackend.get(`/users/${this.user.id}/offerings`);
    return response.offerings;
  }

  async getUserFollowing() {
    const response = await ServiceBackend.get(`/users/${this.user.id}/follows`);
    return response.users;
  }

  @action async forgotPassword(email) {
    try {
      this.forgotPasswordState = LOADING;
      const response = await ServiceBackend.post(
        '/sessions/recover',
        { email }
      );
      this.forgotPasswordState = READY;
    } catch(error) {
      this.forgotPasswordState = LOADING_ERROR;
    }
  }
  @action async changePassword(value) {
    try {
      this.changePasswordState = LOADING;
      const response = await ServiceBackend.post(
        `/users/${this.user.id}/change_password`,
        {
          user: value
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

  @action  async loginWithFacebook(token) {
    this.userState = LOADING;
    try {
      const res = await ServiceBackend.post(
        '/sessions/facebook',
        {
          'facebook_token': token
        }
      );
      this.user = res.user;
      await this.loadUserInformation();
      this.userState = READY;
    } catch(error) {
      this.userState = LOADING_ERROR;
      throw error;
    }
  }

  @action async signupWithFacebook(token, type) {
    this.userState = LOADING;
    try {
      const res = await ServiceBackend.post(
        '/sessions/facebook',
        {
          'facebook_token': token
        }
      );
      this.user = res.user;
      this.userState = READY;
    } catch(error) {
      this.userState = LOADING_ERROR;
      throw error;
    }
  }

  @action async loginWithInstagram(token) {
    this.userState = LOADING;
    try {
      const res = await ServiceBackend.post(
        '/sessions/instagram',
        {
          'instagram_token': token
        }
      );
      this.user = res.user;
      await this.loadUserInformation();
      this.userState = READY;
    } catch(error) {
      this.userState = LOADING_ERROR;
      throw error;
    }
  }

  @action async signupWithInstagram(token, type) {
    this.userState = LOADING;
    try {
      const res = await ServiceBackend.post(
        '/sessions/instagram',
        {
          'instagram_token': token
        }
      );
      if (res.user) {
        this.user = res.user;
        this.userState = READY;
      } else {
        this.userState = LOADING_ERROR;
        throw new Error(res.errors);
      }
    } catch(error) {
      this.userState = LOADING_ERROR;
      throw error;
    }
  }

  @action async signUpWithEmail(value = {}, type) {
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
      const res = await ServiceBackend.post(
        '/users',
        {
          user: {
            ...value,
            'account_type': type
          }
        }
      );
      if(res.status != 201) {
        throw res.errors.first();
      }
      this.user = res.user;
      this.needsMoreInfo = type !== 'consumer';
      this.userState = READY;
    } catch (error) {
      this.userState = LOADING_ERROR;
      throw error;
    }
  }

  @action async loginWithEmail(value, type) {
    this.userState = LOADING;
    try {
      const res = await ServiceBackend.post(
        '/sessions',
        {
          session: {
            ...value
          }
        }
      );
      this.user = res.user;
      await this.loadUserInformation();
      this.userState = READY;
      return this.user;
    } catch (error) {
      this.userState = LOADING_ERROR;
      throw error;
    }
  }

  @action async destroy() {
    ServiceBackend.delete(`/users/${this.user.id}`)
        .catch(e => console.log(e));
    this.user = {
      educations: [],
      offerings: [],
    };
    this.userState = EMPTY;
    this.followingStates = observable.map();
  }
}

const store =  new UserStore();
hydrate('user', store);

window.userStore = store;

export default store;
