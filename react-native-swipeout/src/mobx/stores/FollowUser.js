import { v4 } from 'Hairfolio/src/helpers';
import { computed, observable } from 'mobx';
import ServiceBackend from '../../backend/ServiceBackend';
import { showLog } from '../../helpers';
import FeedStore from './FeedStore';
import Picture from './Picture';
import User from './User';
import UserStore from './UserStore';


export default class FollowUser {
  @observable user;
  @observable isFollowing;
  @observable followLoading;

  constructor() {
    this.key = v4();
  }

  async init(data) {
    this.user = new User();
    this.isFollowing = (data && data.is_followed_by_me) ? data.is_followed_by_me : false;
    await this.user.init(data);
    return this;
  }

  @computed get profilePicture() {
    return this.user.profilePicture;
  }

  @computed get name() {
    return this.user.name;
  }

  @computed get showFollowButton() {
    let myId = UserStore.user.id;
    return this.user.id != myId;
  }

  async follow() {
    this.followLoading = true;

    let myId = UserStore.user.id;


    let res = await ServiceBackend.post(`users/${this.user.id}/follows`, {});

    this.followLoading = false;
    this.isFollowing = true;
    // FeedStore.load();
  }

  async unfollow() {
    // alert("FOLLOW USER ==>")
    this.followLoading = true;

    let myId = UserStore.user.id;

    let res = await ServiceBackend.unfollowUser(`users/${this.user.id}/follows`);
    // alert("FOLLOW USER RESPONSE ==>"+JSON.stringify(res))
    if (res) {
      
      showLog("unfollow ==>" + JSON.stringify(res));

      this.followLoading = false;
      this.isFollowing = false
      // FeedStore.load();
    }


  }

  sample(name, isFollowing) {
    let picObj = require('img/feed_example_profile.png');
    this.profilePicture = new Picture(
      picObj,
      picObj,
      null
    );

    this.isFollowing = isFollowing;

    this.name = name;
  }
}
