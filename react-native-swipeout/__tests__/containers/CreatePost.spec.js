import React from 'react';
import { shallow } from 'enzyme';
import UserStore from '../../src/mobx/stores/UserStore';
import EnvironmentStore from '../../src/mobx/stores/EnvironmentStore';
import SlimHeader from '../../src/components/SlimHeader';
import { EMPTY, READY, LOADING, LOADING_ERROR } from '../../src/constants';
import { userMock, environmentMock, mockFeedStore, mockEmptyFeedStore, mockPost } from '../Mocks';
import { ActivityIndicator, Image, View, Text, ListView } from 'react-native';
import CreatePost from '../../src/containers/CreatePost';
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

jest.mock('../../src/mobx/stores/CreatePostStore.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      startRecording: () => null,
      stopRecording: () => null,
      reset: () => null,
      selectedLibraryPicture: () => null,
      changeInputMethod: () => null,
      postPost: () => null,
      isRecording: false,
      loadGallery: false,
      inputMethod: 'Library',
    }
  });
})

describe('CreatePost Container', () => {
  it('Renders create post', () => {
    UserStore.loadUser(userMock);
    EnvironmentStore.environment = environmentMock;
    const wrapper = shallow(
      <CreatePost
        navigator={{setOnNavigatorEvent: () => null}}
      />
    );
    expect(wrapper.find(View).length).toBe(3);
    expect(wrapper.find(SlimHeader).length).toBe(1);
  });
});
