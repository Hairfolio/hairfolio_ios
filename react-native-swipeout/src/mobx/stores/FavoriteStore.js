import ServiceBackend from '../../backend/ServiceBackend';
import { PostGridStore } from './PostStore';
import UserStore from './UserStore';

class FavoriteStore extends PostGridStore {
  async getPosts(page, id = UserStore.user.id) {
    // return (await ServiceBackend.get(`posts?favorites=true&page=${page}`));
    // this.userId = UserStore.user.id; 
    return await ServiceBackend.get(`posts?favorites=true&user_id=${id}&page=${page}`);
  }
}

const store = new FavoriteStore();

export default store;
