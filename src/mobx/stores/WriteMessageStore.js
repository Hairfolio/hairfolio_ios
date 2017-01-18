import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from 'stores/Picture.js'
import ServiceBackend from 'backend/ServiceBackend.js'

import Service from 'hairfolio/src/services/index.js'

import {_, v4, moment, React, Text} from 'hairfolio/src/helpers';

import User from 'stores/User.js'

import * as routes from 'hairfolio/src/routes.js'
import MessageDetailsStore from 'stores/MessageDetailsStore.js';


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
  @observable mode = 'POST'


  writeNewMessage() {
    MessageDetailsStore.myBack = () => window.navigators[0].jumpTo(routes.messagesRoute);
    MessageDetailsStore.createConversation(this.selectedItems);
    MessageDetailsStore.title = this.titleNames;
    window.navigators[0].jumpTo(routes.messageDetailsRoute);
  }

  async sharePost(myId, userId, post) {

    // create Conversation
    let postData = {
      sender: Service.fetch.store.getState().user.data.get('id'),
      conversation: {
        sender_id: myId,
        recipient_ids: [userId]
      }
    };

    // 1. get conversation
    let res = (await ServiceBackend.post('conversations', postData)).conversation;

    // share the post


  }


  actionBtnAction() {
    if (this.mode == 'MESSAGE') {
      this.writeNewMessage();
    } else {
      let users = this.selectedItems.map(e => e.user);

      for (let user of users) {
        ServiceBackend.sendPostMessage(user, this.post);
      }
      this.myBack();
    }
  }

  @computed get actionBtnText() {
    if (this.mode == 'MESSAGE') {
      return 'Start';
    } else {
      return 'Share';
    }
  }

  @computed get title() {
    if (this.mode == 'MESSAGE') {
      return 'New Message';
    } else {
      return 'Share Post';
    }
  }

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
