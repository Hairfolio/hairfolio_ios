import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'hairfolio/src/helpers';

export default class LinkTag {
  constructor(x, y, data) {
    let {linkUrl, name, hashtag, imageUrl, url} = data;

    if (!data.hashtag && data.tag) {
      hashtag = data.tag;
    }


    this.x = x;
    this.y = y;
    this.key = v4();
    this.abbrev = 'L';
    this.type = 'link';

    this.linkUrl = linkUrl || url;
    this.imageUrl = imageUrl;
    this.name = name;
    this.hashtag = hashtag ? hashtag.name : hashtag;
    this.hashtag_id = hashtag ? hashtag.id : null;


    console.log('linkUrl', this.linkUrl);
  }

  async toJSON(upload) {

    return _.pickBy({
      // type: this.type,
      url: this.linkUrl,
      name: this.name,
      tag_id: this.hashtag_id,
      position_left: Math.floor(this.x),
      position_top: Math.floor(this.y)
    });
  }
}
