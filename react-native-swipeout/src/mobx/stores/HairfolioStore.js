import { computed, observable } from 'mobx';
import { NativeModules } from 'react-native';
import ServiceBackend from '../../backend/ServiceBackend';
import { showLog } from '../../helpers';
import Picture from './Picture';
import UserStore from './UserStore';
import { PER_PAGE } from '../../constants';

let PhotoAlbum = NativeModules.PhotoAlbum;


class Hairfolio {

  @observable name;
  @observable numberOfPosts;
  @observable picture;
  @observable allImages;
  @observable page = 1;

  constructor(obj) {
    this.name = (obj.name == 'Inspiration') ? 'Saved Inspo' : obj.name;
    this.id = obj.id;
    this.numberOfPosts = obj.posts_count ? obj.posts_count : '?';
    this.allImages = [];
    this.lastPost = obj.last_post;

    let picObj;

    if (this.lastPost) {
      picObj = { uri: this.lastPost.photos[0].asset_url };
      this.picture = new Picture(picObj, picObj, null);
    }

    this.loadApiForFolioPost(this.id)
    // this.callApiForFolioPost();
  }

  async loadApiForFolioPost(folioId = this.id) {
    this.allImages = [];
    this.page = 1;
    await this.loadNextForFolioPost(folioId);

  }

  async loadNextForFolioPost(id = this.id) {
    showLog("loadNext ==>" + this.page)
    if (this.page != null) {
      let res = await ServiceBackend.get(`folios/${id}/posts?page=${this.page}&limit=${PER_PAGE}`);
      if(res) {
        showLog("loadNextForFolioPost ==>" + JSON.stringify(res))

        let posts = (res.posts) ? res.posts : null;
        let meta = (res.meta) ? res.meta : null;

        if(meta && meta.next_page){
          this.page = meta.next_page
          showLog("this.page get FoliosPostDetails ==> " + this.page + " => "+ id)
        } else {
          this.page = null;
        }
        if (posts) {        
          // this.isLoadingNextPage = false;
          if(this.allImages && this.allImages.length > 0){
            for(let i = 0 ; i < posts.length ; i++)
            {
              this.allImages.push(posts[i]);
            }
          } else {
            this.allImages = res.posts;
          }          
        } else {
          // this.isLoadingNextPage = false;
          throw res.errors;
        }
      } else { 
        this.page = null;
        return this.allImages;
      }
    }
  }

  // async callApiForFolioPost(id = this.id) {
  //   this.page = 1;
  //   // for(var i = 0; i < this.page; i++) { 
  //     if(this.page != null ) {
  //       await this.getFoliosPostDetails(id).then((res) => {
  //       })
  //     // }
  //   }
  // }

  // async getFoliosPostDetails(id, page = 1) {
  //   // &limit=2
  //   showLog("this.page 111 ==> " + this.page + " => "+ id)
  //   return await ServiceBackend.get(`folios/${id}/posts?page=${page}&limit=2`).then(
  //     (res) => {
  //       if(res) {
  //         showLog("res all Images11 ==> " + JSON.stringify(this.allImages));
  //         if(this.allImages && this.allImages.length > 0){
  //           this.allImages.push(res.posts);
  //         } else {
  //           this.allImages = res.posts;
  //         }
  //         if(res.meta){
  //           this.page = res.meta.next_page
  //           showLog("this.page get FoliosPostDetails ==> " + this.page + " => "+ this.id)
  //         } else {
  //           this.page = null;
  //         }
  //         return this.allImages;
  //       } else { 
  //         this.page = null;
  //         return this.allImages;
  //       }
        
  //     },
  //     (err) => {
  //       this.allImages = [];
  //       this.page = null;
  //       showLog("error FOLIO==> " + JSON.stringify(err))
  //       return this.allImages;
  //     }
  //   )
  // }

  @computed get hasPicture() {
    return this.picture != null;
  }
}

export class HairfolioStore {
  @observable isLoading = false;
  @observable hairfolios = [];
  @observable isEditable;

  constructor() {
  }

  async addHairfolio(name) {
    if (name.length > 0) {
      let res = await ServiceBackend.post('folios', { folio: { name: name } });
      this.hairfolios.push(new Hairfolio(res.folio));
      this.textInput.clear();
    }
  }

  async delete(store) {
    this.hairfolios = this.hairfolios.filter(e => e.id != store.id);

    let results = await ServiceBackend.delete(`folios/${store.id}`);
  }

  async load(id) {
    this.isLoading = true;
    this.hairfolios = [];

    let results;

    let currentUserId = UserStore.user.id;

    if (!id || id == currentUserId) {
      results = await ServiceBackend.get('folios');
      this.isEditable = true;
    } else {
      this.isEditable = false;
      results = await ServiceBackend.get(`users/${id}/folios`);
    }

    let results_folios = results.folios;


    showLog("HairfolioStore ==>" + JSON.stringify(results_folios));

    if (results_folios) {
      // if (results.length == 0) {
      //   // add inspiration
      //   let res = await ServiceBackend.post('folios', { folio: { name: 'Inspiration' } });
      //   this.hairfolios.push(new Hairfolio(res.folio));
      // } else {
      //   this.hairfolios = results.map(e => new Hairfolio(e)).reverse();
      // }

      this.hairfolios = await results_folios.map(e => new Hairfolio(e)).reverse();
      // var temp = []
      // results_folios.map(async e => {
      //   let res = await ServiceBackend.get(`folios/${e.id}/posts?page=1`);
      //   e.allImages = res.posts;
      //   this.hairfolios.push(new Hairfolio(e));
      //   showLog("USER DETAILS FOLIO ==> " + JSON.stringify(this.hairfolios))
      // }).reverse();

      this.isLoading = false;
    } else {
      this.isLoading = false;
    }
  }

}

const store = new HairfolioStore();

export default store;
