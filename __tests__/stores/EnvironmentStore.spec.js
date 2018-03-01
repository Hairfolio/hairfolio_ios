import { toJS } from 'mobx';
import EnvironmentStore from '../../src/mobx/stores/EnvironmentStore';
import { EMPTY, READY, LOADING, LOADING_ERROR } from '../../src/constants';
import {
  environmentMock,
  degreesMock,
  certsMock,
  servicesMock,
  experiencesMock,
  categoriesMock
} from '../Mocks';
import jestFetchMock from 'jest-fetch-mock';

jest.unmock('ScrollView');

describe('EnvironmentStore', () => {
  it('checks initial state', () => {
    expect(EnvironmentStore.environmentState).toBe(EMPTY);
    expect(EnvironmentStore.degreesState).toBe(EMPTY);
    expect(EnvironmentStore.categoriesState).toBe(EMPTY);
    expect(EnvironmentStore.servicesState).toBe(EMPTY);
    expect(EnvironmentStore.experiencesState).toBe(EMPTY);
    expect(EnvironmentStore.certificatesState).toBe(EMPTY);
    expect(toJS(EnvironmentStore.environment)).toBeNull();
    expect(toJS(EnvironmentStore.degrees).length).toBe(0);
    expect(toJS(EnvironmentStore.services).length).toBe(0);
    expect(toJS(EnvironmentStore.categories).length).toBe(0);
    expect(toJS(EnvironmentStore.certificates).length).toBe(0);
    expect(toJS(EnvironmentStore.experiences).length).toBe(0);
    expect(toJS(EnvironmentStore.experiencesNextPage)).toBe(1);
  });

  it('gets Empty env', () => {
    expect(toJS(EnvironmentStore.getEnv())).not.toBeNull();
  });

  it('Loads environment', () => {
    fetch.mockResponseOnce(JSON.stringify(environmentMock), {status: 200});
    return EnvironmentStore.loadEnv()
      .then(env => {
        expect(env).toEqual(environmentMock);
      });
  });

  it('Loads degress', () => {
    fetch.mockResponseOnce(JSON.stringify(degreesMock), {status: 200});
    return EnvironmentStore.getDegrees()
      .then(() => {
        expect(toJS(EnvironmentStore.degrees)).toEqual(degreesMock.degrees);
      });
  });

  it('Loads certificates', () => {
    fetch.mockResponseOnce(JSON.stringify(certsMock), {status: 200});
    return EnvironmentStore.getCertificates()
      .then(() => {
        expect(toJS(EnvironmentStore.certificates)).toEqual(certsMock.certificates);
      });
  });

  it('Loads services', () => {
    fetch.mockResponseOnce(JSON.stringify(servicesMock), {status: 200});
    return EnvironmentStore.getServices()
      .then(() => {
        expect(toJS(EnvironmentStore.services)).toEqual(servicesMock);
      });
  });

  it('Loads experiences', () => {
    fetch.mockResponseOnce(JSON.stringify(experiencesMock), {status: 200});
    return EnvironmentStore.getExperiences(1)
      .then(() => {
        expect(toJS(EnvironmentStore.experiences)).toEqual(experiencesMock.experiences);
      });
  });

  it('Loads categories', () => {
    fetch.mockResponseOnce(JSON.stringify(categoriesMock), {status: 200});
    return EnvironmentStore.getCategories()
      .then(() => {
        expect(toJS(EnvironmentStore.categories)).toEqual(categoriesMock);
      });
  });
});
