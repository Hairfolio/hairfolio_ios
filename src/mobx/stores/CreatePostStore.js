import {observable, action} from 'mobx';

class CreatePostStore {
  @observable inputMethod = 'Photo';
  @observable isOpen = false;
  @observable lastPicture = {};

  @action changeInputMethod(name) {
    this.inputMethod = name;
  }
};

const store = new CreatePostStore();

export default store;


