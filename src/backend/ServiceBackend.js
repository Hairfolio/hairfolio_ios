import Backend from './Backend';
const BASE_URL = 'http://api.hairfolio.tech/';

import CreatePostStore from '../mobx/stores/CreatePostStore';
import FeedStore from '../mobx/stores/FeedStore';
import SearchStore from '../mobx/stores/SearchStore';
import UserStore from '../mobx/stores/UserStore';
import ShareStore from '../mobx/stores/ShareStore';

import * as routes from 'Hairfolio/src/routes';

let myfetch = function(input, opts) {
  return new Promise((resolve, reject) => {
    setTimeout(reject, opts.timeout);
    fetch(input, opts).then(resolve, reject);
  });
}

class ServiceBackend extends Backend {
  constructor() {
    super();
  }

  async getServices() {
    return (await this.get('services')).services;
  }

  async getBrands(serviceId) {
    return (await this.get(`brands?service_id=${serviceId}`)).brands;
  }

  async getLines(brandId) {
    return (await this.get(`lines?brand_id=${brandId}`)).lines;
  }

  async getColors(lineId) {
    return (await this.get(`harmonies?line_id=${lineId}`)).harmonies;
  }

  async getHashTags(name) {
    return (await this.get(`tags?q=${name}`)).tags;
  }

  async getCatalogItems(name) {
    return (await this.get(`products?q=${name}`)).products;
  }

  async pinHairfolio(hairfolio, post) {

    let res = await this.put('folios/' + hairfolio.id, {folio: {name: hairfolio.name}});

    let pinRes = await this.post(`folios/${hairfolio.id}/add_post`, {post_id: post.id});

  }

  async sendPostMessage(user, post) {
    let userId = UserStore.user.id;
    let ids = [userId, user.id];

    let postData = {
      conversation: {
        sender_id: userId,
        recipient_ids: ids
      }
    };


    let conversation = (await this.post('conversations', postData)).conversation;

    postData = {
      message: {
        body: '',
        post_id: post.id
      }
    };

    await this.post(`conversations/${conversation.id}/messages`, postData);

  }

  async addPostToBlackBook(contact, post) {

    let postIds = contact.posts.map(e => e.id);
    postIds.push(post.id);

    let postData = {
      contact: {
        post_ids: postIds
      }
    };

    await this.put(`contacts/${contact.user.id}`, postData);

  }

  async postPost() {

    try {
      CreatePostStore.isLoading = true;

      CreatePostStore.loadingText = 'Uploading pictures ..';
      let data = await CreatePostStore.gallery.toJSON();

      window.postData = data;


      CreatePostStore.loadingText = 'Publishing the post';

      ShareStore.share(data.post.photos_attributes[0].asset_url);

      let res = await this.post('posts', data);

      window.postRes = res;

      if (res.status != 201) {
        alert('A backend error occured: ' + JSON.stringify(res));
        alert('The data was : ' + JSON.stringify(data));
      } else {


        for (let hairfolio of  ShareStore.selectedHairfolios) {
          this.pinHairfolio(hairfolio, res.post);
        }

        // console.log(ShareStore.selectedUsers);
        for (let user of ShareStore.selectedUsers) {
          this.sendPostMessage(user.user, res.post);
        }

        for (let contact of ShareStore.contacts) {
          this.addPostToBlackBook(contact, res.post);
        }

        FeedStore.load();
        // SearchStore.refresh();

        routes.appStack.scene().goToFeed();
        window.navigators[1].jumpTo(routes.createPost)
        window.navigators[0].jumpTo(routes.appStack);
        setTimeout(() => CreatePostStore.reset(), 1000);
      }

      CreatePostStore.isLoading = false
    } catch(err) {
      CreatePostStore.isLoading = false;
      alert('An error occured ' + err.toString());
    }
  }
}


export default new ServiceBackend();
