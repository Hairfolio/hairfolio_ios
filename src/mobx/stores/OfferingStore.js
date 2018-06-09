import {
  observable,
  computed,
  action,
  observer,
} from 'mobx';
import { READY, EMPTY, LOADING, LOADING_ERROR } from '../../constants';
import UserStore from './UserStore';
import ServiceBackend from '../../backend/ServiceBackend';

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
    return ServiceBackend.post(
      `/users/${UserStore.user.id}/offerings`,
      {
        offering
      }
    )
      .then(response => {
        UserStore.addOffering(response.offering);
        this.addOfferingState = READY;
      })
      .catch(error => {
        this.addOfferingState = LOADING_ERROR;
        throw error;
      });
  }

  @action editOffering = (id, offering) => {
    this.editOfferingState = LOADING;
    return ServiceBackend.put(
      `users/${UserStore.user.id}/offerings/${id}`,
      {
        offering
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
    return fetch(`/users/${UserStore.user.id}/offerings`, { method: 'POST' })
      .then(response => {
        UserStore.deleteOffering(id);
        this.deleteOfferingState = READY;
      })
      .catch(error => this.deleteOfferingState = LOADING_ERROR);
  }
}

export default new OfferingStore();
