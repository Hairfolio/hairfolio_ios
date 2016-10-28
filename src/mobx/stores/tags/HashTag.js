import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'hairfolio/src/helpers';

export default class HashTag {
  constructor(x, y, hashtag) {
    this.x = x;
    this.y = y;
    this.key = v4();
    this.abbrev = 'H';
    this.hashtag = hashtag;
  }

  toJSON() {
    return _.pickBy({
      type: 'hashtag',
      hashtag: this.hashtag,
      left: this.x,
      top: this.y
    });
  }
}


