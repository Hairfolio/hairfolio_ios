import React from 'react';
import { shallow } from 'enzyme';
import UserStore from '../../src/mobx/stores/UserStore';
import EnvironmentStore from '../../src/mobx/stores/EnvironmentStore';
import SearchStore from '../../src/mobx/stores/SearchStore';
import { EMPTY, READY, LOADING, LOADING_ERROR } from '../../src/constants';
import { userMock, environmentMock, mockPost } from '../Mocks';
import { ActivityIndicator, Image, View, Text, ListView } from 'react-native';
import Search from '../../src/containers/Search';
import SearchElement from '../../src/components/search/Search';

jest.unmock('ScrollView');
jest.mock('react-native-camera', () => 'Camera');
jest.mock('react-native-fetch-blob', () => {
  return {
    DocumentDir: () => {},
    fetch: () => {},
    base64: () => {},
    android: () => {},
    ios: () => {},
    config: () => {},
    session: () => {},
    fs: () => {},
    wrap: () => {},
    polyfill: () => {},
    JSONStream: () => {}
  };
});

jest.mock('../../src/mobx/stores/AlbumStore', () => {
  return jest.fn().mockImplementation(() => {
    return { load: jest.fn() };
  });
});

describe('Search Container', () => {
  it('Renders current Search Container', () => {
    UserStore.loadUser(userMock);
    EnvironmentStore.environment = environmentMock;
    const wrapper = shallow(
      <Search
        navigator={{setOnNavigatorEvent: () => null}}
      />
    );
    expect(wrapper.find(View).length).toBe(1);
    expect(wrapper.find(SearchElement).length).toBe(1);
  });

  it('Renders current SearchElement loading', () => {
    UserStore.loadUser(userMock);
    EnvironmentStore.environment = environmentMock;
    SearchStore.loaded = false
    const wrapper = shallow(
      <SearchElement
        navigator={{setOnNavigatorEvent: () => null}}
      />
    );
    expect(wrapper.find(View).length).toBe(1);
    expect(wrapper.find(ListView).length).toBe(0);
  });

  it('Renders current SearchElement', () => {
    UserStore.loadUser(userMock);
    EnvironmentStore.environment = environmentMock;
    SearchStore.loaded = true;
    const wrapper = shallow(
      <SearchElement
        navigator={{setOnNavigatorEvent: () => null}}
      />
    );
    expect(wrapper.find(View).length).toBe(0);
    expect(wrapper.find(ListView).length).toBe(1);
  });
});
