import React from 'react';
import _ from 'lodash';
import PureComponent from '../../components/PureComponent';
import RN, {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import connect from '../../lib/connect';
import {app} from '../../selectors/app';
import {COLORS, SCALE} from '../../style';
import NavigationSetting from '../../navigation/NavigationSetting';

import InlineTextInput from '../../components/Form/InlineTextInput';
import Icon from '../../components/Icon';
import KeyboardPaddingView from '../../components/KeyboardPaddingView';
import KeyboardScrollView from '../../components/KeyboardScrollView';
import BannerErrorContainer from '../../components/BannerErrorContainer';

import {loginStack, appStack} from '../../routes';

import {NAVBAR_HEIGHT} from '../../constants';

@connect(app)
export default class BasicInfoConsumer extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.first(this.context.navigators).jumpTo(loginStack);
      }}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      rightAction={() => {
        _.first(this.context.navigators).jumpTo(appStack);
      }}
      rightLabel="Next"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="Consumer Account"
    >
      <BannerErrorContainer ref="ebc">
        <KeyboardPaddingView
          style={{flex: 1}}
        >
          <KeyboardScrollView
            scrollEnabled={false}
            scrollToTopOnBlur
            showsVerticalScrollIndicator={false}
            space={90}
            style={{flex: 1}}
          >
            <TouchableOpacity
              onPress={() => {
                ImagePicker.showImagePicker({
                  noData: true
                }, response => {
                  if (response.error)
                    return this.refs.ebc.error(response.error);
                  if (response.uri)
                    this.setState({pictureURI: response.uri});
                });
              }}
              style={{
                marginTop: SCALE.h(34),
                marginBottom: SCALE.h(34),
                alignSelf: 'center',
                height: SCALE.h(150),
                width: SCALE.h(150),
                borderRadius: SCALE.h(150) / 2,
                backgroundColor: COLORS.WHITE,

                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {!this.state.pictureURI ?
                <Icon
                  color={COLORS.DARK}
                  name="camera"
                  size={SCALE.h(65)}
                />
              :
                <Image
                  source={{uri: this.state.pictureURI}}
                  style={{
                    height: SCALE.h(150),
                    width: SCALE.h(150)
                  }}
                />
              }
            </TouchableOpacity>
            <InlineTextInput
              getRefNode={() => {
                return RN.findNodeHandle(this.refs.last);
              }}
              placeholder="Email"
            />
            <View style={{height: StyleSheet.hairlineWidth}} />
            <InlineTextInput
              getRefNode={() => {
                return RN.findNodeHandle(this.refs.last);
              }}
              placeholder="Last Name"
            />
            <View style={{height: StyleSheet.hairlineWidth}} />
            <InlineTextInput
              getRefNode={() => {
                return RN.findNodeHandle(this.refs.last);
              }}
              placeholder="Email"
            />
            <View style={{height: StyleSheet.hairlineWidth}} />
            <InlineTextInput
              getRefNode={() => {
                return RN.findNodeHandle(this.refs.last);
              }}
              help="At least 6 characters"
              placeholder="Password"
              ref="last"
            />
          </KeyboardScrollView>
        </KeyboardPaddingView>
      </BannerErrorContainer>
    </NavigationSetting>);
  }
};
