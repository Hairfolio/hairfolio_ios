import { observable, computed, action } from 'mobx';
import { ImageEditor, CameraRoll, NativeModules } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'react-native-fetch-blob';
import { _, jpg, v4 } from 'Hairfolio/src/helpers';
import LinkTag from './tags/LinkTag';
import HashTag from './tags/HashTag';
import ServiceTag from './tags/ServiceTag';
import Service from '../../services/index';
import EnvironmentStore from './EnvironmentStore';

let PhotoAlbum = NativeModules.PhotoAlbum;

class Picture {

  @observable parent;
  @observable tags = [];
  @observable source;
  @observable videoUrl;

  // for video
  @observable isPlaying = false;
  @observable isPaused = false;

  constructor(orignalSource, source, parent) {
    this.source = source;
    this.originalSource = source;
    this.key = v4();
    this.parent = parent;
  }

  async resizeImage(uri) {
    return ImageResizer.createResizedImage(uri, 2 * 250, 2 * 250, 'JPEG', 90, 0);
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

    if (uri && uri.indexOf('cloudinary') > -1) {
      let splitUrl = uri.split('upload');
      let newUrl = `${splitUrl[0]}upload/w_${width}${splitUrl[1]}`;
      return {uri: newUrl};
    }

    return this.source;
  }

  async getVideoPath(identifier) {

    return new Promise((resolve, rej) => {
      PhotoAlbum.getVideoPath2(identifier, (data) => {
        resolve(data);
      });
    });

  }

  async uploadVideo() {
    let uri = this.videoUrl;

    if (this.videoUrl.startsWith('file')) {
      uri = uri.substr(7);
    }


    let formdata = new FormData();
    formdata.append('file', {
      type: 'video/mp4',
      uri,
      name: 'upload.mp4'
    });

    let preset = EnvironmentStore.environment.cloud_preset;
    let cloudName = EnvironmentStore.environment.cloud_name;

    // load pictures from library
    if (this.identifier) {
      let path = await this.getVideoPath(this.identifier);
      uri = path[0].uri;
    }


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
    // TODO just for testing whether this is the course
    const uri = await ImageResizer.createResizedImage(this.source.uri, 1024, 1024, 'JPEG', 100, 0);

    let formdata = new FormData();
    formdata.append('file', {
      type: 'image/jpeg',
      uri,
      name: 'upload.jpg'
    });

    let preset = EnvironmentStore.environment.cloud_preset;
    let cloudName = EnvironmentStore.environment.cloud_name;

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


  async toJSON(upload = true, obj = {}) {

    let ret = {};

    let json, formdata;


    if (this.isVideo) {

      if (upload) {
        let videoJSON = await this.uploadVideo();
        ret.video_url = videoJSON.secure_url;
      } else {
        ret.video_url = this.videoUrl;
      }
    }

    if (upload) {
      let pictureJSON = await this.uploadPicture();
      ret.asset_url = pictureJSON.url;
    } else {
      ret.asset_url = this.source.uri;
    }

    window.tag = this.tags;

    // if editing remove invalid tags first and generate again
    if (!upload) {
      // remove negative tags for now
      this.tags = this.tags.filter(t => t.x >= 0);


      let oldIndex = 0;

      let index = 0;

      for (let t of this.tags) {
        if (t.id == obj.id) {
          oldIndex = index;
        }
        index++;
      }

      let oldService = this.tags[oldIndex];

      window.lastData2 = obj;

      this.tags[oldIndex] = new ServiceTag(oldService.x, oldService.x, obj);
    }

    for (let tag of this.tags) {

      if (tag.type == 'service') {

        for (let color of tag.colors) {

          let tagName;

          if (!upload) {
            tagName = color.color.code;
          } else {
            tagName = color.name.toLowerCase();
          }

          tagName = tagName.replace(/\W/g, '_').toLowerCase();

          let numberIndex = 0;
          while (numberIndex < tagName.length && /^\d$/.test(tagName[numberIndex])) {
            numberIndex++;
          }

          tagName = tagName.slice(0, numberIndex) + '_' + tagName.slice(numberIndex);

          this.tags.push(new HashTag(-100, -100,  '#' + tagName));
        }


        if (tag.lineName) {
          let tagName = tag.lineName.replace(/\W/g, '_').toLowerCase();
          this.tags.push(new HashTag(-100, -100,  '#' + tagName));
        }

        if (tag.brandName) {
          let tagName = tag.brandName.replace(/\W/g, '_').toLowerCase();
          this.tags.push(new HashTag(-100, -100,  '#' + tagName));
        }

        if (tag.serviceName) {
          let tagName = tag.serviceName.replace(/\W/g, '_').toLowerCase();
          this.tags.push(new HashTag(-100, -100, '#' + tagName));
        }

      }
    }

    let labels_attributes = await Promise.all(
      this.tags.map(tag => {
        return tag.toJSON();
      })
    );

    window.tags = labels_attributes;

    ret.labels_attributes = labels_attributes;

    return ret;
  }

  @computed get isVideo() {
    return this.videoUrl != null;
  }

  @computed get videoThumbnail() {
    if (this.videoUrl == null) {
      return '';
    }
    return jpg(this.videoUrl);
  }

  @computed get selected() {
    return this.parent.selectedPicture == this;
  }

  @action select() {
    this.parent.selectedPicture = this;
  }

  @action addServiceTag(x, y, data) {

    window.lastData = data;

    this.tags.push(new ServiceTag(x, y, data));
  }

  @action addLinkTag(x, y, data) {
    this.tags.push(new LinkTag(x, y, data));
  }

  @action addHashTag(x, y, hashtag) {
    this.tags.push(new HashTag(x, y, hashtag));
  }
}

export default Picture;
