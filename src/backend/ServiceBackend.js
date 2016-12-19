import Backend from './Backend.js'
const BASE_URL = 'http://api.hairfolio.tech/';

import CreatePostStore from 'stores/CreatePostStore.js'
import FeedStore from 'stores/FeedStore.js'
import SearchStore from 'stores/SearchStore.js'

import * as routes from 'hairfolio/src/routes.js'
import ShareStore from 'stores/ShareStore.js'

let myfetch = function(input, opts) {
  return new Promise((resolve, reject) => {
    setTimeout(reject, opts.timeout);
    fetch(input, opts).then(resolve, reject);
  });
}


class ServiceBackend extends Backend {
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
    return await this.get(`catalog_items?product_name=${name}`);
  }

  async pinHairfolio(hairfolio, post) {
    console.log('pin hairfolio', hairfolio.id, post.id);

    let res = await this.put('folios/' + hairfolio.id, {folio: {name: hairfolio.name}});

    console.log('folios', res);

    let postIds = res.folio.posts.map(e => e.id);
    postIds.push(post.id);

    console.log('postIds', post.ids);

    let pinRes = await this.put(`folios/${hairfolio.id}`, {folio: {post_ids: postIds}});

    console.log('pinRes', pinRes);
  }

  async postPost() {

    try {
      CreatePostStore.isLoading = true;

      CreatePostStore.loadingText = 'Uploading pictures ..';
      let data = await CreatePostStore.gallery.toJSON();

      CreatePostStore.loadingText = 'Publishing the post';
      console.log('post data', data);
      let res = await this.post('posts', data);

      if (res.status != 201) {
        alert('An unknown error occured');
      } else {

        for (let hairfolio of  ShareStore.selectedHairfolios) {
          this.pinHairfolio(hairfolio, res.post);
        }

        // TODO send messages

        // TODO add to contacts

        console.log(ShareStore.selectedUsers);
        console.log(ShareStore.contacts);



        FeedStore.load();
        SearchStore.refresh();

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

const serviceBackend = new ServiceBackend()
export default serviceBackend
