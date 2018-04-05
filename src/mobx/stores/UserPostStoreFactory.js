import {observable, computed, action} from 'mobx';

import { UserPostStore } from './UserPostStore';

class UserPostStoreFactory {

  @observable userStores = observable.map();

  @action
  initUserStore(userId) {
    const userStore = this.userStores.get(userId);
    if(userStore) {
      this.userStores.set(userId, {...userStore, activeConsumers: userStore.activeConsumers + 1});
      return userStore.store;
    }else{
      const userStore = {store: new UserPostStore(), activeConsumers: 1};
      this.userStores.set(userId, userStore);
      return userStore.store;
    }
  }

  @action
  freeUserStore(userId) {
    const userStore = this.userStores.get(userId);
    let activeConsumers = userStore.activeConsumers - 1;
    if(activeConsumers > 0) {
      this.userStores.set(userId, {...userStore, activeConsumers: userStore.activeConsumers - 1});
    }else{
      this.userStores.delete(userId);
    }
  }

  @action
  load(userId) {
    this.userStores.get(userId).load(userId);
  }

  getUserStore(userId) {
    let userStoreRef = this.userStores.get(userId);
    return (userStoreRef) ? userStoreRef.store : null;
  }
}

export const StoreFactory = new UserPostStoreFactory();
