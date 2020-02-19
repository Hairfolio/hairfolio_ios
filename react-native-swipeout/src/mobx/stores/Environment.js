import { action, computed } from 'mobx';
import { showLog } from '../../helpers';
import EnvironmentStore from './EnvironmentStore';
import HashTag from './tags/HashTag';
import LinkTag from './tags/LinkTag';
import ProductTag from './tags/ProductTag';
import ServiceTag from './tags/ServiceTag';
import { BASE_URL } from '../../constants';


export default class Environment {

  async toJSONOriginalCloudinary() {
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
    showLog("Environment cloudinary ==>" + JSON.stringify(json));


    return {
      url: json.url,
      post_item_tags: this.tags.map(e => e.toJSON())
    };
  }

  async toJSON() {
    let uri = await this.resizeImage(this.source.uri);

    var formdata = new FormData();
    var currentDate = (new Date).getTime()+'_';
    formdata.append('uploader[image_url]', {
      type: 'image/jpeg',
      uri,
      name: 'upload_'+currentDate+'.jpg'
    });

    let preset = EnvironmentStore.environment.cloud_preset;
    let cloudName = EnvironmentStore.environment.cloud_name;
    let url = BASE_URL+"file_upload";
    // formdata.append('upload_preset', preset);
    let res = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d'
        },
        body: formdata
      }
    );

    let json = await res.json();
    showLog("Environment cloudinary ==>" + JSON.stringify(json));


    return {
      url: json.image_url.url,
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
    this.editTags.push(new ServiceTag(x, y, data));
  }

  @action addLinkTag(x, y, data) {
    this.tags.push(new LinkTag(x, y, data));
    this.editTags.push(new LinkTag(x, y, data));
  }

  @action addHashTag(x, y, hashtag) {
    this.tags.push(new HashTag(x, y, hashtag));
    this.editTags.push(new HashTag(x, y, hashtag));
  }

  @action addProductTag(x, y, producttag) {
    this.tags.push(new ProductTag(x, y, producttag));
    this.editTags.push(new ProductTag(x, y, producttag));
  }
}
