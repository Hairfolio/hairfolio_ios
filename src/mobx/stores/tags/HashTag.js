import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'hairfolio/src/helpers';
import ServiceBackend from 'backend/ServiceBackend.js'

export default class HashTag {
  constructor(x, y, hashtag) {
    this.x = x;
    this.y = y;
    this.key = v4();
    this.abbrev = 'H';
    this.hashtag = hashtag;
    this.type = 'hashtag';
  }

  async toJSON() {
    let tagName = this.hashtag.substr(1);

    let res = await ServiceBackend.get(`tags/exact?q=${tagName}`);
    let tagId;

    if (res == null) {
      let tag = (await ServiceBackend.post('tags', {tag: {name: tagName}})).tag;
      tagId = tag.id;
    } else {
      tagId = res.tag.id;
    }

    return _.pickBy({
      position_left: Math.floor(this.x),
      position_top: Math.floor(this.y),
      tag_id: tagId
    });
  }
}


