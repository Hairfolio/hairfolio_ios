import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_} from 'hairfolio/src/helpers';

class Selector {

  @observable isEnabled;
  @observable isOpen;
  @observable data;
  @observable title;
  @observable value;

  constructor(parent, value, data, isEnabled) {
    this.parent = parent;
    this.title = value;
    this.oldValue = value;
    this.value = value;
    this.data = data;
    this.isOpen = false;
    this.isEnabled = isEnabled;
  }

  @computed get arrowImage() {
    if (this.isOpen) {
      return require('img/post_arrow_up.png');
    } else {
      return require('img/post_arrow_down.png');
    }
  }

  @computed get opacity() {
    if (this.isEnabled) {
      return 1;
    } else {
      return 0.5;
    }
  }

  @computed get hasValue() {
    return this.title != this.value;
  }

  @action open() {
    this.parent.openSelector(this);
  }

}

class AddServiceStore {

  serviceSelector = new Selector(
    this,
    'Service',
    [ 'Single Process Color',
      'Dual Process Color',
      'Highlights',
      'Lowlights',
      'Straightening'
    ],
    true
  );

  brandSelector = new Selector(
    this,
    'Brand',
    _.times(5, (num) => 'Brand ' + num),
    false
  );


  colorNameSelector = new Selector(
    this,
    'Color name',
    _.times(5, (num) => 'Color name ' + num),
    false
  );

  @computed get nextOpacity() {
    if (this.colorNameSelector.hasValue) {
      return 1.0;
    } else {
      return 0.5;
    }
  }

  @observable selector = this.serviceSelector;

  @action openSelector(sel) {
    console.log('open again');
    this.selector = sel;

    for (let s of [this.serviceSelector, this.brandSelector, this.colorNameSelector]) {
      if (s != sel) {
        s.isOpen = false;
      } else {
        s.isOpen = true;
        if (s.value == s.title) {
          s.value = s.data[~~(s.data.length / 2)];
        }
      }
    }
  }

  @action cancelSelector() {
    this.selector.isOpen = false;
    this.selector.value = this.selector.oldValue;
  }

  @action confirmSelector() {
    this.selector.isOpen = false;
    this.selector.oldValue = this.selector.value;

    this.brandSelector.isEnabled = this.serviceSelector.title != this.serviceSelector.value;

    this.colorNameSelector.isEnabled = this.brandSelector.isEnabled && this.brandSelector.title != this.brandSelector.value;

  }
}


const store = new AddServiceStore();


export default store;


