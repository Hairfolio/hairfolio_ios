import React from 'react';
import { shallow } from 'enzyme';
import UserStore from '../../src/mobx/stores/UserStore';
import UsersStore from '../../src/mobx/stores/UsersStore';
import EnvironmentStore from '../../src/mobx/stores/EnvironmentStore';
import FeedStore from '../../src/mobx/stores/FeedStore';
import { EMPTY, READY, LOADING, LOADING_ERROR } from '../../src/constants';
import { userMock, environmentMock, mockFeedStore, mockEmptyFeedStore, mockPost } from '../Mocks';
import { ActivityIndicator, Image, View, Text, ListView } from 'react-native';
import Feed from '../../src/containers/Feed';
import Post from '../../src/components/feed/Post';
import { NativeModules } from 'react-native';

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

describe('Feed Container', () => {
  it('Renders current Feed loading', () => {
    UserStore.loadUser(userMock);
    EnvironmentStore.environment = environmentMock;
    FeedStore.isLoading = true;
    const wrapper = shallow(
      <Feed
        navigator={{setOnNavigatorEvent: () => null}}
      />
    );
    expect(wrapper.find(ActivityIndicator).length).toBe(1);
  });

  it('Renders current Feed empty', () => {
    UserStore.loadUser(userMock);
    EnvironmentStore.environment = environmentMock;
    FeedStore.isLoading = false;
    const wrapper = shallow(
      <Feed
        navigator={{setOnNavigatorEvent: () => null}}
      />
    );
    expect(wrapper.find(View).length).toBe(2);
    expect(wrapper.find(Text).length).toBe(1);
  });

  it('Renders current Feed with post', () => {
    UserStore.loadUser(userMock);
    EnvironmentStore.environment = environmentMock;
    FeedStore.isLoading = false;
    FeedStore.elements = [mockPost];
    const wrapper = shallow(
      <Feed
        navigator={{setOnNavigatorEvent: () => null}}
      />
    );
    expect(wrapper.find(View).length).toBe(1);
    expect(wrapper.find(ListView).length).toBe(1);
  });
});
