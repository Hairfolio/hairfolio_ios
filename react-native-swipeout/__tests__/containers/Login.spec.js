import React from 'react';
import { shallow } from 'enzyme';
import { Image } from 'react-native';
import Login from '../../src/containers/Login';
import SimpleButton from '../../src/components/Buttons/Simple';
import CustomTouchableOpacity from '../../src/components/CustomTouchableOpacity';

jest.unmock('ScrollView');

describe('Login Container', () => {
  it('Renders 3 SimpleButtons and a TouchableOpacity', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find(CustomTouchableOpacity).length).toBe(2);
    expect(wrapper.find(Image).length).toBe(2);
    expect(wrapper.find(SimpleButton).length).toBe(3);
  });
});
