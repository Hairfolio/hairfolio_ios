import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'hairfolio/src/helpers';

import LinkTag from 'stores/tags/LinkTag.js'
import HashTag from 'stores/tags/HashTag.js'
import ServiceTag from 'stores/tags/ServiceTag.js'
import {ImageEditor} from 'react-native';
import Service from 'hairfolio/src/services/index.js'
import ImageResizer from 'react-native-image-resizer';

export default class Picture {

  @observable parent;
  @observable tags = [];
  @observable source;

  constructor(orignalSource, source, parent) {
    this.source = source;
    this.originalSource = source;
    this.key = v4();
    this.parent = parent;
  }

  async resizeImage(uri) {
    return ImageResizer.createResizedImage(uri, 250, 250, 'JPEG', 90, 0, null);
  }

  getSource(width) {
    let uri = this.source.uri;

    if (uri && uri.indexOf('cloudinary') > -1) {
      let splitUrl = uri.split('upload');
      let newUrl = `${splitUrl[0]}upload/w_${width}${splitUrl[1]}`;
      console.log(newUrl);
      return {uri: newUrl};
    }

    return this.source;
  }


  async toJSON() {
    let uri = await this.resizeImage(this.source.uri);

    var formdata = new FormData();
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

    let json = await res.json();


    return {
      url: json.url,
      post_item_tags: this.tags.map(e => e.toJSON())
    };
  }

  @computed get selected() {
    return this.parent.selectedPicture == this;
  }

  @action select() {
    this.parent.selectedPicture = this;
  }

  @action addServiceTag(x, y, data) {
    console.log('service', data);
    this.tags.push(new ServiceTag(x, y, data));
  }

  @action addLinkTag(x, y, data) {
    this.tags.push(new LinkTag(x, y, data));
  }

  @action addHashTag(x, y, hashtag) {
    this.tags.push(new HashTag(x, y, hashtag));
  }
}
