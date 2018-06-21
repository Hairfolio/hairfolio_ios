import Backend from './Backend';

const BASE_URL = 'http://api.hairfolio.tech/';

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
    // return (await this.get(`brands?serviceid=${serviceId}`)).brands;
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

  async sendPostMessage(userId, user, post) {
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

  async addPostToBlackBook(user, post) {
    let postIds = user.contact.posts.map(e => e.id);
    let postData = {
      contact: {
        post_ids: postIds.concat([post.id])
      }
    };
    await this.put(`contacts/${user.contact.id}`, postData);

  }

  async getEnvironment() {
    /* return this.get('/sessions/environment'); */
    return this.get('sessions/environment');
  }
}

export default new ServiceBackend();
