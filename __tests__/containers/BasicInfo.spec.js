import React from 'react';
import { shallow } from 'enzyme';
import { Image } from 'react-native';
import BasicInfo from '../../src/containers/BasicInfo';
import BannerErrorContainer from '../../src/components/BannerErrorContainer';
import KeyboardScrollView from '../../src/components/KeyboardScrollView';
import PictureInput from '../../src/components/Form/Picture';
import InlineTextInput from '../../src/components/Form/InlineTextInput';

jest.unmock('ScrollView');

describe('BasicInfo Container', () => {
  it('Renders All consumer fields', () => {
    const wrapper = shallow(
      <BasicInfo
        accountType={'consumer'}
        detailFields={[
          {
            placeholder: 'First Name',
            ppte: 'first_name'
          },
          {
            placeholder: 'Last Name',
            ppte: 'last_name'
          }
        ]}
      />
    );
    expect(wrapper.find(BannerErrorContainer).length).toBe(1);
    expect(wrapper.find(KeyboardScrollView).length).toBe(1);
    expect(wrapper.find(PictureInput).length).toBe(1);
    expect(wrapper.find(InlineTextInput).length).toBe(4);
  });

  it('Renders All stylist fields', () => {
    const wrapper = shallow(
      <BasicInfo
        accountType={'stylist'}
        detailFields={[
          {
            placeholder: 'First Name',
            ppte: 'first_name'
          },
          {
            placeholder: 'Last Name',
            ppte: 'last_name'
          }
        ]}
      />
    );
    expect(wrapper.find(BannerErrorContainer).length).toBe(1);
    expect(wrapper.find(KeyboardScrollView).length).toBe(1);
    expect(wrapper.find(PictureInput).length).toBe(1);
    expect(wrapper.find(InlineTextInput).length).toBe(4);
  });

  it('Renders All brand fields', () => {
    const wrapper = shallow(
      <BasicInfo
        accountType={'brand'}
        detailFields={[
          {
            placeholder: 'Brand Name',
              ppte: 'business.name'
          },
        ]}
      />
    );
    expect(wrapper.find(BannerErrorContainer).length).toBe(1);
    expect(wrapper.find(KeyboardScrollView).length).toBe(1);
    expect(wrapper.find(PictureInput).length).toBe(1);
    expect(wrapper.find(InlineTextInput).length).toBe(3);
  });

  it('Renders All salon fields', () => {
    const wrapper = shallow(
      <BasicInfo
        accountType={'salon'}
        detailFields={[
          {
            placeholder: 'Salon Name',
            ppte: 'business.name'
          },
        ]}
      />
    );
    expect(wrapper.find(BannerErrorContainer).length).toBe(1);
    expect(wrapper.find(KeyboardScrollView).length).toBe(1);
    expect(wrapper.find(PictureInput).length).toBe(1);
    expect(wrapper.find(InlineTextInput).length).toBe(3);
  });
});
