import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'Hairfolio/src/helpers';

import LinkTag from 'stores/tags/LinkTag.js'
import HashTag from 'stores/tags/HashTag.js'
import ServiceTag from 'stores/tags/ServiceTag.js'
import {ImageEditor} from 'react-native';
import Service from 'Hairfolio/src/services/index.js'
import ImageResizer from 'react-native-image-resizer';

export default class Environment {

  //   return ImageResizer.createResizedImage(uri, 250, 250, 'JPEG', 90, 0, null);
  // }


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
    this.tags.push(new ServiceTag(x, y, data));
  }

  @action addLinkTag(x, y, data) {
    this.tags.push(new LinkTag(x, y, data));
  }

  @action addHashTag(x, y, hashtag) {
    this.tags.push(new HashTag(x, y, hashtag));
  }
}
