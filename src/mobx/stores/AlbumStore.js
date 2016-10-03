import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';

let PhotoAlbum = NativeModules.PhotoAlbum;

var counter = 0;
const COLORS = ['blue', 'orange', 'red'];
class LibraryPicture {
  constructor(data) {
    this.key = counter++;
    this.uri = data.node.image.uri;
    console.log(data);
  }

};

let albumCounter = 0;

class Album {
  @observable title;
  @observable count;
  @observable uri;

  constructor(title, count, uri) {
    this.title = title;
    this.count = count;
    // this.uri = uri.substring(0, 36);
    this.uri = `assets-library://asset/asset.JPG?id=${uri}&ext=JPG`;
    this.key = albumCounter++;
  }

  @computed get text() {
    return `${this.title} (${this.count})`;
  }
}

class AlbumStore {
  @observable albums = [];

  constructor() {
    PhotoAlbum.getAlbumNames((results) => {
      this.albums = results.map((el) => new Album(el.title, el.count, el.uri));
      console.log(results);
    });
  }
};

const albumStore = new AlbumStore();

export default albumStore;



