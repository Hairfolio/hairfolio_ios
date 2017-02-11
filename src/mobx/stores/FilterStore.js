import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';

import {_, v4} from 'hairfolio/src/helpers';

import Picture from 'stores/Picture.js';

let ImageFilter = NativeModules.ImageFilter;

let newFilters;

// for performance issues in the simulator use less filters
if (process.env.NODE_ENV == 'production') {

  newFilters = [

    {
      name: 'None',
      params: {

      }
    },

    {
      name: 'CIColorMonochrome',
      params: {
        inputColor: {
          red: 0.740458,
          green: 0.256214,
          blue: 0.528626,
          alpha: 0.900574
        },
        inputIntensity: 0.1811512
      }
    },

    {
      name: 'CINoiseReduction',
      params: {
        inputNoiseLevel: 0.03967269,
        inputSharpness: 1.665914
      }
    },

    {
      name: 'CIColorControls',
      params: {
        inputSaturation: 1.788939,
        inputBrightness: -0.003386005,
        inputContrast: 0.9991535
      }
    },

    {
      name: 'CIColorControls',
      params: {
        inputSaturation: 1.53386,
        inputBrightness: 0.53386,
        inputContrast: 2.093256
      }
    },

    {
      name: 'CIExposureAdjust',
      params: {
        inputEV: 1.365688
      }
    },

    {
      name: 'CIGammaAdjust',
      params: {
        inputPower: 1.291196
      }
    },


    {
      name: 'CIPhotoEffectInstant',
      params: {
      }
    },

    {
      name: 'CIPhotoEffectFade',
      params: {
      }
    },

    {
      name: 'CIPhotoEffectProcess',
      params: {
      }
    },

    {
      name: 'CIPhotoEffectTransfer',
      params: {
      }
    },

    {
      name: 'CISepiaTone',
      params: {
        inputIntensity: 0.1811512
      }
    },

    {
      name: 'CIVignette',
      params: {
        inputIntensity: 0.1811512,
        inputRadius: 0
      }
    },


  ]

} else {

  newFilters = [

    {
      name: 'None',
      params: {

      }
    },

    {
      name: 'CIColorMonochrome',
      params: {
        inputColor: {
          red: 0.740458,
          green: 0.256214,
          blue: 0.528626,
          alpha: 0.900574
        },
        inputIntensity: 0.1811512
      }
    },

    {
      name: 'CINoiseReduction',
      params: {
        inputNoiseLevel: 0.03967269,
        inputSharpness: 1.665914
      }
    },
  ]
}

class FilterImage {

  @observable source;

  constructor(parent, originalSource, {name, params}) {
    this.parent = parent;
    this.originalSource = originalSource;
    this.filterName = name;
    this.isLoading = true;
    this.key = v4();

    if (this.filterName == 'None') {
      this.source = originalSource;

    } else {

      let uri = originalSource.uri;

      ImageFilter.newFilterImage(
        uri,
        this.filterName,
        params,
        (res) => {
          this.source = {uri: 'data:image/jpeg;base64,' + res};
        }
      );
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

    _.each(newFilters, (filterObj) => {
      this.filteredImages.push(
        new FilterImage(this, image.originalSource, filterObj)
      );
    });
  }
};
