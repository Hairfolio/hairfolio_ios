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
    this.load();
  }

  async load() {
    this.isLoading = true;
    this.inputText = '';
    this.users = [];

    let arr = [];

    for (let name of ['Albert Williams',  'Emily Tailor', 'Jack Daniels', 'Norbert King']) {
      let user = new SelectableUser();
      user.sample(name);
      arr.push(user);
    }

    this.users = arr;
    this.isLoading = false;
  }

  select(list) {
    for (let el of list) {
      for (let u of this.users) {
        if (u.user.name == el.user.name) {
          u.isSelected = true;
        }
      }
    }
  }
}

const store = new AddBlackBookStore();

export default store;
