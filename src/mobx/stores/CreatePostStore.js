import {observable, computed, action} from 'mobx';
import {CameraRoll, ListView, NativeModules} from 'react-native';
import {_, React, Text} from 'Hairfolio/src/helpers';
import {v4} from 'uuid';
import Camera from 'react-native-camera';
let PhotoAlbum = NativeModules.PhotoAlbum;
import ServiceBackend from '../../backend/ServiceBackend';
import Picture from './Picture';
import FilterStore from './FilterStore';
import AlbumStore from './AlbumStore';
import ShareStore from './ShareStore';
import FeedStore from './FeedStore';
import UserStore from './UserStore';
import AddBlackBookStore from './AddBlackBookStore'

var counter = 0;
const COLORS = ['blue', 'orange', 'red'];
class LibraryPicture {

  @observable selectedNumber;
  @observable parent;

  @observable serviceTags = [];
  constructor(data, parent) {
    this.key = v4();
    this.parent = parent;
    this.isVideo = data.isVideo == 'true';

    this.id = data.id;

    this.uri = `assets-library://asset/asset.JPG?id=${data.id.substring(0, 36)}&ext=JPG`;

    // this.videoUrl = `assets-library://asset/asset.mov?id=${data.id}&ext=mov`;

    if (this.isVideo) {
      PhotoAlbum.getVidePath(data.id, (data) => {
        this.videoUrl = data[0].uri;
      });
    }


    this.duration = data.duration;
    this.imageID = data.uri;
  }

  @computed get timeText() {
    if (this.isVideo) {
      return this.duration;
    }

    return '';
  }

  @action select() {
    this.parent.selectPicture(this);
  }
};

class TagMenu {


  @observable selected = false;

  constructor(title, sourceOn, sourceOff, parent) {
    this.title = title;
    this.sourceOn = sourceOn;
    this.sourceOff = sourceOff;
    this.parent = parent;
  }

