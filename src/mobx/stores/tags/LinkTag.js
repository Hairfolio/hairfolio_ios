import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'hairfolio/src/helpers';

export default class LinkTag {
  constructor(x, y, {linkUrl, name, hashtag, imageUrl}) {
    this.x = x;
    this.y = y;
    this.key = v4();
    this.abbrev = 'L';

    this.linkUrl = linkUrl;
    this.imageUrl = imageUrl;
    this.name = name;
    this.hashtag = hashtag ? hashtag.name : hashtag;
  }

  toJSON() {
    return _.pickBy({
      type: 'link',
      linkUrl: this.linkUrl,
      name: this.name,
      hashtag: this.hashtag,
      imageUrl: this.imageUrl,
      left: this.x,
      top: this.y
    });
  }
}