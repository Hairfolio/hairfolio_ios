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
      const user = await fetch.fetch(`/users/${userId}`);
      const offerings = await fetch.fetch(`/users/${userId}/offerings`);
      this.users.push[{
        ...user,
        offerings,
      }];
      this.usersStates[userId] = READY;
    } catch (error) {
      this.usersStates[userId] = LOADING_ERROR;
    }
  }

}

export default new UsersStore();
