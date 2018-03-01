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
import ServiceBackend from '../../backend/ServiceBackend';

class UsersStore {
  @observable users;
  @observable usersStates;
  @observable currentProfile;

  constructor() {
    this.users = observable.map();
    this.usersStates = observable.map();
    this.currentProfile = null;
  }

  @action setCurrentProfile = (profile) => {
    this.currentProfile = profile;
  }

  @action getUser = async (userId) => {
    try {
      this.usersStates.set(userId, LOADING);
      const res = await ServiceBackend.get(`/users/${userId}`);
      const offerings = await ServiceBackend.get(`/users/${userId}/offerings`);
      this.users.set(userId, {
        ...res.user,
        offerings: offerings.offerings,
      });
      this.usersStates.set(userId, READY);
    } catch (error) {
      this.usersStates.set(userId, LOADING_ERROR);
      throw error;
    }
  }

}

export default new UsersStore();
