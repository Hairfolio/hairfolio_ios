import {observable, computed, action} from 'mobx';

import ServiceBackend from '../../backend/ServiceBackend';

import {_, moment, React, Text} from 'Hairfolio/src/helpers';

import {PostGridStore} from './PostStore';

class HairfolioPostStore extends PostGridStore {
  @observable title = 'Inspiration'

  async getPosts(page) {
    let hairfolio = this.initData;
    return await ServiceBackend.get(`folios/${hairfolio.id}/posts?page=${page}`);
  }
}

const store = new HairfolioPostStore();

export default store;
