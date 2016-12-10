import {observable, computed, action} from 'mobx';

import Picture from 'stores/Picture.js'

import ServiceBackend from 'backend/ServiceBackend.js'

import {v4} from 'uuid';

import {_, moment, React, Text} from 'hairfolio/src/helpers';

class Contact {
  @observable name;
  @observable picture;

  @computed get startLetter() {
    return this.name.toUpperCase()[0];
  }

  constructor(name) {
    this.name = name;

    let picObj = require('img/feed_example_profile.png');
    this.picture = new Picture(
      picObj,
      picObj,
      null
    );
  }
}

class BlackBookStore {
  @observable isLoading = false;
  @observable contacts = [];

  constructor() {
    this.load();
  }

  @computed get hasData() {
    return Object.keys(this.data).length > 0;
  }

  @computed get data() {
    if (this.contacts.length == 0) {
      return {};
    } else {
      let dict = {};
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(c => {
        let list = this.contacts.filter(e => e.startLetter == c);

        if (list.length > 0) {
          list[list.length - 1].isLast = true;
          dict[c] = list;
        }
      });
      return dict;
    }
  }

  async load() {
    this.isLoading = true;

    this.contacts = [
      new Contact('Aileen Cordle'),
      new Contact('Antionette Merle'),
      new Contact('Anton Heber'),
      new Contact('Chan Dollinger'),
      new Contact('Daryl Ciesielski'),
      new Contact('Delia Myles'),
      new Contact('Ferne Vanbeek'),
      new Contact('Graham Mackey'),
      new Contact('Hannelore Rey'),
      new Contact('Hillary Harlan'),
      new Contact('Jackqueline Roberto'),
      new Contact('Lacie Peppler'),
      new Contact('Magaly Rohe'),
      new Contact('Marcella Iler'),
      new Contact('Miguelina Hamlin'),
      new Contact('Natividad Alpers'),
      new Contact('Raquel Devlin'),
      new Contact('Sallie Mcgeorge'),
      new Contact('Teresia Janis'),
      new Contact('Vernie Mayoral'),
    ];

    this.isLoading = false;
  }
}

const store = new BlackBookStore();

export default store;

