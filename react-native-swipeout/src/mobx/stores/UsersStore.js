import { action, observable } from "Hairfolio/src/helpers";
import ServiceBackend from "../../backend/ServiceBackend";
import { LOADING, LOADING_ERROR, READY } from "../../constants";
import { showLog } from "../../helpers";

class UsersStore {
  @observable users;
  @observable usersStates;
  @observable currentProfile;
  @observable myReferralCode;

  constructor() {
    this.users = observable.map();
    this.usersStates = observable.map();
    this.currentProfile = null;
  }

  @action setCurrentProfile = profile => {
    this.currentProfile = profile;
  };

  @action getUser = async userId => {
    try {
      this.usersStates.set(userId, LOADING);
      const res = await ServiceBackend.get(`users/${userId}`);
      // showLog("GET CURRENT USER NOW ==> "+JSON.stringify(res.user))
      const offerings = await ServiceBackend.get(`users/${userId}/offerings`);
      this.myReferralCode = res.user.referral_code;
      this.users.set(userId, {
        ...res.user,
        offerings: offerings.offerings
      });
      this.usersStates.set(userId, READY);
    } catch (error) {
      this.usersStates.set(userId, LOADING_ERROR);
      throw error;
    }
  };
}

export default new UsersStore();
