import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'hairfolio/src/helpers';

export default class LinkTag {
  constructor(x, y, data) {
    let {linkUrl, name, hashtag, imageUrl, url} = data;
    this.x = x;
    this.y = y;
    this.key = v4();
    this.abbrev = 'L';
    this.type = 'link';

    this.linkUrl = linkUrl || url;
    this.imageUrl = imageUrl;
    this.name = name;
    this.hashtag = hashtag ? hashtag.name : hashtag;
    console.log('linkUrl', this.linkUrl);
  }

  toJSON() {
    return _.pickBy({
      type: this.type,
      url: this.linkUrl,
      name: this.name,
      hashtag: this.hashtag,
      left: this.x,
      top: this.y
    });
  }
}
