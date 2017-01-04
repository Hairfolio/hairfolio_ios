import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from 'stores/Picture.js'
import ServiceBackend from 'backend/ServiceBackend.js'

import Service from 'hairfolio/src/services/index.js'

import {_, v4, moment, React, Text} from 'hairfolio/src/helpers';

import User from 'stores/User.js'

import * as routes from 'hairfolio/src/routes.js'

export class SelectableUser {
  @observable user;
  @observable isSelected;

  constructor(obj) {
    this.key = v4();
  }

  async init(obj) {
    let user = new User();
    await user.init(obj);
    this.user = user;
    return this;
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


class WriteMessageStore {
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

    let userId = Service.fetch.store.getState().user.data.get('id')

    let res = (await ServiceBackend.get(`users/${userId}/follows?friends=true`)).users;

    let myUsers = await Promise.all(res.map(e => {
      let u = new SelectableUser();
      return u.init(e);
    }));

    console.log('myUsers', myUsers);

    this.users = myUsers;

    console.log('start render');

    this.isLoading = false;
  }
}

const store = new WriteMessageStore();

export default store;
