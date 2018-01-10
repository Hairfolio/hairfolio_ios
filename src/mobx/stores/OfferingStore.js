import {
  observable,
  computed,
  action,
  observer,
} from 'mobx';
import {fetch} from '../../services';
import { READY, EMPTY, LOADING, LOADING_ERROR } from '../../constants';
import UserStore from './UserStore';

class OfferingStore {
  @observable addOfferingState;
  @observable editOfferingState;
  @observable deleteOfferingState;

  constructor() {
    this.addOfferingState = EMPTY;
    this.editOfferingState = EMPTY;
    this.deleteOfferingState = EMPTY;
  }

  @action addOffering = (offering) => {
    this.addOfferingState = LOADING;
    fetch.fetch(
      `/users/${UserStore.user.id}/offerings`,
      {
        method: 'POST',
        body: {
          offering
        }
      }
    )
      .then(response => {
        UserStore.addOffering(response);
        this.addOfferingState = READY;
      })
      .catch(error => this.addOfferingState = LOADING_ERROR);
  }

  @action editOffering = (id, offering) => {
    this.editOfferingState = LOADING;
    fetch.fetch(
      `/users/${UserStore.user.id}/offerings/${id}`,
      {
        method: 'PUT',
        body: {
          offering
        }
      }
    )
      .then(response => {
        UserStore.editOffering(response);
        this.editOfferingState = READY;
      })
      .catch(error => this.editOfferingState = LOADING_ERROR);
  }

  @action deleteOffering = (id) => {
    this.deleteOfferingState = LOADING;
    fetch.fetch(`/users/${UserStore.user.id}/offerings`, { method: 'POST' })
      .then(response => {
        UserStore.deleteOffering(id);
        this.deleteOfferingState = READY;
      })
      .catch(error => this.deleteOfferingState = LOADING_ERROR);
  }
}

export default new OfferingStore();
