import React from 'react';
import { shallow } from 'enzyme';
import { TouchableOpacity } from 'react-native';
import Register from '../../src/containers/Register';
import SimpleButton from '../../src/components/Buttons/Simple';

jest.unmock('ScrollView');

describe('Register Container', () => {
  it('Renders 3 SimpleButtons and a TouchableOpacity', () => {
    const wrapper = shallow(<Register />);
    expect(wrapper.find(TouchableOpacity).length).toBe(1);
    expect(wrapper.find(SimpleButton).length).toBe(3);
  });
});
