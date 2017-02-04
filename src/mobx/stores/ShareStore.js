import {observable, computed, action} from 'mobx';
import {CameraRoll, AsyncStorage, Clipboard, AlertIOS, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'

import ServiceBackend from 'backend/ServiceBackend.js'
import Service from 'hairfolio/src/services/index.js'

import CreatePostStore from 'stores/CreatePostStore.js'

import User from 'stores/User.js'

let PhotoAlbum = NativeModules.PhotoAlbum;
let InstagramShare = NativeModules.RNInstagramShare;

let TwitterHelper = NativeModules.TwitterHelper;
let PinterestHelper = NativeModules.PinterestHelper;

const FBSDK = require('react-native-fbsdk');
const {
  ShareApi,
  LoginManager,
  AccessToken
} = FBSDK;

import {v4} from 'uuid';

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import {SelectableUser as SelectableUserBase} from 'stores/WriteMessageStore.js'

class Hairfolio {
  @observable name;
  @observable isSelected;
  @observable isInEdit;

  constructor(obj, isInEdit = false) {
    this.key = v4();
    this.name = obj.name;
    this.isSelected = false;
    this.isInEdit = isInEdit;
    if (obj.id) {
      this.id = obj.id;
    }
  }
}

class SelectableUser extends SelectableUserBase {
  background() {
    return '#F8F8F8';
  }
}

class SendStore {
  @observable users = [];
  @observable inputText = '';
  @observable isLoading = false;

  @computed get selectedItems() {
    let users = [];
    for (let u of this.users) {
      if (u.isSelected) {
        users.push(u);
      }
    }

    return users;
  }

  @computed get items() {
    if (this.inputText.length == 0) {
      return this.users;
    }

    let users = [];
    for (let u of this.users) {
      if (u.isSelected) {
        users.push(u);
      }
    }

    for (let u of this.users) {
      if (!u.isSelected && u.user.name.indexOf(this.inputText) > -1) {
        users.push(u);
      }

    }

    return users;
  }

  @computed get isEmpty() {
    return this.users.length == 0;
  }

  get noElementsText() {
    return 'There have been no people yet.'
  }

  async load() {
    this.isLoading = false;

    this.isLoading = true;
    this.inputText = '';
    this.users = [];

    let userId = Service.fetch.store.getState().user.data.get('id')

    console.log('userId', userId);

    let res = (await ServiceBackend.get(`users/${userId}/follows?friends=true`)).users;

    let myUsers = await Promise.all(res.map(e => {
      let u = new SelectableUser();
      return u.init(e);
    }));

    this.users = myUsers;

    this.isLoading = false;
  }
}


class HairfolioStore {
  @observable isLoading = false;
  @observable hairfolios = [];

  constructor() {
  }

  async saveHairfolio(store) {
    let res = await ServiceBackend.post('folios', {folio: {name: store.name}});

    console.log('set id', res.folio.id);
    store.id = res.folio.id;
  }

  async load() {
    this.isLoading = true;

    let results = await ServiceBackend.get('folios');
    results = results.folios;

    console.log('folios', results);

    if (results.length == 0) {
      // add inspiration
      console.log('case 1');
      let res = await ServiceBackend.post('folios', {folio: {name: 'Inspiration'}});
      this.hairfolios.push(new Hairfolio(res.folio));
    } else {
      console.log('case 2');
      this.hairfolios = results.map(e => new Hairfolio(e)).reverse();
    }
    this.isLoading = false;
  }
}

class ShareButtonStore {
  @observable isEnabled = false;

  reset() {
    this.isEnabled = false;
  }

  enableDisable() {
    this.isEnabled = !this.isEnabled;
  }

  @computed get opacity() {
    return this.isEnabled ? 1 : 0.5;
  }

}

class InstagramShareButton extends ShareButtonStore {

  openInstagram(copyToClipboard) {

    if (copyToClipboard) {
      Clipboard.setString(CreatePostStore.gallery.description + CreatePostStore.hashTagsText);
    }


    this.isEnabled = true;
    // alert(CreatePostStore.gallery.selectedPicture.source.uri);
    let picture = CreatePostStore.gallery.selectedPicture;

    let uri = picture.localId ? picture.localId :  picture.source.uri;

    let type;

    if (!picture.isVideo || picture.source.uri.startsWith('asset') || picture.localId) {
      InstagramShare.share(uri, 'library');
    } else {
      InstagramShare.share(picture.videoUrl, 'file');
    }
  }

  enableDisable() {
    AlertIOS.alert(
      'Copy description to clipboard?',
      'Copy this post\'s description to your clipboard so you can paste it into the Instagram description field?',
      [
        {text: 'OK', onPress: () => {this.openInstagram(true)}},

        {text: 'No thanks', onPress: () => {this.openInstagram(false)}},
      ],
    );
  }
}

class TwitterShareButton extends ShareButtonStore {

  async share(imageUrl) {

    if (!this.isEnabled) {
      return;
    }

    TwitterHelper.tweet(
      CreatePostStore.gallery.description + CreatePostStore.hashTagsText,
      imageUrl,
      () => { },
      () => { alert('Twitter sharing failed'); }
    );


  }


  async enableDisable() {

    if (this.isEnabled) {
      this.isEnabled = false;
      return;
    }


    try {
      let res = await TwitterHelper.login();
      this.isEnabled = true;

    } catch(error) {
      this.isEnabled = false;
    }




  }
}

class PinterestShareButton extends ShareButtonStore {

  constructor(parent) {
    super();
    this.parent = parent;
  }

  async share(imageUrl) {

    if (!this.isEnabled) {
      return;
    }

    try {
      let data = await PinterestHelper.getBoardIdFromName(this.selectedBoard);

      PinterestHelper.pinPost(
        data.id,
        imageUrl,
        CreatePostStore.gallery.description + CreatePostStore.hashTagsText,
        'http://hairfolioapp.com/'
      );

    } catch (error) {
      alert(error);
    }
  }

  async createNewBoard(name) {
    try {
      await PinterestHelper.createNewBoard(name);
      this.setBoardName(name);
    } catch(error) {
      alert(error);
    }
  }



  setBoardName(name) {
    this.isEnabled = true;
    AsyncStorage.setItem('pinterestBoard', name);
    this.selectedBoard = name;
  }



  async enableDisable() {

    if (this.isEnabled) {
      this.isEnabled = false;
      return;
    }


    try {
      let res = await PinterestHelper.login();

      // get the board name from the local storage
      let boardName = await AsyncStorage.getItem('pinterestBoard');

      if (boardName) {
        this.setBoardName(boardName);

        return;
      }


      let data = await PinterestHelper.getBoards();

      let boards = data.boards;

      if (boards.length == 0) {
        AlertIOS.prompt(
          'Pin to board',
          'No Pinterest board could be found, please type the name of the pinterest board that should be created.',
          name => {
            this.createNewBoard(name);
          }
        );
      } else {


        let index = 0;

        let boardData = [];
        boardData.push(
          { key: index++, section: true, label: 'Select Board' }
        );

        for (let name of boards) {
          boardData.push(
            { key: index++, label: name},
          );

        }

        this.parent.boardData = boardData;

        this.parent.pinterestSelector.open();
      }

    } catch(error) {
      alert(error);
      this.isEnabled = false;
    }
  }
}


class FacebookShareButton extends ShareButtonStore {

  async share(imageUrl) {

    if (!this.isEnabled) {
      return;
    }

    const shareLinkContent = {
      contentType: 'link',
      contentUrl: 'http://hairfolioapp.com/',
      contentTitle: 'Hairfolio',
      contentDescription: 'Hairfolio is nice :)',
      imageUrl: imageUrl
    };


    ShareApi.canShare(shareLinkContent).then(
      function(canShare) {
        if (canShare) {
          return ShareApi.share(shareLinkContent, '/me', CreatePostStore.gallery.description + CreatePostStore.hashTagsText);
        }
      }
    ).then(
      function(result) {
        // alert('Share with ShareApi success.');
      },
      function(error) {
        alert('There was an issue with sharing on Facebook: ' + error);
      }
    );
  }


  async enableDisable() {

    if (this.isEnabled) {
      this.isEnabled = false;
      return;
    }

    let token = await AccessToken.getCurrentAccessToken();

    if (token == null) {
      let result = await LoginManager.logInWithPublishPermissions(['publish_actions']);

      if (!result.isCancelled) {
        this.isEnabled = true;
      }
    } else {
      this.isEnabled = true;
    }
  }
}

class ShareStore {

  @observable contacts = [];
  @observable sendStore = new SendStore();
  @observable hairfolioStore = new HairfolioStore();

  @observable boardData = [];

  @observable shareFacebookStore = new FacebookShareButton();
  @observable shareTwitterStore = new TwitterShareButton();
  @observable sharePinterestStore = new PinterestShareButton(this);
  @observable shareInstagramStore = new InstagramShareButton();


  constructor() {
    this.contacts = [];
    this.sendStore = new SendStore();
    this.hairfolioStore = new HairfolioStore();
    this.boardData = [];
  }

  share(imageUrl) {
    this.shareFacebookStore.share(imageUrl);
    this.shareTwitterStore.share(imageUrl);
    this.sharePinterestStore.share(imageUrl);
  }


  @computed get blackBookHeader() {
    return `${this.contacts.length} People`;
  }

  resetButtons() {
    this.shareFacebookStore = new FacebookShareButton();
    this.shareTwitterStore = new TwitterShareButton();
    this.sharePinterestStore = new PinterestShareButton(this);
    this.shareInstagramStore = new InstagramShareButton();
  }

  reset() {
    this.contacts = [];
    this.sendStore = new SendStore();
    this.hairfolioStore = new HairfolioStore();
    this.hairfolioStore.load();
    this.sendStore.load();
    this.boardData = [];
  }

  newHairfolio() {
    this.hairfolioStore.hairfolios.push(
      new Hairfolio(
        '',
        true
      )
    );

    setTimeout(() => this.input.focus(), 100);
  }

  saveHairfolio(store) {
    this.hairfolioStore.saveHairfolio(store);
    store.isInEdit = false;
  }

  @computed get selectedHairfolios() {
    return this.hairfolioStore.hairfolios.filter(e => e.isSelected);
  }

  @computed get selectedUsers() {
    return this.sendStore.selectedItems;
  }

  @computed get showBoard() {
    return this.boardData.length > 0;
  }
}

const store = new ShareStore();

window.shareStore = store;

export default store;

