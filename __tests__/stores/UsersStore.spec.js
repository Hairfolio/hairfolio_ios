import { toJS } from 'mobx';
import UsersStore from '../../src/mobx/stores/UsersStore';
import { EMPTY, READY, LOADING, LOADING_ERROR } from '../../src/constants';
import { userMock } from '../Mocks';

jest.unmock('ScrollView');

describe('UsersStore', () => {
  it('checks initial state', () => {
    expect(toJS(UsersStore.usersStates.values()).length).toBe(0);
    expect(toJS(UsersStore.users.values()).length).toBe(0);
    expect(UsersStore.currentProfile).toBeNull();
  });

  it('Sets a selected profile', () => {
    UsersStore.setCurrentProfile(userMock);
    expect(toJS(UsersStore.currentProfile)).toEqual(userMock);
  });
});
