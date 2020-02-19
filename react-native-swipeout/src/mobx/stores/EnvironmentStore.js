import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import ServiceBackend from '../../backend/ServiceBackend';
import { EMPTY, LOADING, LOADING_ERROR, READY } from '../../constants';
import hydrate from './hydrate';
import { showLog } from '../../helpers';

class EnvironmentStore {
  @persist @observable environmentState;
  @persist @observable degreesState;
  @persist @observable categoriesState;
  @persist @observable servicesState;
  @persist @observable certificatesState;
  @persist('object') @observable environment;
  @persist('list') @observable degrees;
  @persist('list') @observable certificates;
  @persist('list') @observable services;
  @persist('list') @observable categories;
  @persist('list') @observable experiences;
  @persist @observable experiencesNextPage;
  @persist @observable certificatesNextPage;
  

  constructor() {
    this.loadEnv();
    this.environmentState = EMPTY;
    this.degreesState = EMPTY;
    this.categoriesState = EMPTY;
    this.experiencesState = EMPTY;
    this.servicesState = EMPTY;
    this.certificatesState = EMPTY;
    this.environment = null;
    this.degrees = [];
    this.services = [];
    this.categories = [];
    this.certificates = [];
    this.experiences = [];
    this.experiencesNextPage = 1;
    this.certificatesNextPage = 1;
  }

  @action loadEnv = async () => {
    showLog("called env")
    if (this.environment) {
      showLog("Alreay env")
      this.environmentState = READY;
      showLog("ENV READY STATE ==> " + READY);
      return this.environment;
    } else {
      this.environmentState = LOADING;
      try {
        let res = await ServiceBackend.getEnvironment();
        this.environmentState = READY;
        this.environment = res;
        showLog("ENV TRY STATE ==> " + JSON.stringify(this.environment));
        return this.environment;
      } catch (error) {
        this.environmentState = LOADING_ERROR;
        showLog("ENV ERROR STATE ==> " + this.environment);
        throw error;
      }
    }
  }

  getEnv = () => {
    return this.environment || {};
  }

  @action getDegrees = () => {
    this.degreesState = LOADING;
    return ServiceBackend.get('degrees/')
      .then(response => {
        this.degrees = response.degrees;
        this.degreesState = READY;
      })
      .catch(error => {
        this.degreesState = LOADING_ERROR;
      });
  }

  @action getCertificatesOld = () => {
    this.certificatesState = LOADING;
    return ServiceBackend.get('certificates/')
      .then(response => {
        this.certificatesState = READY;
        this.certificates = response.certificates;
      })
      .catch(error => {
        showLog(error);
        this.certificatesState = LOADING_ERROR;
      });
  }

  @action getServices = () => {
    this.servicesState = LOADING;
    return ServiceBackend.get('services/')
      .then(response => {
        this.services = response.services;
        this.servicesState = READY;
      })
      .catch(error => {
        this.servicesState = LOADING_ERROR;
      });
  }

  @action getCategories = () => {
    this.categoriesState = LOADING;
    return ServiceBackend.get('categories/')
      .then(response => {
        this.categories = response.categories;
        this.categoriesState = READY;
      })
      .catch(error => {
        this.categoriesState = LOADING_ERROR;
      });
  }

  @action getExperiences = async (pageNumber) => {
    this.experiencesState = LOADING;
    try {
      const response = await ServiceBackend.get(`experiences?page=${pageNumber || 1}`);
      this.experiences = this.experiences.concat(response.experiences);
      this.experiencesNextPage = response.meta.next_page;
      this.experiencesState = READY;
    } catch (error) {
      this.experiencesState = LOADING_ERROR;
    }
  }

  @action getCertificates = async (pageNumber) => {
    this.certificatesState = LOADING;
    try {
      const response = await ServiceBackend.get(`certificates?page=${pageNumber || 1}`);
      showLog("getCertificates 1==>"+JSON.stringify(this.certificates));
      this.certificates = this.certificates.concat(response.certificates);
      showLog("getCertificates 2==>"+JSON.stringify(this.certificates));
      this.certificatesNextPage = response.meta.next_page;
      this.certificatesState = READY;
    } catch (error) {
      this.certificatesState = LOADING_ERROR;
    }
  }
}

const store = new EnvironmentStore();
hydrate('environment', store);
export default store;
