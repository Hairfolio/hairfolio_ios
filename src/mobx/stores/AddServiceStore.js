import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';

import ServiceBackend from 'backend/ServiceBackend.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_, Alert} from 'hairfolio/src/helpers';

class SimpleSelector {
  @observable data=[];
  @observable selectedValue;

  constructor(data, selectedValue) {
    this.data = data;
    this.selectedValue = selectedValue;
  }
}

class SelectorData {
  constructor({name, id, unit, brand_count}) {
    this.name = name;
    this.id = id;
    this.unit = unit;
    this.brandCount = brand_count;
  }
}

class Selector {

  @observable isEnabled;
  @observable isOpen;
  @observable data;
  @observable title;
  @observable value;
  @observable isLoaded;
  @observable isHidden;

  constructor(parent, data, value, isEnabled, title) {
    this.parent = parent;
    this.title = title ? title : value;
    this.oldValue = value;
    this.value = value;
    this.isOpen = false;
    this.data = data;
    this.isEnabled = isEnabled;
    this.isLoaded = false;
    this.isHidden = !isEnabled;
    this.isLoading = false;
  }

  reset() {
    this.value = this.title;
    this.isLoaded = false;
  }

  shouldLoad() {
    return !this.isLoading && !this.isLoaded;
  }

  @action closeAfterError() {
    this.isOpen = false;
    this.isLoading = false;
    this.isLoaded = false;
    Alert.alert('Error', 'The data could not be loaded. Please check your internet connection');
  }

  @action hide() {
    this.isHidden = true;
  }

  @action show() {
    this.isHidden = false;
  }

  @action setData(data) {
    this.data = data.map(el => new SelectorData(el));

    this.isLoaded = true;

    if (this.isOpen && this.value == this.title) {
      this.setValue(this.data[~~(this.data.length / 2)].name);

    }
  }

  @computed get selectedData() {
    if (this.data) {
      let res = this.data.filter(({name}) => name == this.value);
      if (res.length == 0) {
        return null;
      } else {
        return res[0];
      }

    }
    return null;
  }

