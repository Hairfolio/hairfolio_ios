import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_} from 'hairfolio/src/helpers';


var counter = 0;
const COLORS = ['blue', 'orange', 'red'];
class LibraryPicture {

  @observable selectedNumber;
  @observable parent;

  constructor(uri, parent) {
    this.key = v4();
    this.parent = parent;
    this.uri = `assets-library://asset/asset.JPG?id=${uri}&ext=JPG`;
  }

  @action select() {
    this.parent.selectPicture(this);
  }


};

class CreatePostStore {
  @observable inputMethod = 'Photo';
  @observable isOpen = false;
  @observable lastTakenPicture = {};
  @observable groupName = 'Camera Roll';
  @observable libraryPictures = [];

  @observable selectedPictures = [];

  constructor() {
    this.updateLibraryPictures();
  }

  @computed get selectedLibraryPicture() {
    if (this.selectedPictures.length == 0) {
      return null;
    } else {
      return this.selectedPictures[this.selectedPictures.length - 1];
    }
  }

  @action selectPicture(picture) {

    let selectedNumber = picture.selectedNumber;

    if (selectedNumber == null) {
      this.selectedPictures.push(picture);
      picture.selectedNumber = this.selectedPictures.length;
    } else {
      picture.selectedNumber = null;

      this.selectedPictures = this.selectedPictures.filter((el) => el.key != picture.key);

      for (var pic of this.selectedPictures) {
        console.log('pic', pic.selectedNumber);
        if (pic.selectedNumber >= selectedNumber) {
          console.log('decrease');
          pic.selectedNumber--;
        }
      }
    }
  }

  updateLibraryPictures() {
    PhotoAlbum.getPhotosFromAlbums(this.groupName, (data) => {
      this.libraryPictures = data.map((el) => new LibraryPicture(el, this));
    });
  }

  @computed get libraryTitle() {
    return `Select Media (${this.selectedPictures.length})`;
  }

  @action changeGroupName(newName) {
    if (this.groupName != newName) {
      this.groupName = newName;
      this.libraryPictures = [];
      this.selectedPictures = [];
      this.updateLibraryPictures();
    }
  }

  @action changeInputMethod(name) {
    this.inputMethod = name;

    console.log('change input');
  }

  @computed get title() {
    if (this.inputMethod == 'Library') {
      return this.groupName;
    } else {
      return this.inputMethod;
    }
  }
};

const store = new CreatePostStore();

window.postStore = store;

export default store;


