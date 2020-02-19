import React from 'react';
import { shallow } from 'enzyme';
import UserStore from '../../src/mobx/stores/UserStore';
import UsersStore from '../../src/mobx/stores/UsersStore';
import EnvironmentStore from '../../src/mobx/stores/EnvironmentStore';
import { EMPTY, READY, LOADING, LOADING_ERROR } from '../../src/constants';
import { userMock, environmentMock } from '../Mocks';

import { BlurView } from 'react-native-blur';
import { Image, View } from 'react-native';
import Profile from '../../src/containers/Profile';
import BannerErrorContainer from '../../src/components/BannerErrorContainer';
import WrappingScrollView from '../../src/components/WrappingScrollView';
import ProfileButton from '../../src/components/Buttons/Follow';
import LoadingContainer from '../../src/components/LoadingContainer';

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

describe('Profile Container', () => {
  it('Renders current profile correctly', () => {
    UserStore.loadUser(userMock);
    EnvironmentStore.environment = environmentMock;
    const wrapper = shallow(
      <Profile />
    );
    expect(wrapper.find(BannerErrorContainer).length).toBe(1);
    expect(wrapper.find(BlurView).length).toBe(1);
    expect(wrapper.find(WrappingScrollView).length).toBe(1);
    expect(wrapper.find(Image).length).toBe(3);
  });

  it('Renders loading view correctly', () => {
    EnvironmentStore.environment = environmentMock;
    const wrapper = shallow(
      <Profile userId={1}/>
    );
    expect(wrapper.find(View).find(LoadingContainer).length).toBe(1);
    expect(wrapper.find(BannerErrorContainer).length).toBe(0);
    expect(wrapper.find(BlurView).length).toBe(0);
    expect(wrapper.find(WrappingScrollView).length).toBe(0);
    expect(wrapper.find(Image).length).toBe(0);
  });
});
