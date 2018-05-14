import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from './Picture';
import ServiceBackend from '../../backend/ServiceBackend';
import Service from 'Hairfolio/src/services/index';
import {_, v4, moment, React, Text} from 'Hairfolio/src/helpers';
import User from './User';
import UserStore from './UserStore';
import MessageDetailsStore from './MessageDetailsStore';
import NavigatorStyles from '../../common/NavigatorStyles';

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
    MessageDetailsStore.createConversation(this.selectedItems);
    MessageDetailsStore.title = this.titleNames;
    this.goToMessageDetails();
  }

  async sharePost(myId, userId, post) {

    // create Conversation
    let postData = {
      sender: UserStore.user.id,
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
        ServiceBackend.sendPostMessage(UserStore.user.id, user, this.post);
      }
      this.goBack();
    }
  }

  goToMessageDetails() {
    if (this.navigator) {
      this.navigator.push({
        screen: 'hairfolio.MessageDetails',
        navigatorStyle: NavigatorStyles.basicInfo,
        title: this.title || '',
      });
    }
  }

  goBack() {
    if (this.navigator) {
      this.navigator.pop({
        animated: true,
      });
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

    let userId = UserStore.user.id;

    let res = (await ServiceBackend.get(`users/${userId}/follows?friends=true`)).users;

    let myUsers = await Promise.all(res.map(e => {
      let u = new SelectableUser();
      return u.init(e);
    }));

    this.users = myUsers;

    this.isLoading = false;
  }
}

const store = new WriteMessageStore();

export default store;
