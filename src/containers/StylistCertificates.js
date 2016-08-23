import React from 'react';
import _ from 'lodash';
import {Map, OrderedMap} from 'immutable';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import autoproxy from 'autoproxy';

import SearchList from '../components/SearchList';

import {stylistInfo} from '../routes';

import {NAVBAR_HEIGHT} from '../constants';

@autoproxy(connect(app))
export default class StylistCertificates extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  getValue() {
    return null;
  }

  clear() {
  }

  certificates = new OrderedMap(_.map(_.range(0, 20), (id) =>
    [id, new Map({id: id, label: `Certificate ${id}`})]
  ));

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.last(this.context.navigators).jumpTo(stylistInfo);
      }}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="Certificates"
    >
      <SearchList
        items={this.certificates}
        style={{
          flex: 1
        }}
      />
    </NavigationSetting>);
  }
};
