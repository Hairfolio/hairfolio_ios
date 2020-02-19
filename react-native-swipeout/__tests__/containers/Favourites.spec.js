import React from 'react';
import { shallow } from 'enzyme';
import UserStore from '../../src/mobx/stores/UserStore';
import EnvironmentStore from '../../src/mobx/stores/EnvironmentStore';
import { EMPTY, READY, LOADING, LOADING_ERROR } from '../../src/constants';
import { userMock, environmentMock, mockPost } from '../Mocks';
import { ActivityIndicator, Image, View, Text, ListView } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Favourites from '../../src/containers/Favourites';
import WhiteHeader from '../../src/components/WhiteHeader';
import FavouritesGrid from '../../src/components/favourites/FavouritesGrid';
import ActivityYou from '../../src/components/favourites/ActivityYou';
import ActivityFollowing from '../../src/components/favourites/ActivityFollowing';

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

describe('Favourites Container', () => {
  it('Renders current tab', () => {
    UserStore.loadUser(userMock);
    EnvironmentStore.environment = environmentMock;
    const wrapper = shallow(
      <Favourites
        navigator={{setOnNavigatorEvent: () => null}}
      />
    );
    expect(wrapper.find(View).length).toBe(1);
    expect(wrapper.find(WhiteHeader).length).toBe(1);
    expect(wrapper.find(ScrollableTabView).length).toBe(1);
    expect(wrapper.find(FavouritesGrid).length).toBe(1);
    expect(wrapper.find(ActivityYou).length).toBe(1);
    expect(wrapper.find(ActivityFollowing).length).toBe(1);
  });
});
