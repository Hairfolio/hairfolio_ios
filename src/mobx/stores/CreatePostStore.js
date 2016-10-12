import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';

import FilterStore from 'stores/FilterStore.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_} from 'hairfolio/src/helpers';

class ServiceTag {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.key = v4();
    this.abbrev = 'S';
  }
}

class LinkTag {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.key = v4();
    this.abbrev = 'L';
  }
}

class HashTag {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.key = v4();
    this.abbrev = 'H';
  }
}

var counter = 0;
const COLORS = ['blue', 'orange', 'red'];
class LibraryPicture {

  @observable selectedNumber;
  @observable parent;

  @observable serviceTags = [];
  constructor(uri, parent) {
    this.key = v4();
    this.parent = parent;
    this.uri = `assets-library://asset/asset.JPG?id=${uri}&ext=JPG`;
    this.imageID  = uri;
  }

  @action select() {
    this.parent.selectPicture(this);
  }


};

class TagMenu {


  @observable selected = false;

  constructor(title, source, parent) {
    this.title = title;
    this.source = source;
    this.parent = parent;
  }

  @action select() {
    this.parent.selectTag(this);
  }

  @computed get opacity() {
    if (this.selected) {
      return 1;
    } else {
      return 0.5;
    }
  }
}

export class Picture {

  @observable parent;
  @observable tags = [];
  @observable source;

  constructor(orignalSource, source, parent) {
    this.source = source;
    this.originalSource = source;
    this.key = v4();
    this.parent = parent;
  }

  @computed get selected() {
    return this.parent.selectedPicture == this;
  }

  @action select() {
    this.parent.selectedPicture = this;
  }

  @action addServiceTag(x, y) {
    this.tags.push(new ServiceTag(x, y));
  }


  @action addLinkTag(x, y) {
    this.tags.push(new LinkTag(x, y));
  }

  @action addHashTag(x, y) {
    this.tags.push(new HashTag(x, y));
  }
}

class ServiceBox {
  @observable show = false;
  @observable locY = 0;
  @observable locX = 0;
};

class Picker {

  constructor(title, data, value, onCancel, onConfirm) {
    this.title = title;
    this.data = data;
    this.value = value;
    this.onCancel = onCancel;
    this.onConfirm = onConfirm;
  }
};

class Position {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Gallery {

  @observable pictures = [];
  @observable selectedPicture = null;
  @observable filterStore;

  @observable sepiaPicture = null;

  @observable selectedTag = null;
  @observable description = '';

  position = new Position(50, 50);


  @observable openedPicker = null;

  @observable showPicker = true;
  @observable pickerData = [
    'Single Process Color',
    'Dual Process Color',
    'Highlights',
    'Lowlights',
    'Straightening'
  ];
  @observable pickerValue = 'Highlights';
  @observable pickerTitle = 'Service';




  @observable lastClick;

  wasOpened = false;

  @observable hashTagMenu = new TagMenu('Add Tag', require('img/post_hashtag.png'), this);
  @observable serviceTagMenu = new TagMenu('Add Service', require('img/post_service.png'), this);
  @observable linkTagMenu = new TagMenu('Add Link', require('img/post_link.png'), this);


  @action applyFilter() {
    this.selectedPicture.source = this.filterStore.mainPicture.source;
  }

  @computed get serviceTagSelected() {
    return this.selectedTag == this.serviceTagMenu;
  }

  @computed get linkTagSelected() {
    return this.selectedTag == this.linkTagMenu;
  }

  @computed get hashTagSelected() {
    return this.selectedTag == this.hashTagMenu;
  }

  @action selectTag(tag) {
    for (let el of [this.hashTagMenu, this.serviceTagMenu, this.linkTagMenu]) {
      if (el != tag) {
        el.selected = false;
      } else {
        el.selected = !el.selected;
        if (!el.selected) {
          this.selectedTag = null;
        } else {
          this.selectedTag = tag;
        }
      }
    }
  }

