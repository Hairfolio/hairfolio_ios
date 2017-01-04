import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'
let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';


import ServiceBackend from 'backend/ServiceBackend.js'
import Service from 'hairfolio/src/services/index.js'

import {_, moment, React, Text} from 'hairfolio/src/helpers';

class Hairfolio {

  @observable name;
  @observable numberOfPosts;
  @observable picture;

  constructor(obj) {
    console.log('hairfolios', obj);
    this.name = obj.name;
    this.id = obj.id;
    this.numberOfPosts = obj.posts.length;

    this.posts = obj.posts;

    let picObj;

    if (this.numberOfPosts > 0) {
      picObj = {uri: obj.posts[0].photos[0].asset_url};
      this.picture = new Picture(picObj, picObj, null);
    }
  }

  @computed get hasPicture() {
    return this.picture != null;
  }
}

export class HairfolioStore {
  @observable isLoading = false;
  @observable hairfolios = [];
  @observable isEditable;

  constructor() {
  }

  async addHairfolio() {

    let name  = this.textInput._lastNativeText;

    if (name.length > 0) {
      let res = await ServiceBackend.post('folios', {folio: {name: name}});
      this.hairfolios.push(new Hairfolio(res.folio));
      this.textInput.clear();
    }
  }

  async delete(store) {
    this.hairfolios = this.hairfolios.filter(e => e.id != store.id);

    let results = await ServiceBackend.delete(`folios/${store.id}`);
    console.log('delete', results);
  }

  async load(id) {
    this.isLoading = true;

    let results;

    let currentUserId = Service.fetch.store.getState().user.data.get('id')

    if (!id || id == currentUserId) {
      results = await ServiceBackend.get('folios');
      this.isEditable = true;
    } else {
      this.isEditable = false;
      results = await ServiceBackend.get(`/users/${id}/folios`);
    }

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

const store = new HairfolioStore();

export default store;

