import { computed, observable } from 'mobx';
import { NativeModules } from 'react-native';

let PhotoAlbum = NativeModules.PhotoAlbum;

var counter = 0;
const COLORS = ['blue', 'orange', 'red'];
class LibraryPicture {
  constructor(data) {
    this.key = counter++;
    this.uri = data.node.image.uri;
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
    uri = uri.substring(0, 36);
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
    this.load();
  }

  load() {
    PhotoAlbum.getAlbumNames((results) => {
      
      //Sorting albums before display
      results.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.creationDate) - new Date(a.creationDate);
      });
      this.albums = results.map((el) => new Album(el.title, el.count, el.uri));
    });
  }

  loadWithoutVideo() {
    PhotoAlbum.getAlbumNamesWithoutVideo((results) => {
      //Sorting albums before display
      results.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.creationDate) - new Date(a.creationDate);
      });
      this.albums = results.map((el) => new Album(el.title, el.count, el.uri));
    });
  }
};

const albumStore = new AlbumStore();

export default albumStore;
