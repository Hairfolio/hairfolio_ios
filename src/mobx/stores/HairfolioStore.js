import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'
let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';


import ServiceBackend from 'backend/ServiceBackend.js'

import {_, moment, React, Text} from 'hairfolio/src/helpers';


class Hairfolio {

  @observable name;
  @observable numberOfPosts;

  constructor(obj) {
    console.log('hairfolios', obj);
    this.name = obj.name;
    this.id = obj.id;
    this.numberOfPosts = 0;
  }
}

class HairfolioStore {
  @observable isLoading = false;
  @observable hairfolios = [];

  constructor() {
  }

  async addHairfolio() {

    let name  = this.textInput._lastNativeText;

    if (name.length > 0) {
      let res = await ServiceBackend.post('hairfolios', {name: name});
      this.hairfolios.push(new Hairfolio(res));
      this.textInput.clear();
    }
  }

  async delete(store) {
    this.hairfolios = this.hairfolios.filter(e => e.id != store.id);

    let results = await ServiceBackend.delete(`hairfolios/${store.id}`);
    console.log('delete', results);
  }

  async load() {
    this.isLoading = true;

    let results = await ServiceBackend.get('hairfolios');
    console.log('hairfolios', results);

    if (results.length == 0) {
      // add inspiration
      let res = await ServiceBackend.post('hairfolios', {name: 'Inspiration'});
      this.hairfolios.push(new Hairfolio(res.hairfolio));
    } else {
      this.hairfolios = results.map(e => new Hairfolio(e)).reverse();
    }

    this.isLoading = false;
  }

}

const store = new HairfolioStore();

export default store;