  @action reset() {
    this.selectedPicture = null;
    this.selectedTag = null;
    this.pictures = [];
    this.description = '';
    this.wasOpened = false;
  }

  constructor() {
    window.gallary = this;
    this.filterStore = new FilterStore(this);
  }

  @action deleteSelectedPicture() {
    this.pictures = this.pictures.filter(el => el != this.selectedPicture);

    this.selectedPicture = _.first(this.pictures);
  }

  @action addSamplePicture() {

    this.addPicture(
      new Picture(
        {uri: 'assets-library://asset/asset.JPG?id=106E99A1-4F6A-45A2-B320-B0AD4A8E8473/L0/001&ext=JPG' },
    {uri: 'assets-library://asset/asset.JPG?id=106E99A1-4F6A-45A2-B320-B0AD4A8E8473/L0/001&ext=JPG' },
        this
      )
    );
    this.selectedPicture = this.pictures[0];

    this.filterStore.setMainImage(this.selectedPicture);
    this.selectedTag = this.serviceTagMenu;
    this.serviceTagMenu.selected = true;
  }

  @action updateFilterStore() {
    this.filterStore = new FilterStore(this);
    this.filterStore.setMainImage(this.selectedPicture);
  }

  @action addServicePicture(x, y) {
    this.selectedTag = null;
    this.serviceTagMenu.selected = false;
    this.hashTagMenu.selected = false;
    this.linkTagMenu.selected = false;
    this.selectedPicture.addServiceTag(x, y);
  }

  @action addLinkToPicture(x, y) {
    this.selectedTag = null;
    this.serviceTagMenu.selected = false;
    this.hashTagMenu.selected = false;
    this.linkTagMenu.selected = false;
    this.selectedPicture.addLinkTag(x, y);
  }

  @action addHashToPicture(x, y) {
    this.selectedTag = null;
    this.serviceTagMenu.selected = false;
    this.hashTagMenu.selected = false;
    this.linkTagMenu.selected = false;
    this.selectedPicture.addHashTag(x, y);
  }

  @action addPicture(pic) {
    console.log('addPicture');
    this.pictures.unshift(pic);
    this.selectedPicture = _.first(this.pictures);
  }

  @action addLibraryPictures(libraryPictures) {
    let pictures = libraryPictures.map((el) => new Picture({uri: el.uri}, {uri: el.uri}, this));

    for (let el of this.pictures) {
      pictures.push(el);
    }

    this.pictures = pictures;
    this.selectedPicture = _.first(this.pictures);
  }

}

class CreatePostStore {
  @observable inputMethod = 'Photo';
  @observable isOpen = false;
  @observable lastTakenPicture = {};
  @observable groupName = 'Camera Roll';
  @observable libraryPictures = [];
  @observable selectedPictures = [];


  @observable gallery = new Gallery();


  constructor() {
    this.updateLibraryPictures();
  }

  reset(resetGallary = true) {
    this.inputMethod = 'Photo';
    this.lastTakenPicture = {};
    this.groupName = 'Camera Roll';
    this.libraryPictures = [];
    this.selectedPictures = [];
    this.updateLibraryPictures();

    if (resetGallary) {
      this.isOpen = false;
      this.gallery.reset();
    }
  }

  @computed get selectedLibraryPicture() {
    if (this.selectedPictures.length == 0) {
      return null;
    } else {
      return this.selectedPictures[this.selectedPictures.length - 1];
    }
  }

  @action addLibraryPicturesToGallary() {
    this.gallery.addLibraryPictures(
      this.selectedPictures
    );
    this.gallery.wasOpened = true;
  }

  @action addTakenPictureToGallery() {
    this.gallery.addPicture(
      new Picture(
        {uri: this.lastTakenPicture.path},
        {uri: this.lastTakenPicture.path},
        this.gallery
      )
    );
    this.gallery.wasOpened = true;
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
        if (pic.selectedNumber >= selectedNumber) {
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


