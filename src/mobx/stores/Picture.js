import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'hairfolio/src/helpers';

import LinkTag from 'stores/tags/LinkTag.js'
import HashTag from 'stores/tags/HashTag.js'
import ServiceTag from 'stores/tags/ServiceTag.js'
import {ImageEditor} from 'react-native';
import Service from 'hairfolio/src/services/index.js'
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'react-native-fetch-blob'

export default class Picture {

  @observable parent;
  @observable tags = [];
  @observable source;
  @observable videoUrl;
  @observable isPlaying = false;

  constructor(orignalSource, source, parent) {
    this.source = source;
    this.originalSource = source;
    this.key = v4();
    this.parent = parent;
  }

  async resizeImage(uri) {
    return ImageResizer.createResizedImage(uri, 2 * 250, 2 * 250, 'JPEG', 90, 0, null);
  }

  async cropImage(uri) {
    return new Promise((resolve, reject) => {
      ImageEditor.cropImage(uri, {
        offset: {
          x: 0,
          y: 0
        },
        size: {
          width: 500,
          height: 500
        }
      }, resolve,  () => reject('resize failed'));
    });
  }

  getSource(width) {

    let uri = this.source.uri;

    if (this.isVideo) {
      console.log('msg video src', uri);
      uri = this.videoUrl.substr(0, this.videoUrl.lastIndexOf('.')) + '.jpg';
    }

    console.log('msg img src', uri);


    if (uri && uri.indexOf('cloudinary') > -1) {
      let splitUrl = uri.split('upload');
      let newUrl = `${splitUrl[0]}upload/w_${width}${splitUrl[1]}`;
      console.log('pic uri', newUrl);
      console.log('msg pic url', newUrl);
      return {uri: newUrl};
    }

    return this.source;
  }

  async uploadVideo() {
    let uri = this.videoUrl.substr(7);
    console.log('video', uri);

    let formdata = new FormData();
    formdata.append('file', {
      type: 'video/mp4',
      uri,
      name: 'upload.mp4'
    });

    let preset = Service.fetch.store.getState().environment.environment.get('cloud_preset');
    let cloudName = Service.fetch.store.getState().environment.environment.get('cloud_name');

    let res = await RNFetchBlob.fetch('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
      'Content-Type' : 'multipart/form-data',
    }, [
      //
      { name : 'file', filename : 'upload.mp4', type:'video/mp4', data: RNFetchBlob.wrap(uri)},
      // elements without property `filename` will be sent as plain text
      { name : 'upload_preset', data : preset},
    ]);

    return res.json();
  }

  async uploadPicture() {
    let uri = await this.resizeImage(this.source.uri);

    let formdata = new FormData();
    formdata.append('file', {
      type: 'image/jpeg',
      uri,
      name: 'upload.jpg'
    });

    let preset = Service.fetch.store.getState().environment.environment.get('cloud_preset');
    let cloudName = Service.fetch.store.getState().environment.environment.get('cloud_name');

    formdata.append('upload_preset', preset);
    let res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d'
        },
        body: formdata
      }
    );

    return res.json();
  }


  async toJSON() {

    let ret = {};

    let json, formdata;

    if (this.isVideo) {
      let videoJSON = await this.uploadVideo();
      console.log('videoJSON', videoJSON);
      ret.video_url = videoJSON.secure_url;
    }

    let pictureJSON = await this.uploadPicture();
    ret.asset_url =  pictureJSON.url;

    window.tag = this.tags;

    let labels_attributes = await Promise.all(
      this.tags.map(tag => {
        console.log('tagjson', tag);
        return tag.toJSON();
      })
    );

    window.tags = labels_attributes;

    ret.labels_attributes = labels_attributes;

    // console.log('label_attributes', labels_attributes);

    return ret;
  }

  @computed get isVideo() {
    return this.videoUrl != null;
  }

  @computed get selected() {
    return this.parent.selectedPicture == this;
  }

  @action select() {
    this.parent.selectedPicture = this;
  }

  @action addServiceTag(x, y, data) {
    this.tags.push(new ServiceTag(x, y, data));
  }

  @action addLinkTag(x, y, data) {
    this.tags.push(new LinkTag(x, y, data));
  }

  @action addHashTag(x, y, hashtag) {
    this.tags.push(new HashTag(x, y, hashtag));
  }
}
