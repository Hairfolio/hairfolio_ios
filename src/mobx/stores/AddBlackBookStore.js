import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from 'stores/Picture.js'
import ServiceBackend from 'backend/ServiceBackend.js'

import {_, v4, moment, React, Text} from 'hairfolio/src/helpers';

import User from 'stores/User.js'

import * as routes from 'hairfolio/src/routes.js'

class SelectableUser {
  @observable user;
  @observable isSelected;

  constructor(obj) {
    this.key = v4();
  }


  background() {
    return 'white';
  }

  flip() {
    this.isSelected = !this.isSelected;
  }

  async init(obj) {
    console.log('contactObj', obj);

    let user = new User();

    user.sample(obj.first_name + ' ' + obj.last_name);

    user.profilePicture = null;

    user.id = obj.id;
    this.posts = obj.posts;

    if (obj.asset_url) {
      let pic = {uri: obj.asset_url};
      user.profilePicture = new Picture(
        pic,
        pic,
        null
      );
    }

    this.user = user;
    this.isSelected = false;
    return this;
  }


  sample(name) {
    let user = new User();
    user.sample(name);
    this.user = user;
    this.isSelected = false;
  }
}


class AddBlackBookStore {
  @observable users = [];
  @observable inputText = '';
  @observable isLoading = false;

  @computed get titleNames() {
    let title = '';

    let num = 0;

    for (let u of this.users) {
      if (u.isSelected) {
        num++;
        if (num == 1) {
          title = u.user.name;
        } else if (num == 2) {
          title += ' , ' + u.user.name;
        } else {
          title +=  ', ...';
          return title;
        }
      }
    }

    return title;
  }

  @computed get selectedItems() {
    let users = [];

    for (let u of this.users) {
      if (u.isSelected) {
        users.push(u);
      }
    }

    return users;
  }

  @computed get items() {
    if (this.inputText.length == 0) {
      return this.users;
    }

    let users = [];
    for (let u of this.users) {
      if (u.isSelected) {
        users.push(u);
      }
    }

    for (let u of this.users) {
      if (!u.isSelected && u.user.name.indexOf(this.inputText) > -1) {
        users.push(u);
      }

    }

    return users;
  }

  @computed get isEmpty() {
    return this.users.length == 0;
  }

  @computed get selectedNumber() {
    return this.users.filter(e => e.isSelected).length;
  }

  get noElementsText() {
    return 'There have been no people yet.'
  }

  constructor() {
    // this.load();
  }

  async load() {

    this.isLoading = true;
    this.inputText = '';
    this.users = [];

    let res = (await ServiceBackend.get('contacts')).contacts;

    let myUsers = await Promise.all(res.map(e => {
      let u = new SelectableUser();
      return u.init(e);
    }));

    this.users = myUsers;

    this.isLoading = false;
  }

  select(list) {
    for (let el of list) {
      for (let u of this.users) {
        if (u.user.id == el.user.id) {
          u.isSelected = true;
        }
      }
    }
  }
}

const store = new AddBlackBookStore();

export default store;
