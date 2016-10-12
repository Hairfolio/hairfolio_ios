import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';

import {_, v4} from 'hairfolio/src/helpers';

import {Picture} from 'stores/CreatePostStore';

let ImageFilter = NativeModules.ImageFilter;

let filters;

// for performance issues in the simulator use less filters
if (process.env.NODE_ENV == 'production') {
  filters = [
    'None',
    'CILinearToSRGBToneCurve',
    'CISRGBToneCurveToLinear',
    'CIColorInvert',
    'CIColorMonochrome',
    'CIColorPosterize',
    'CIFalseColor',
    'CIPhotoEffectFade',
    'CIPhotoEffectInstant',
    'CIPhotoEffectMono',
    'CIPhotoEffectNoir',
    'CIPhotoEffectProcess',
    'CISepiaTone',
    'CIVignetteEffect',
    'CIUnsharpMask'
  ];
} else {
  filters = [
    'None',
    'CISRGBToneCurveToLinear',
    'CIColorInvert',
    'CISepiaTone',
  ];
}

class FilterImage {

  @observable source;

  constructor(parent, originalSource, filterName) {
    this.parent = parent;
    this.originalSource = originalSource;
    this.filterName = filterName;
    this.isLoading = true;
    this.key = v4();

    if (filterName == 'None') {
      this.source = originalSource;
    } else {
      ImageFilter.filterImage(originalSource.uri, filterName, (res) => {
        this.source = {uri: 'data:image/jpeg;base64,' + res};
      });
    }
  }

  @action select() {
    this.parent.select(this.source);
  }
}

export default class FilterStore {

  @observable mainPicture;
  @observable filteredImages;

  constructor(parent) {
    this.parent = parent;
    this.filteredImages = [];
  }

  reset() {
    this.mainPicture = null;
    this.filteredImages = [];
  }


  @action select(source) {
    this.mainPicture = new Picture(
      this.mainPicture.originalSource, source, this);
  }

  @action setMainImage(image) {
    this.mainPicture = image;

    _.each(filters, (filterName) => {
      this.filteredImages.push(
        new FilterImage(this, image.originalSource, filterName)
      );
    });

  }


};
