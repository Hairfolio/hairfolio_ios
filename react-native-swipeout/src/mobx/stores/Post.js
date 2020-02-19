import { computed, moment, observable, v4, _ } from 'Hairfolio/src/helpers';
import { toJS } from 'mobx';
import ServiceBackend from '../../backend/ServiceBackend';
import { showLog, showAlert } from '../../helpers';
// import FavoriteStore from './FavoriteStore';
import Picture from './Picture';
import User from './User';

export default class Post {
  @observable description
  @observable pictures
  @observable products = [];
  @observable currentIndex = 0
  @observable key = v4()
  @observable creator
  @observable createdTime;
  @observable hasStarred;
  @observable starNumber;
  @observable numberOfComments;
  @observable showStar;
  @observable showSave;
  @observable isShopShow;
  @observable uniqueCode="";
  @observable isDeepLinking = false;
  @observable isDeleting= false;

  constructor() {
  }

  async init(data,uniqueCode="") {
    if (!data) {
      return;
    }
    data = toJS(data);

    this.isShopShow = true;
    this.id = data.id;
    this.description = data.description;
    this.pictures = [];
    this.products = data.products;
    this.starNumber = data.likes_count;
    this.numberOfComments = data.comments_count;
    this.photos = data.photos

    this.hasStarred = data.liked_by_me;
    this.uniqueCode = uniqueCode

    let user = new User();
    await user.init(data.user);
    this.creator = user;
    this.createdTime = moment(data.created_at);
    let count = 0


    for (let pic of data.photos) {
      if (pic.asset_url==undefined || pic.asset_url==null){
        pic.asset_url = '';
      }
      let picObj = { uri: pic.asset_url };
      let picture = new Picture(
        picObj,
        picObj,
        null
      );

      picture.id = pic.id;

      if (pic.video_url) {
        picture.videoUrl = pic.video_url;
      }

      for (let item of pic.labels) {

        if (item.formulas) {

          if (item.formulas.length > 0) {
            picture.addServiceTag(item.position_left, item.position_top, item.formulas[0]);
          } else if (item.url != null) {
            picture.addLinkTag(item.position_left, item.position_top, item);

          } else {
            // picture.addHashTag(item.position_left, item.position_top, '#redken');
            if (item.tag) {
              picture.addHashTag(item.position_left, item.position_top, item.tag.name);
            } else {

              if (item.product_id != null) {
                if (this.products.length > 0) {
                  let newObj = _.filter(this.products, { id: item.product_id })
                  // alert("POST ==> "+JSON.stringify(this.uniqueCode))
                  if(newObj && newObj[0]) {
                    let tempProd = {
                      "id": newObj[0].id,
                      "created_at": newObj[0].created_at,
                      "name": newObj[0].name,
                      "last_photo": newObj[0].cloudinary_url,
                      "price": newObj[0].price,
                      "final_price": newObj[0].final_price,
                      "discount_percentage": newObj[0].discount_percentage,
                      "cloudinary_url": newObj[0].cloudinary_url,
                      "product_image" : newObj[0].product_image,
                      "uniqueCode" : this.uniqueCode,
                      "product_thumb" : newObj[0].product_thumb,
                    };
                    picture.addProductTag(item.position_left, item.position_top, tempProd);
                  }
                }
              }
              else {
                let temp2 = {
                  "id": null,
                  "created_at": "null",
                  "name": "null",
                  "last_photo": "null",
                };
                picture.addHashTag(item.position_left, item.position_top, "");
              }
            }
          }

          if (item.tag) {
            if(picture.tags.length > 0)
            {
              picture.tags[picture.tags.length - 1].tagId = item.tag.id;
            }
            
          }

          if (item.id) {
            if(picture.tags.length > 0)
            {
              picture.tags[picture.tags.length - 1].id = item.id;
            }
            
          }

          // if (item.tag) {
          //   picture.tags[picture.tags.length - 1].tagId = item.tag.id;
          // }

          // if (item.id) {
          //   picture.tags[picture.tags.length - 1].id = item.id;
          // }
        }
      }
      showLog("init ==>" + JSON.stringify(picture))
      this.pictures.push(picture);
    }

    return this;
  }

  nextImage() {
    if (this.pictures.length < 2) return this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % this.pictures.length;
  }


  @computed get currentImage() {
    return this.pictures[this.currentIndex];
  }

  @computed get numberOfTags() {
    let counter = 0;

    for (let picture of this.pictures) {
      counter += picture.tags.length;
    }
    return counter;
  }

  @computed get topHashTag() {
    let help = this.hashTags;
    if (help.length > 0) {
      return '#' + help[0].hashtag;
    } else {
      return '';
    }
  }

  @computed get hashTags() {
    let hashTags = [];

    for (let pic of this.pictures) {
      for (let h of pic.tags) {
        if (h.hashtag) {
          hashTags.push(h);
        }
      }
    }
    return hashTags;
  }

  @computed get starImageSource() {
    if (this.hasStarred) {
      return require('img/feed_star_on.png');
    } else {
      return require('img/feed_star_off.png');
    }
  }

  @computed get starImageSourceWhite() {
    if (this.hasStarred) {
      return require('img/feed_white_star_on.png');
    } else {
      return require('img/feed_white_star_off.png');
    }
  }

  @computed get photoInfo() {
    return `${this.currentIndex + 1} of ${this.pictures.length}`;
  }

  getTimeDifference() {
    if(this.createdTime)
    {
      return this.createdTime.toNow(true);
    }
    else
    {
      return "";
    }
  }

  samplePost(postNumber = 0) {
    this.description = 'This is a test description that should go to at least two lines so we can test it properly.';
    this.pictures = [];

    this.starNumber = 428;
    this.numberOfComments = 52;
    this.hasStarred = false;

    let user = new User();
    user.sample();
    this.creator = user;
    this.createdTime = moment().subtract({ minutes: 2 });
  }

  async starPost() {
    this.showStar = true;
    let hasStarred = this.hasStarred;
    this.hasStarred = !this.hasStarred;

    setTimeout(() => {
      this.showStar = false;
    }, 1500);

    if (hasStarred) {
      this.starNumber--;
      this.hasStarred=false;
      let starResult = await ServiceBackend.delete(`posts/${this.id}/likes`);
      if(starResult){
        return starResult;
      }
    } else {
      this.starNumber++;
      this.hasStarred=true;
      let starResult = await ServiceBackend.post(`posts/${this.id}/likes`);
      if(starResult){
        return starResult;
      }
    }
    // FavoriteStore.load();
  }

  async deletePost() {
    this.isDeleting = true;
    let deletePostResult = await ServiceBackend.delete(`posts/${this.id}`);
    showLog("deletePostResult ==> " + JSON.stringify(deletePostResult));
    this.isDeleting = false;
    if(deletePostResult) {
      return deletePostResult;
    }
  }

  save() {
  }

  async savePost() {
    this.showSave = true;
    // get inspiration hairfolio
    let hairfolios = (await ServiceBackend.get('folios')).folios;
    let inspiration = hairfolios.filter(e => e.name == 'Inspiration');
    let inspirationId;

    if (inspiration.length == 0) {
      let res = await ServiceBackend.post('folios', { folio: { name: 'Inspiration' } });
      inspirationId = res.folio.id;
    } else {
      inspirationId = inspiration[0].id;
    }

    let pinRes = await ServiceBackend.post(`folios/ ${inspirationId}/add_post`, { post_id: this.id });
    this.showSave = false;
  }
}