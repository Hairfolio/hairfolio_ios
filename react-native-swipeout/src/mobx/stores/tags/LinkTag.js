import { v4, _, observable } from '../../../helpers';

export default class LinkTag {
  @observable x;
  @observable y;
  @observable key;
  @observable abbrev;
  @observable type;
  @observable _destroy;
  @observable linkUrl;
  @observable imageUrl;
  @observable imageSource;
  @observable name;
  @observable hashtag;
  @observable hashtag_id;

  constructor(x, y, data) {
    let { linkUrl, name, hashtag, imageUrl, url } = data;

    if (!data.hashtag && data.tag) {
      hashtag = data.tag;
    }

    this.x = x;
    this.y = y;
    this.key = v4();
    this.abbrev = "L";
    this.type = "link";
    this._destroy = false;
    this.linkUrl = linkUrl || url;
    this.imageUrl = imageUrl;
    this.imageSource = require("img/post_link_tag.png");
    this.name = name;
    this.hashtag = hashtag ? hashtag.name : hashtag;
    this.hashtag_id = hashtag ? hashtag.id : null;
  }

  async toJSON(upload) {
    return _.pickBy({
      url: this.linkUrl,
      name: this.name,
      tag_id: this.hashtag_id,
      id: this.id,
      _destroy: this._destroy,
      position_left: Math.floor(this.x),
      position_top: Math.floor(this.y)
    });
  }
}
