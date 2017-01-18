import {observable, computed, action} from 'mobx';

import ServiceBackend from 'backend/ServiceBackend.js'

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import PostListStore from 'stores/PostListStore'

class HairfolioPostStore extends PostListStore  {
  @observable title = 'Inspiration'

  async backendCall(hairfolio) {
    return await ServiceBackend.get(`folios/${hairfolio.id}/posts`);
  }
}

const store = new HairfolioPostStore();

export default store;
