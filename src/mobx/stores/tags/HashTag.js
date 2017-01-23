import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'hairfolio/src/helpers';
import ServiceBackend from 'backend/ServiceBackend.js'

export default class HashTag {
  constructor(x, y, hashtag) {
    this.x = x;
    this.y = y;
    this.key = v4();
    this.abbrev = 'H';
    this.hashtag = hashtag.replace('#', '');
    this.type = 'hashtag';
  }

  async toJSON(upload = true) {
    let tagId;

    if (upload) {
      let tagName = this.hashtag.replace('#', '');

      let res = await ServiceBackend.get(`tags/exact?q=${tagName}`);

      if (res == null) {
        let tag = (await ServiceBackend.post('tags', {tag: {name: tagName}})).tag;
        tagId = tag.id;
      } else {
        tagId = res.tag.id;
      }
    } else {
      tagId = this.tagId;
    }

    return _.pickBy({
      position_left: Math.floor(this.x),
      position_top: Math.floor(this.y),
      tag_id: tagId
    });
  }
}


