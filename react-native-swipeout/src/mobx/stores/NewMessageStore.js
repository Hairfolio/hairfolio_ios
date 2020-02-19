import { observable } from 'mobx';
import { NativeModules } from 'react-native';
import ServiceBackend from '../../backend/ServiceBackend';
import UserStore from './UserStore';


let PhotoAlbum = NativeModules.PhotoAlbum;

class NewMessageStore {

  @observable newMessageNumber = 0;

  constructor() {

  }

  async load() {

    let userId = UserStore.user.id;
    let res = (await ServiceBackend.get(`users/${userId}`)).user;

    this.newMessageNumber = res.unread_messages_count;
  }
}

const store = new NewMessageStore();

export default store;

