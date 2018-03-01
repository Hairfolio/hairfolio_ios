import {observable, computed, action} from 'mobx';
import { EMPTY, READY, LOADING, LOADING_ERROR } from '../../constants';
import EnvironmentStore from './EnvironmentStore';

class OAtuhStore {
  @observable config = null;
  @observable status = EMPTY;
  @observable token = null;
  @observable userType = null;

  @action async setInstagramOauthConfig(config) {
    await EnvironmentStore.loadEnv();
    this.config = {
      authorize: 'https://api.instagram.com/oauth/authorize/',
      clientId: EnvironmentStore.environment.insta_client_id,
      redirectUri: EnvironmentStore.environment.insta_redirect_url,
      type: 'Instagram',
      scope: 'basic'
    };
  }

  @action updateOatuhStatus(newStatus) {
    this.status = newStatus;
  }

  @action setOatuhToken(token) {
    this.token = token;
  }

  @action setUserType(newUserType) {
    this.userType = newUserType;
  }

  @action reset() {
    this.token = null;
    this.status = EMPTY;
    this.config = null;
    this.userType = null;
  }
}

export default new OAtuhStore();
