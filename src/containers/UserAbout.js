import React from 'react';
import _ from 'lodash';
import {autobind} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, Text, ScrollView} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import appEmitter from '../appEmitter';

import CollapsableContainer from '../components/CollapsableContainer';

@connect(app, user)
export default class UserAbout extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    profile: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  componentWillMount() {
    this.listeners = [
      appEmitter.addListener('login', this.onLogin)
    ];
  }

  componentWillUnmount() {
    _.each(this.listeners, l => l.remove());
  }

  @autobind
  onLogin() {
    this.refs.scrollView.scrollToTop();
  }

  render() {
    return (<NavigationSetting
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE
      }}
    >
      <ScrollView
        ref="scrollView"
        style={{
          flex: 1
        }}
      >
        <CollapsableContainer label="EMPLOYMENT">
          <Text style={{
            fontFamily: FONTS.MEDIUM,
            fontSize: SCALE.h(26),
            color: COLORS.TEXT
          }}>User About</Text>
        </CollapsableContainer>
        <CollapsableContainer label="CERTIFICATES">
          <Text style={{
            fontFamily: FONTS.MEDIUM,
            fontSize: SCALE.h(26),
            color: COLORS.TEXT
          }}>User About</Text>
        </CollapsableContainer>
        <CollapsableContainer label="PRODUCT EXPERIENCE">
          <Text style={{
            fontFamily: FONTS.MEDIUM,
            fontSize: SCALE.h(26),
            color: COLORS.TEXT
          }}>User About</Text>
        </CollapsableContainer>
        <CollapsableContainer label="PROFESSIONAL_DESCRIPTION">
          <Text style={{
            fontFamily: FONTS.MEDIUM,
            fontSize: SCALE.h(26),
            color: COLORS.TEXT
          }}>User About</Text>
        </CollapsableContainer>
      </ScrollView>
    </NavigationSetting>);
  }
};
