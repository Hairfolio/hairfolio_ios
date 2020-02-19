import { observable } from 'mobx';
import ServiceBackend from '../../backend/ServiceBackend';
import { PostGridStore } from './PostStore';


class HairfolioPostStore extends PostGridStore {
  @observable title = 'Inspiration'

  async getPosts(page) {
    let hairfolio = this.initData;
    return await ServiceBackend.get(`folios/${hairfolio.id}/posts?page=${page}`);
  }
}

const store = new HairfolioPostStore();

export default store;
