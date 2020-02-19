import { v4, _ } from 'Hairfolio/src/helpers';
import { action, observable } from 'mobx';
import { NativeModules } from 'react-native';
import Picture from './Picture';
import { showLog } from '../../helpers';
import fecthBlob from "react-native-fetch-blob";


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

    {
      name: 'CISharpenLuminance',
      params: {
        inputSharpness: 1.623025,
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
    {
      name: 'CISharpenLuminance',
      params: {
        inputSharpness: 1.623025,
      }
    },
  ]
}

newFilters = newFilters.map((e, index) => { return { ...e, displayName: index + 1 } });

class FilterImage {

  @observable source;

  constructor(parent, originalSource, { name, displayName, params }) {
    this.parent = parent;
    this.originalSource = originalSource;
    this.filterName = name;
    this.displayName = displayName;
    this.isLoading = true;
    this.key = v4();
  
    if (this.filterName == 'None') {
      this.source = originalSource;
    } else {
      this.getFilters(originalSource, params);
    }
  }

  async getFilters(originalSource, params) {
    let uri = originalSource.uri;
    showLog("res ==> " + JSON.stringify(originalSource))

      if (uri.includes("https")) {
        let url = uri;
        uri = await this.getBase64FromUrl(uri);
        var ext = await this.getImageTypeIOS(url); 
        ext = "." + ext;
        // let tempUri =   {
        //   "uri": uri + ext
        // }
        let itemtocheck = uri.toLowerCase();
        if (itemtocheck.includes(".jpg") || itemtocheck.includes(".jpeg") || itemtocheck.includes(".png")) {
    } else {
          // uri = uri + ext
        }
        // showLog("RES GET FILTERS ==> " + JSON.stringify(tempUri))
      }
      showLog("URI ==> " + uri)
      showLog("filterName ==> " + JSON.stringify(this.filterName))

      showLog("params ==> " + JSON.stringify(params))



      ImageFilter.newFilterImage(
        uri,
        this.filterName,
        params,
        (res) => {
          showLog("res ==> " + JSON.stringify(res))
          this.source = { uri: 'data:image/jpeg;base64,' + res };
        }
      );
      
  }

  async getBase64FromUrl(url) {
    const { config, fs } = fecthBlob;
    let imagePath = null;
    let PictureDir = fs.dirs.CacheDir;
    var date = new Date();
    var ext = this.getImageTypeIOS(url);
    ext = "." + ext;
    let options = {
      fileCache: true,
      path:
        PictureDir +
        "/image_" +
        Math.floor(date.getTime() + date.getSeconds() / 2) +
        ext,
      description: "Image"
    };   
   
    await config(options)
      .fetch("GET", url)
      .then(async res => {
        console.log("CONFIG RES ==> " + JSON.stringify(res))

        console.log("CONFIG RES AA ==> " + JSON.stringify(res.path()))

        return imagePath = res.path(); //res.path()
        //  res.readFile("base64");
      })
      // .then(base64Data => {
      //   // here's base64 encoded image
      //   // console.log("base64Data ==> " + base64Data);
      //  // imagePath = base64Data;
      //   // remove the file from storage
      //   return fs.unlink(imagePath);
      // })
      .catch(err => {
        console.log("Error downloding image" + err);
      });

    return await imagePath;
  }

  getImageTypeIOS(item) {
    //  alert(JSON.stringify(item))
    if (item) {
      var temp = item.split(".");
      let newChar = temp[temp.length - 1];
      return newChar;
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
      // new FilterImage(this, image.originalSource, filterObj)
     
        this.filteredImages.push(
          new FilterImage(this,image.source, filterObj)
        );
     
    });
  }
};
