import { NativeModules } from 'react-native';
import ServiceBackend from '../../backend/ServiceBackend';
import PostStore from './PostStore';
import { PER_PAGE_FOR_FEED } from '../../constants';

let PhotoAlbum = NativeModules.PhotoAlbum;



class FeedStore extends PostStore {
  async getPosts(pageNumber) {
    return ServiceBackend.get(`posts?page=${pageNumber}&per_page=${PER_PAGE_FOR_FEED}`);
  }

}

const store = new FeedStore();

export default store;

