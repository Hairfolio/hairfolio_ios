import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'hairfolio/src/helpers';

import LinkTag from 'stores/tags/LinkTag.js'
import HashTag from 'stores/tags/HashTag.js'
import ServiceTag from 'stores/tags/ServiceTag.js'


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

  toJSON() {
    return {
      url: 'http://www.example.com',
      tags: this.tags.map(e => e.toJSON())
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
