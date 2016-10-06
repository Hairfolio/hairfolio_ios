import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_} from 'hairfolio/src/helpers';

class SimpleSelector {
  @observable data=[];
  @observable selectedValue;

  constructor(data, selectedValue) {
    this.data = data;
    this.selectedValue = selectedValue;
  }
}

class Selector {

  @observable isEnabled;
  @observable isOpen;
  @observable data;
  @observable title;
  @observable value;

  constructor(parent, value, data, isEnabled, title) {
    this.parent = parent;
    this.title = title ? title : value;
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

  @action openPageThree() {
    this.parent.openSelectorPageThree(this);
  }


}

class ColorField {
  @observable name;
  @observable color;
  @observable isSelected;
  @observable amount;

  @observable amountSelector;

  constructor(color, name, mainStore, isSelected = false) {
    this.name = name;
    this.color = color;
    this.key = v4();
    this.isSelected = false;
    this.mainStore = mainStore;
    this.isSelected = isSelected;
    this.amount = 20;

    this.amountSelector2 = new SimpleSelector(
      _.times(301, (n) => `${n} g`),
      '20 g'
    );

    this.amountSelector = new Selector(
      mainStore,
      '20g',
      _.times(100, (n) => `${n + 1}g`),
      true,
      'Amount'
    );
  }

  @computed get borderStyle() {
    if (this.color == 'white') {
      return {
        borderWidth: 1 / 2,
        borderColor: 'black'
      };
    }
    return {};
  }

  @computed get textColor() {
    if (this.color == 'white') {
      return 'black';
    }
    return 'white';
  }

  @computed get borderColor() {
    if (this.isSelected) {
      return '#3E3E3E';
    } else {
      return 'white';
    }
  }

  @computed get borderWidth() {
    if (this.isSelected) {
      return 3;
    } else {
      return 1;
    }
  }

  @computed get canSelect() {
    return this.mainStore.selectedColors.length < 4;
  }

  @action select() {
    this.isSelected = true;
  }
}

class ColorGrid {
  @observable colors;

  constructor(parent) {
    this.colors = [
      [
        new ColorField('#DFCFC2', '10N', parent),
        // TODO only for testing
        new ColorField('#C0A285', '9N', parent),
        new ColorField('#BC9B7C', '8N', parent),
        new ColorField('#AB9580', '7N', parent),
        new ColorField('#706664', '6N', parent),
        new ColorField('#665C5A', '5N', parent),
        new ColorField('#514A49', '4N', parent),
        new ColorField('#48413F', '3N', parent)
      ],
      [
        new ColorField('#F1E2CD', '10G', parent),
        new ColorField('#EFD298', '9G', parent),
        // TODO only for testing
        new ColorField('#EEC061', '8G', parent),
        new ColorField('#E9B859', '7G', parent),
        new ColorField('#E08F41', '6G', parent),
        new ColorField('#D77D49', '5G', parent),
        new ColorField('#CB6B2D', '4G', parent),
        // TODO only for testing
        new ColorField('#B55F27', '3G', parent)
      ],
      [
        new ColorField('#DFCFC2', '10N', parent),
        new ColorField('#C0A285', '9N', parent),
        new ColorField('#BC9B7C', '8N', parent),
        // TODO only for testing
        new ColorField('#AB9580', '7N', parent),
        new ColorField('#706664', '6N', parent),
        new ColorField('#665C5A', '5N', parent),
        new ColorField('#514A49', '4N', parent),
        new ColorField('#48413F', '3N', parent)
      ],
      [
        new ColorField('#F1E2CD', '10G', parent),
        new ColorField('#EFD298', '9G', parent),
        new ColorField('#EEC061', '8G', parent),
        new ColorField('#E9B859', '7G', parent),
        new ColorField('#E08F41', '6G', parent),
        new ColorField('#D77D49', '5G', parent),
        new ColorField('#CB6B2D', '4G', parent),
        new ColorField('#B55F27', '3G', parent)
      ],
      [
        new ColorField('#DFCFC2', '10N', parent),
        new ColorField('#C0A285', '9N', parent),
        new ColorField('#BC9B7C', '8N', parent),
        new ColorField('#AB9580', '7N', parent),
        new ColorField('#706664', '6N', parent),
        new ColorField('#665C5A', '5N', parent),
        new ColorField('#514A49', '4N', parent),
        new ColorField('#48413F', '3N', parent)
      ],
      [
        new ColorField('#F1E2CD', '10G', parent),
        new ColorField('#EFD298', '9G', parent),
        new ColorField('#EEC061', '8G', parent),
        new ColorField('#E9B859', '7G', parent),
        new ColorField('#E08F41', '6G', parent),
        new ColorField('#D77D49', '5G', parent),
        new ColorField('#CB6B2D', '4G', parent),
        new ColorField('#B55F27', '3G', parent)
      ],
    ]
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

  @observable colorGrid;

  @observable specialColor = new ColorField('white', 'VL', this)
  @observable selectedMinutes = '30 min';

  minData = _.times(100, (n) => `${n + 1} min`);

  @observable vlSelector = new SimpleSelector(
    _.times(12, (n) => `${5 * (n + 1)} VL`),
    '20 VL'
  );

  @observable vlWeightSelector = new SimpleSelector(
    _.times(301, (n) => `${n} g`),
    '30 g'
  );


  constructor() {
    this.colorGrid = new ColorGrid(this);
  }

  @computed get descriptionPageTwo() {
    if (this.selectedColors.length == 0) {
      return 'Select up to 4 Colors';
    } else {
      return `${this.selectedColors.length} colors selected`;
    }
  }

  @computed get selectedColors() {
    let myArr = [];
    for (let arr of this.colorGrid.colors) {
      for (let color of arr) {
        if (color.isSelected) {
          myArr.push(color);
        }
      }
    }
    return myArr;
  }


  @computed get canMoveToPageTwo() {
    return this.selectedColors.length > 0
  }

  @computed get nextOpacity() {
    if (this.colorNameSelector.hasValue) {
      return 1.0;
    } else {
      return 0.5;
    }
  }

  @observable selector = this.serviceSelector;

  @observable pageThreeSelector;

  @action openSelector(sel) {
    console.log('open selector');
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

    this.selector.isOpen = true;
  }


  @action openSelectorPageThree(sel) {
    this.pageThreeSelector = sel;
    this.pageThreeSelector.isOpen = true;
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

  @action confirmSelectorPageThree() {
    this.pageThreeSelector.isOpen = false;
    this.pageThreeSelector.oldValue = this.pageThreeSelector.value;
  }

  @action cancelSelectorPageThree() {
    this.pageThreeSelector.isOpen = false;
    this.pageThreeSelector.value = this.pageThreeSelector.oldValue;
  }

  @computed get pageThreePickerHeight() {
    if (this.pageThreeSelector && this.pageThreeSelector.isOpen) {
      return 200;
    } else {
      return 0;
    }
  }
}


const store = new AddServiceStore();


export default store;


