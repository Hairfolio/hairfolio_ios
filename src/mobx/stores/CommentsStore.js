import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from 'stores/Picture.js'

import {_, v4, moment, React, Text} from 'hairfolio/src/helpers';

class Comment {

}

class InputStore {
  @observable value;

  @computed get isEmpty() {
    return !this.value || this.value.length == 0;
  }
}

class CommentsStore {
  @observable comments = [];
  @observable isLoading = false;

  @observable inputStore= new InputStore();

  constructor() {
      /*
    let user = new StarGiver();
    user.sample('Sample User1', false);
    this.starGivers.push(user);

    user = new StarGiver();
    user.sample('Sample User1', true);
    this.starGivers.push(user);

    user = new StarGiver();
    user.sample('Sample User3', false);
    this.starGivers.push(user);
    */
  }

  @computed get isEmpty() {
    return this.comments.length == 0;
  }

}

const store = new CommentsStore();

export default store;

