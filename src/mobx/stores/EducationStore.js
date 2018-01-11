import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'Hairfolio/src/helpers';
import {fetch} from '../../services';
import {EMPTY, LOADING, LOADING_ERROR, READY} from '../../constants';
import ServiceBackend from 'backend/ServiceBackend.js'
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
    return fetch.fetch(
      `/users/${UserStore.user.id}/educations`,
      {
        method: 'POST',
        body: {
          education
        }
      }
    )
      .then(response =>{
        UserStore.addEducation(response);
        this.addEducationState = READY;
      })
      .catch(error => this.addEducationState = LOADING_ERROR)
  }

  @action editEducation = (id, education) => {
    this.editEducationState = LOADING;
    return fetch.fetch(
      `/users/${UserStore.user.id}/educations/${id}`,
      {
        method: 'PUT',
        body: {
          education
        }
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
    return fetch.fetch(`/users/${UserStore.user.id}/educations/${id}`, { method: 'DELETE' })
    .then(response => {
      UserStore.deleteEducation(id);
      this.deleteEducationState = READY
    })
    .catch(error => this.deleteEducationState = LOADING_ERROR)
  }

}

export default new EducationStore();