  @action setValue(val) {
    this.value = val;
    this.parent.selectorValueChanged(this);
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

  @action close() {
    this.parent.confirmSelector(this);
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

  constructor({code, hex, start_hex, end_hex}, unit, mainStore, isSelected = false) {
    this.name = code;

    this.color = `#${hex}`;

    this.startColor = start_hex ? `#${start_hex}` : null;
    this.endColor = end_hex ? `#${end_hex}` : null;


    this.key = v4();
    this.isSelected = false;
    this.mainStore = mainStore;
    this.isSelected = isSelected;
    this.amount = 20;

    this.amountSelector2 = new SimpleSelector(
      _.times(301, (n) => `${n} ${unit}`),
      `20 ${unit}`
    );

    this.amountSelector = new Selector(
      mainStore,
      `20${unit}`,
      _.times(100, (n) => `${n + 1}${unit}`),
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

  @computed get gradientColors() {

    if (this.startColor && this.endColor) {
      return [this.startColor, this.endColor];
    }

    return [this.color, this.color];
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
    this.parent = parent;
    this.colors = [ ];
  }

  @action setColors(data, unit) {
    // data[0].colors[1].start_hex = 'ff0000';
    // data[0].colors[1].end_hex = '0000ff';
    this.colors = data.map(({colors}) => colors.map(d => new ColorField(d, unit, this.parent)));
  }

}


class AddServiceStore {

  @observable serviceSelector = new Selector(
    this,
    'Service',
    [ 'Single Process Color',
      'Dual Process Color',
      'Highlights',
      'Lowlights',
      'Straightening'
    ],
    false
  );

  @observable brandSelector = new Selector(
    this,
    'Brand',
    _.times(5, (num) => 'Brand ' + num),
    false
  );


  @observable colorNameSelector = new Selector(
    this,
    'Color name',
    _.times(5, (num) => 'Color name ' + num),
    false
  );

  @observable colorGrid;
  @observable isLoading;

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

  async loadBrand() {
    let serviceID = this.serviceSelector.selectedData.id;

    this.brandSelector.isLoading = true;
    try {
      let res = await ServiceBackend.getBrands(serviceID);
      this.brandSelector.setData(res);
    } catch (err) {
      this.brandSelector.closeAfterError();
    }
  }

  async loadLines() {
    let brandID = this.brandSelector.selectedData.id;
    this.colorNameSelector.isLoading = true;
    try {
      let res = await ServiceBackend.getLines(brandID);
      this.colorNameSelector.setData(res);
    } catch (err) {
      this.colorNameSelector.closeAfterError();
    }
  }

  async loadService() {
    this.serviceSelector.isLoading = true;
    try {
      let res = await ServiceBackend.getServices();
      this.serviceSelector.setData(res);
    } catch (err) {
      this.serviceSelector.closeAfterError();
    }
  }

  async loadColors() {
    let lineId = this.colorNameSelector.selectedData.id;

    let unit = this.colorNameSelector.selectedData.unit;
    let res = await ServiceBackend.getColors(lineId);
    this.colorGrid.setColors(res, unit);


    this.vlWeightSelector = new SimpleSelector(
      _.times(301, (n) => `${n} ${unit}`),
      '30 ${unit}'
    );



    return res;
  }

  reset() {
    this.isLoading = false;

    this.serviceSelector = new Selector(
      this,
      [],
      'Service',
      true
    );

    this.loadService();

    this.brandSelector = new Selector(
      this,
      [],
      'Brand',
      false
    );


    this.colorNameSelector = new Selector(
      this,
      [],
      'Color name',
      false
    );
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

  @computed get canGoNext() {
    if (this.colorNameSelector.hasValue ||
      this.serviceSelector.selectedData != null &&
      this.serviceSelector.selectedData.brandCount == 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  @computed get nextOpacity() {
    if (this.canGoNext) return 1.0;
    return 0.5;
  }

  @observable selector = this.serviceSelector;

  @observable pageThreeSelector;

  @action openSelector(sel) {
    this.selector = sel;

    for (let s of [this.serviceSelector, this.brandSelector, this.colorNameSelector]) {
      if (s != sel) {
        s.isOpen = false;
      } else {
        s.isOpen = true;

        if (s.isLoaded && s.value == s.title) {
          s.setValue(s.data[~~(s.data.length / 2)].name);
        }
      }
    }

    this.selector.isOpen = true;


    if (sel == this.serviceSelector && this.serviceSelector.shouldLoad) {
      this.loadService();
    }

    if (sel == this.brandSelector && this.brandSelector.shouldLoad) {
      this.loadBrand();
    }


    if (sel == this.colorNameSelector && this.colorNameSelector.shouldLoad) {
      this.loadLines();
    }

    if (sel == this.serviceSelector) {
      this.brandSelector.isEnabled = true;
    }

    if (sel == this.brandSelector) {
      this.colorNameSelector.isEnabled = true;
    }
  }


  @action openSelectorPageThree(sel) {
    this.pageThreeSelector = sel;
    this.pageThreeSelector.isOpen = true;
  }

  @action cancelSelector() {
    this.selector.isOpen = false;
    this.selector.value = this.selector.oldValue;
  }

  @action selectorValueChanged(selector) {

    if (selector == this.serviceSelector) {
      let data = this.serviceSelector.selectedData;
      console.log('selectedData', data);

      this.brandSelector.reset();
      this.colorNameSelector.reset();

      if (data.brandCount == 0) {
        this.brandSelector.hide();
        this.colorNameSelector.hide();
      } else {
        this.brandSelector.show();
        this.colorNameSelector.hide();
      }
    } else if (selector == this.brandSelector) {
      this.colorNameSelector.show();
    }
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
