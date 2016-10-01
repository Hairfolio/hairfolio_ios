import {observable, action} from 'mobx';
import {CameraRoll} from 'react-native';

var counter = 0;
const COLORS = ['blue', 'orange', 'red'];
class LibraryPicture {
  constructor(data) {
    this.key = counter++;
    this.uri = data.node.image.uri;
    console.log(data);
  }

};

class CreatePostStore {
  @observable inputMethod = 'Photo';
  @observable isOpen = false;
  @observable lastPicture = {};
  @observable libraryPictures = [];

  @action changeInputMethod(name) {
    this.inputMethod = name;

    console.log('change input');

    if (name === 'Library') {
      CameraRoll.getPhotos({
        first: 20
      }).then((data) => {
        console.log(data);
        this.libraryPictures = data.edges.map((el) => new LibraryPicture(el));
        console.log('update libary', data.edges);
      });

    }
  }
};

const store = new CreatePostStore();

export default store;


