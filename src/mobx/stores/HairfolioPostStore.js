import {observable, computed, action} from 'mobx';

import ServiceBackend from 'backend/ServiceBackend.js'

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import PostListStore from 'stores/PostListStore'

class HairfolioPostStore extends PostListStore  {
  @observable title = 'Inspiration'

  async backendCall(id) {
    return await ServiceBackend.get(`hairfolios/${id}/posts`);

  }
}

const store = new HairfolioPostStore();

export default store;
