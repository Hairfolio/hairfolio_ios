import ServiceBackend from '../../../backend/ServiceBackend';
import { v4, _, showLog, observer, observable, autobind} from '../../../helpers';

// @observer
// @autobind
export default class HashTag {
  @observable x;
  @observable y;
  @observable key;
  @observable abbrev;
  @observable hashtag;
  @observable type;
  @observable _destroy;
  
  constructor(x, y, hashtag) {

    this.x = x;
    this.y = y;
    this.key = v4();
    this.abbrev = 'H';
    this.hashtag = hashtag.replace('#', '');
    this.type = 'hashtag';
    this._destroy = false;
    showLog("HashTag ==>" + JSON.stringify(hashtag))
  }

  async toJSON(upload = true) {

    let tagId;

    if (upload) {
      let tagName = this.hashtag.replace('#', '');
      if(tagName !== "" || tagName.length >0){
        let res = await ServiceBackend.get(`tags/exact?q=${tagName}`);
  
        if (res == null) {
          let tag = (await ServiceBackend.post('tags', { tag: { name: tagName } })).tag;
          tagId = tag.id;
        } else {
          if(res.tag)
          {
             tagId = res.tag.id;
          }
          else
          {
            let tag = (await ServiceBackend.post('tags', { tag: { name: tagName } })).tag;
             tagId = tag.id;
          }
         
        }
      }

    } else {
      tagId = this.tagId;
    }

    return _.pickBy({
      position_left: Math.floor(this.x),
      position_top: Math.floor(this.y),
      tag_id: tagId,
      id: this.id,
      _destroy: this._destroy
    });
  }
}