  @computed get source() {
    if (this.selected) {
      return this.sourceOn;
    } else {
      return this.sourceOff;
    }
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

  @observable hashTagMenu = new TagMenu(
    'ADD TAG',
    require('img/post_hashtag_on.png'),
    require('img/post_hashtag_off.png'),
    this
  );

  @observable serviceTagMenu = new TagMenu(
    'ADD SERVICE',
    require('img/post_service_on.png'),
    require('img/post_service_off.png'),
    this
  );

  @observable linkTagMenu = new TagMenu(
    'ADD LINK',
    require('img/post_link_on.png'),
    require('img/post_link_off.png'),
    this
  );


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

  unselectTag() {

    this.selectedTag = null;

    for (let el of [this.hashTagMenu, this.serviceTagMenu, this.linkTagMenu]) {
      el.selected = false;
    }
  }

  @action reset() {
    this.selectedPicture = null;
    this.selectedTag = null;
    this.pictures = [];
    this.description = '';
    this.wasOpened = false;

    this.unselectTag();
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

    this.description = 'This is a sample post.';

    this.filterStore.setMainImage(this.selectedPicture);
    // this.selectedTag = this.linkTagMenu;
    // this.linkTagMenu.selected = true;

    // add hashtag
    this.addHashToPicture(20, 100, 'test');
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
    this.pictures.unshift(pic);
    this.selectedPicture = _.first(this.pictures);
  }

  @action addLibraryPictures(libraryPictures) {
    let pictures = libraryPictures.map((el) => {
      let pic = new Picture({uri: el.uri}, {uri: el.uri}, this);

      if (el.isVideo) {
        pic.videoUrl = el.videoUrl;
        pic.identifier = el.id;
      }

      return pic;
    });

    for (let el of this.pictures) {
      pictures.push(el);
    }

    this.pictures = pictures;
    this.selectedPicture = _.first(this.pictures);
  }

  async toJSON() {

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

const imagesSelectedLimit = 10;

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

  @observable recordedTime;

  constructor() {
    // this.updateLibraryPictures();
  }


  startRecording() {
    window.recorder.record();
    this.isRecording = true;
    this.recordedTime = 0;

    this.recordFun = setInterval(
      () => {
        this.recordedTime += 1;
      },
      1000
    );
  }

  stopRecording() {
    window.recorder.pause();
    CreatePostStore.isRecording = false;
    clearInterval(this.recordFun);
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
    window.recorder && window.recorder.removeAllSegments();
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
    this.gallery.selectedPicture = _.first(this.gallery.pictures);
  }

  @action addTakenVideoToGallery() {

    let video = new Picture(
      {uri: this.lastTakenPicture.path},
      {uri: this.lastTakenPicture.path},
      this.gallery
    );

    video.videoUrl = this.lastTakenPicture.videoUrl;


    this.gallery.addPicture(video);

    this.gallery.wasOpened = true;
  }

  @action addTakenPictureToGallery() {

    let picture = new Picture(
      {uri: this.lastTakenPicture.uri},
      {uri: this.lastTakenPicture.uri},
      this.gallery
    );

    if (this.lastTakenPicture.id) {
      picture.localId = this.lastTakenPicture.id;
    }

    this.gallery.addPicture(picture);

    this.gallery.wasOpened = true;
  }

  @action selectPicture(picture) {
    if (picture.selectedNumber == null && this.selectedPictures.length < imagesSelectedLimit) {
      this.selectedPictures.push(picture);
      picture.selectedNumber = this.selectedPictures.length;
    } else {
      const pictureIndex = this.selectedPictures.findIndex(pic => pic.key === picture.key);
      if(pictureIndex !== -1) {
        this.selectedPictures.splice(pictureIndex, 1);
        this.selectedPictures.forEach((pic, i) => pic.selectedNumber = (i >= pictureIndex) ? pic.selectedNumber - 1 : pic.selectedNumber);
        picture.selectedNumber = null;
      }
    }
  }

  imageLoaded() {
    /*
    this.loadedImages++;

    if (this.loadedImages % 50 == 0 && this.imageData.length > 0 && this.loadedImages < 1200) {

      // don't load next images so we have time to render
      setTimeout(() => {
        let newImages = this.imageData.splice(0, 50).map((el) => new LibraryPicture(el, this));
        this.libraryPictures = this.libraryPictures.concat(newImages);
      }, 100);
    }
    */
  }

  updateLibraryPictures() {
    //this.loadedImages = 0;
    this.libraryPictures = [];
    PhotoAlbum.getPhotosFromAlbums(this.groupName, (data) => {
      this.imageData = data.reverse();
      // load first 50 images and then continue ones they are loaded
      // this.libraryPictures = this.imageData.splice(0, 50).map((el) => new LibraryPicture(el, this));
      this.libraryPictures = this.imageData.map((el) => new LibraryPicture(el, this));
    });

    AlbumStore.load();
  }

  @computed get libraryTitle() {
    return `Select Media (${this.selectedPictures.length})`;
  }

  @computed get libraryDataSource() {
    let arr = this.libraryPictures.slice();
    let newArr = [];
    let counter = 0;

    while (counter < arr.length) {
      let content = [];
      for (let a = 0; a < 4; a++) {
        if (counter + a < arr.length) {
          content.push(arr[counter + a]);
        } else {
          content.push(null);
        }
      }

      newArr.push(content);
      counter += 4;
    }

    return newArr;
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

  @computed get recordedTimeDisplay() {
    let time = this.recordedTime;
    const minutes = Math.floor(time / 60);
    const seconds =  time - 60 * minutes;
    let secondsDisplay = seconds < 10 ? '0' + seconds : seconds;
    let minutesDisplay = minutes < 10 ? '0' + minutes : minutes;

    return `${minutesDisplay}:${secondsDisplay}`;
  }

  @computed get title() {
    if (this.inputMethod == 'Library') {
      return this.groupName;
    } else if (this.inputMethod == 'Video') {
      if (this.isRecording) {
        return this.recordedTimeDisplay;
      } else {
        return this.inputMethod;
      }
    } else {
      return this.inputMethod;
    }
  }

  @computed get hashTagsText() {
    let text = '';

    for (let picture of this.gallery.pictures) {

      for (let tag of picture.tags) {
        if (tag.type == 'hashtag' && tag.x >= 0) {
          text += ' #' + tag.hashtag;
        }
      }
    }
    return text;
  }

  @action async postPost(navigator) {
    try {
      this.isLoading = true;
      this.loadingText = 'Uploading pictures ..';
      let data = await this.gallery.toJSON();

      window.postData = data;


      this.loadingText = 'Publishing the post';

      ShareStore.share(data.post.photos_attributes[0].asset_url);

      let res = await ServiceBackend.post('/posts', data);

      const contactsDetails = (AddBlackBookStore.selectedItems) ?
      await Promise.all(AddBlackBookStore.selectedItems
        .map(contact => ServiceBackend.get(`/contacts/${contact.user.id}`))) :
        [];
      window.postRes = res;

      if (res.status != 201) {
        alert('A backend error occured: ' + JSON.stringify(res));
        alert('The data was : ' + JSON.stringify(data));
      } else {
        for (let hairfolio of  ShareStore.selectedHairfolios) {
          ServiceBackend.pinHairfolio(hairfolio, res.post);
        }

        for (let user of ShareStore.selectedUsers) {
          ServiceBackend.sendPostMessage(UserStore.user.id, user.user, res.post);
        }

        for (let contact of contactsDetails) {
          ServiceBackend.addPostToBlackBook(contact, res.post);
        }

        FeedStore.load();
        navigator.popToRoot({ animated: true });
        navigator.switchToTab({
          tabIndex: 0,
        });
        setTimeout(() => this.reset(), 1000);
      }

      this.isLoading = false
    } catch(err) {
      this.isLoading = false;
      alert('An error occured ' + err.toString());
    }
  }
};

const store = new CreatePostStore();

window.postStore = store;

export default store;
