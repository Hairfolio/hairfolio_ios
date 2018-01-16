import {observable, computed, action} from 'mobx';
import { persist } from 'mobx-persist';
import hydrate from './hydrate';
import {EMPTY, LOADING, LOADING_ERROR, READY} from '../../constants';
import ServiceBackend from '../../backend/ServiceBackend';

class EnvironmentStore {
  @persist @observable environmentState;
  @persist @observable degreesState;
  @persist @observable categoriesState;
  @persist @observable experiencesState;
  @persist @observable servicesState;
  @persist @observable certificatesState;
  @persist('object') @observable environment;
  @persist('list') @observable degrees;
  @persist('list') @observable certificates;
  @persist('list') @observable services;
  @persist('list') @observable categories;
  @persist('list') @observable experiences;
  @persist @observable experiencesNextPage;

  constructor() {
    this.loadEnv();
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

  @action loadEnv = async () => {
    if (this.environment) {
      this.environmentState = READY;
      return this.environment;
    } else {
      this.environmentState = LOADING;
      try {
        let res = await ServiceBackend.getEnvironment();
        this.environmentState = READY;
        this.environment = res;
        return this.environment;
      } catch(error) {
        this.environmentState = LOADING_ERROR;
        throw error;
      }
    }
  }

  getEnv = () => {
    return this.environment || {};
  }

  @action getDegrees = () => {
    this.degreesState = LOADING;
    return fetch.fetch('/degrees')
      .then(response => {
        this.degrees = response;
        this.degreesState = READY;
      })
      .catch(error => {
        this.degreesState = LOADING_ERROR;
      });
  }

  @action getCertificates= () => {
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

  @action getServices = () => {
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

  @action getCategories = () => {
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
hydrate('environment', store);
export default store;
