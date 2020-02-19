import { toJS } from 'mobx';
import UserStore from '../../src/mobx/stores/UserStore';
import { EMPTY, READY, LOADING, LOADING_ERROR } from '../../src/constants';
import { userMock } from '../Mocks';

jest.unmock('ScrollView');

describe('UserStore', () => {
  it('checks initial state', () => {
    expect(UserStore.userState).toBe(EMPTY);
    expect(UserStore.changePasswordState).toBe(EMPTY);
    expect(toJS(UserStore.followingStates.values()).length).toBe(0);
    expect(UserStore.forgotPasswordState).toBe(EMPTY);
    expect(UserStore.registrationMethod).toBeNull();
    expect(UserStore.needsMoreInfo).toBeFalsy();
    expect(toJS(UserStore.user)).toEqual({
      educations: [],
      offerings: [],
    });
  });

  it('sets NeedsMoreInfo to true', () => {
    UserStore.setNeedsMoreInfo(true);
    expect(UserStore.needsMoreInfo).toBeTruthy();
  });

  it('Loads an User', () => {
    UserStore.loadUser(userMock);
    expect(toJS(UserStore.user)).toEqual(userMock);
  });

  it('Sets user token', () => {
    const fakeToken = 'fake token';
    UserStore.loadUser(userMock);
    UserStore.setToken(fakeToken);
    expect(toJS(UserStore.token)).toBe(fakeToken);
  });

  it('Sets registrationMethod', () => {
    const method = 'method';
    UserStore.setMethod(method);
    expect(toJS(UserStore.registrationMethod)).toBe(method);
  });

  it('Adds offering', () => {
    UserStore.loadUser(userMock);
    UserStore.addOffering({name: 'fake'});
    expect(toJS(UserStore.user.offerings).length).toBe(1);
  });
});
