import { action, observable } from 'mobx';
import ServiceBackend from '../../backend/ServiceBackend';
import { EMPTY, LOADING, LOADING_ERROR, READY } from '../../constants';
import UserStore from './UserStore';

class EducationStore {
  @observable editEducationState
  @observable deleteEducationState
  @observable addEducationState

  constructor() {
    this.editEducationState = EMPTY;
    this.deleteEducationState = EMPTY;
    this.addEducationState = EMPTY;
  }

  @action addEducation = (education) => {
    this.addEducationState = LOADING;
    return ServiceBackend.post(
      `users/${UserStore.user.id}/educations`,
      {
        education
      }
    )
      .then(response => {
        UserStore.addEducation(response);
        this.addEducationState = READY;
      })
      .catch(error => this.addEducationState = LOADING_ERROR)
  }

  @action editEducation = (id, education) => {
    this.editEducationState = LOADING;
    return ServiceBackend.put(
      `users/${UserStore.user.id}/educations/${id}`,
      {
        education
      }
    )
      .then(response => {
        UserStore.editEducation(id, education);
        this.editEducationState = READY;
      })
      .catch(error => this.editEducationState = LOADING_ERROR)
  }

  @action deleteEducation = (id) => {
    this.deleteEducationState = LOADING;
    return ServiceBackend.delete(`users/${UserStore.user.id}/educations/${id}`)
      .then(response => {
        UserStore.deleteEducation(id);
        this.deleteEducationState = READY
      })
      .catch(error => this.deleteEducationState = LOADING_ERROR)
  }

}

export default new EducationStore();
