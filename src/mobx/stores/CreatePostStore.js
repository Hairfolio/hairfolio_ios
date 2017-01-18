import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'

import Picture from 'stores/Picture.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import AlbumStore from 'stores/AlbumStore.js';

import {v4} from 'uuid';

import {_, React, Text} from 'hairfolio/src/helpers';

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
    this.imageID = uri;
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

    setTimeout(() => {
      this.filterStore = new FilterStore(this);
    });
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

    this.description = 'This is a sample post';

    this.filterStore.setMainImage(this.selectedPicture);
    this.selectedTag = this.linkTagMenu;
    this.linkTagMenu.selected = true;

    // add hashtag
    // this.addHashToPicture(20, 100, 'test');
  }

  @action updateFilterStore() {
    this.filterStore = new FilterStore(this);
    this.filterStore.setMainImage(this.selectedPicture);
  }

  @action addServicePicture(x, y, data) {
    this.selectedTag = null;
    this.serviceTagMenu.selected = false;
    this.hashTagMenu.selected = false;
    this.linkTagMenu.selected = false;
    this.selectedPicture.addServiceTag(x, y, data);
  }

  @action addLinkToPicture(x, y, data) {
    this.selectedTag = null;
    this.serviceTagMenu.selected = false;
    this.hashTagMenu.selected = false;
    this.linkTagMenu.selected = false;
    this.selectedPicture.addLinkTag(x, y, data);
  }

  @action addHashToPicture(x, y, hashtag) {
    this.selectedTag = null;
    this.serviceTagMenu.selected = false;
    this.hashTagMenu.selected = false;
    this.linkTagMenu.selected = false;
    this.selectedPicture.addHashTag(x, y, hashtag);
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

  async toJSON() {

    console.log('post to json');

    let items = [];

    for (let pic of this.pictures) {
      let el = await pic.toJSON();
      items.push(el);
    }

    return {
      post: {
        description: this.description,
        photos_attributes: items
      }
    };
  }
}

class CreatePostStore {
  @observable isRecording = false;
  @observable loadGallery = false;
  @observable inputMethod = 'Photo';
  @observable isOpen = false;
  @observable lastTakenPicture = {};
  @observable groupName = 'Camera Roll';
  @observable libraryPictures = [];
  @observable selectedPictures = [];
  @observable cameraType = Camera.constants.Type.back;
  @observable cameraFlashMode = Camera.constants.FlashMode.off;
  @observable gallery = new Gallery();

  @observable isLoading = false;
  @observable loadingText;

  constructor() {
    // this.updateLibraryPictures();
  }

  @computed get flashIconSource() {
    if (this.cameraFlashMode == Camera.constants.FlashMode.off) {
      return require('img/post_flash_no.png');
    } else if (this.cameraFlashMode == Camera.constants.FlashMode.auto) {
      return require('img/post_flash_auto.png');
    } else {
      return require('img/post_flash.png');
    }
  }

  @action switchCameraType() {
    if (this.cameraType == Camera.constants.Type.front) {
      this.cameraType = Camera.constants.Type.back;
    } else {
      this.cameraType = Camera.constants.Type.front;
    }

    window.camera.changeCamera();
  }

  @action switchCameraFlashMode() {
    console.log('set flash mode');
    if (this.cameraFlashMode == Camera.constants.FlashMode.off) {
      this.cameraFlashMode = Camera.constants.FlashMode.auto;
      window.camera.setFlashMode('auto');
    } else if (this.cameraFlashMode == Camera.constants.FlashMode.auto) {
      this.cameraFlashMode = Camera.constants.FlashMode.on;
      window.camera.setFlashMode('on');
    } else {
      this.cameraFlashMode = Camera.constants.FlashMode.off;
      window.camera.setFlashMode('off');
    }
  }

  reset(resetGallary = true) {
    this.inputMethod = 'Photo';
    this.lastTakenPicture = {};
    this.groupName = 'Camera Roll';
    this.libraryPictures = [];
    this.selectedPictures = [];

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

  @action addTakenVideoToGallery() {

    let video = new Picture(
      {uri: this.lastTakenPicture.path},
      {uri: this.lastTakenPicture.path},
      this.gallery
    );

    console.log('picture thumnail', this.lastTakenPicture.path);

    video.videoUrl = this.lastTakenPicture.videoUrl;


    this.gallery.addPicture(video);

    this.gallery.wasOpened = true;
  }

  @action addTakenPictureToGallery() {

    this.gallery.addPicture(
      new Picture(
        {uri: this.lastTakenPicture.uri},
        {uri: this.lastTakenPicture.uri},
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

  imageLoaded() {
    this.loadedImages++;

    // TODO only load first 1200 pictures
    if (this.loadedImages % 50 == 0 && this.imageData.length > 0 && this.loadedImages < 1200) {

      // don't load next images so we have time to render
      setTimeout(() => {
        let newImages = this.imageData.splice(0, 50).map((el) => new LibraryPicture(el, this));
        this.libraryPictures = this.libraryPictures.concat(newImages);
      }, 50);
    }
  }

  updateLibraryPictures() {
    console.log('load photos');
    this.loadedImages = 0;
    this.libraryPictures;
    PhotoAlbum.getPhotosFromAlbums(this.groupName, (data) => {
      this.imageData = data.reverse();
      // load first 50 images and then continue ones they are loaded
      this.libraryPictures = this.imageData.splice(0, 50).map((el) => new LibraryPicture(el, this));
    });

    AlbumStore.load();
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

    if (this.inputMethod == 'Library') {
      this.updateLibraryPictures();
    }
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


