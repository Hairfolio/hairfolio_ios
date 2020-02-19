import { action, observable } from 'mobx';
import { EMPTY } from '../../constants';
import EnvironmentStore from './EnvironmentStore';

class OAtuhStore {
  @observable config = null;
  @observable status = EMPTY;
  @observable token = null;
  @observable userType = null;
  @observable isFromInstaLogin = false;

  @action async setInstagramOauthConfig(config) {
    await EnvironmentStore.loadEnv();
    // this.config = {
    //   authorize: 'https://api.instagram.com/oauth/authorize/',
    //   clientId: EnvironmentStore.environment.insta_client_id,
    //   redirectUri: EnvironmentStore.environment.insta_redirect_url,
    //   type: 'Instagram',
    //   scope: 'basic'
    // };
    let url = 'https://api.instagram.com/oauth/authorize/?client_id='+EnvironmentStore.environment.insta_client_id+'&redirect_uri='+EnvironmentStore.environment.insta_redirect_url+'&response_type=token';
    // let url = "https://www.instagram.com/accounts/login/?force_authentication=1&only_user_pwd_authentication=1&platform_app_id=&next=/oauth/authorize/%3Fclient_id%3Df37b7f3fdd93409f8d4e4e69ea269f75%26response_type%3Dtoken%26redirect_uri%3Dhttp%3A//180.211.99.165%3A8080/jaisal/hairfolio_v1/insta_auth_callback"

    this.config = {
      authorize: url,
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
    this.isFromInstaLogin = false;
  }
}

export default new OAtuhStore();
