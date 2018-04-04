import {observable, computed, action} from 'mobx';

import { UserPostStore } from './UserPostStore';

class UserPostStoreFactory {

  @observable userStores;

  constructor() {
    this.userStores = observable.map();
  }

  @action
  getUserStore(userId) {
    const userStore = this.userStores.get(userId);
    return (userStore) ?
    userStore :
    this.userStores.set(userId, {store: new UserPostStore(), activeConsumers: 1});
  }

  @action
  deleteUserStore(userId) {
    this.userStores.delete(userId);
  }
}

export const storeFactory = new UserPostStoreFactory();
