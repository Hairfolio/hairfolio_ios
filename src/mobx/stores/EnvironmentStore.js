import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'Hairfolio/src/helpers';

import {EMPTY, LOADING, LOADING_ERROR, READY} from '../../constants';
import ServiceBackend from 'backend/ServiceBackend.js'
import { environment } from '../../selectors/environment';

class EnvironmentStore {
  @observable environmentState;
  @observable degreesState;
  @observable categoriesState;
  @observable experiencesState;
  @observable servicesState;
  @observable certificatesState;
  @observable environment;
  @observable degrees;
  @observable certificates;
  @observable services;
  @observable categories;
  @observable experiences;
  @observable experiencesNextPage;

  constructor() {
    this.get();
    this.environmentState = EMPTY;
    this.degreesState = EMPTY;
    this.categoriesState = EMPTY;
    this.experiencesState = EMPTY;
    this.servicesState = EMPTY;
    this.certificatesState = EMPTY;
    this.environment = {};
    this.degrees = [];
    this.services = [];
    this.categories = [];
    this.certificates = [];
    this.experiences = [];
    this.experiencesNextPage = 1;
  }

  @action async get() {
    if (this.environment) {
      this.environmentState = READY;
      return this.environment;
    } else {
      this.environmentState = LOADING;
      try {
        let res = await ServiceBackend.get('/sessions/environment');
        this.environmentState = READY;
        this.environment = res;
        return res;
      } catch(error) {
        this.environmentState = LOADING_ERROR;
      }
    }
  }

  getEnv() {
    return this.environment || {};
  }

  @action getDegrees = () => {
    // TODO: Wire up user id
    this.degreesState = LOADING;
    fetch.fetch('/degrees')
      .then(response => {
        this.degrees = response;
        this.degreesState = READY;
      })
      .catch(error => {
        this.degreesState = LOADING_ERROR;
      });
  }

  @action getCertificates() {
    this.certificatesState = LOADING;
    fetch.fetch('/certificates')
      .then(response => {
        this.certificates = response;
        this.certificatesState = READY;
      })
      .catch(error => {
        this.certificatesState = LOADING_ERROR;
      });
  }

  @action getServices() {
    this.servicesState = LOADING;
    fetch.fetch('/services')
      .then(response => {
        this.services = response;
        this.servicesState = READY;
      })
      .catch(error => {
        this.servicesState = LOADING_ERROR;
      });
  }

  @action getCategories() {
    this.categoriesState = LOADING;
    fetch.fetch('/categories')
      .then(response => {
        this.categories = response;
        this.categoriesState = READY;
      })
      .catch(error => {
        this.categoriesState = LOADING_ERROR;
      });
  }

  @action getExperiences = (pageNumber) => {
    this.experiencesState = LOADING;
    fetch.fetch(`/experiences?page=${pageNumber || 1}`)
      .then(response => {
        this.experiences.concat(response.experiences);
        this.experiencesNextPage = response.meta.next_page;
        this.experiencesState = READY;
      })
      .catch(error => {
        this.experiencesState = LOADING_ERROR;
      })
  }

}

const store = new EnvironmentStore();
export default store;
