import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'Hairfolio/src/helpers';

import LinkTag from './tags/LinkTag';
import HashTag from './tags/HashTag';
import ServiceTag from './tags/ServiceTag';
import {ImageEditor} from 'react-native';
import EnvironmentStore from './EnvironmentStore';
import ImageResizer from 'react-native-image-resizer';

export default class Environment {

  async toJSON() {
    let uri = await this.resizeImage(this.source.uri);

    var formdata = new FormData();
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
    this.tags.push(new ServiceTag(x, y, data));
  }

  @action addLinkTag(x, y, data) {
    this.tags.push(new LinkTag(x, y, data));
  }

  @action addHashTag(x, y, hashtag) {
    this.tags.push(new HashTag(x, y, hashtag));
  }
}
