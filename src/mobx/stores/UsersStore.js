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

class UsersStore {
  @observable users;
  @observable usersStates;

  constructor() {
    this.users = [];
    this.usersStates = {};
  }

  @action getUser = async (userId) => {
    try {
      this.usersStates[userId] = LOADING;
      const res = await ServiceBackend.get(`/users/${userId}`);
      const offerings = await ServiceBackend.get(`/users/${userId}/offerings`);
      this.users.push[{
        ...res.user,
        offerings,
      }];
      this.usersStates[userId] = READY;
    } catch (error) {
      this.usersStates[userId] = LOADING_ERROR;
    }
  }

}

export default new UsersStore();
