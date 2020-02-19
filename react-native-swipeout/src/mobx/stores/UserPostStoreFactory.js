import { action, observable } from "mobx";
import { UserPostStore } from "./UserPostStore";
import { showLog } from "../../helpers";

class UserPostStoreFactory {
  userStores = observable.map();

  @action
  initUserStore(userId) {
    const userStore = this.userStores.get(userId);
    if (userStore) {
      userStore.activeConsumers += 1;
      return userStore.store;
    } else {
      const newUserStore = { store: new UserPostStore(), activeConsumers: 1 };
      this.userStores.set(userId, newUserStore);
      return newUserStore.store;
    }
  }

  @action
  freeUserStore(userId) {
    const userStore = this.userStores.get(userId);
    if(userStore && userStore.activeConsumers) {
      let activeConsumers = userStore.activeConsumers - 1;
      if (activeConsumers > 0) {
        userStore.activeConsumers -= 1;
      } else {
        this.userStores.delete(userId);
      }
    }
  }

  @action
  load(userId) {
    showLog("HERE USER ID ==>"+userId);
    this.userStores.get(userId).store.load(userId);
  }

  getUserStore(userId) {
    let userStoreRef = this.userStores.get(userId);
    return userStoreRef ? userStoreRef.store : null;
  }
}

export const StoreFactory = new UserPostStoreFactory();
