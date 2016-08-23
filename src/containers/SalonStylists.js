import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {Map, OrderedMap} from 'immutable';
import {COLORS, FONTS, SCALE} from '../style';
import SearchList from '../components/SearchList';
import NavigationSetting from '../navigation/NavigationSetting';

import {salonInfo} from '../routes';

import {NAVBAR_HEIGHT} from '../constants';

@connect(app)
export default class SalonStylist extends PureComponent {
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

  stylists = new OrderedMap(_.map(_.range(0, 20), (id) =>
    [id, new Map({id: id, label: `Stylist ${id}`})]
  ));

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.last(this.context.navigators).jumpTo(salonInfo);
      }}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="Stylists"
    >
      <SearchList
        items={this.stylists}
        style={{
          flex: 1
        }}
      />
    </NavigationSetting>);
  }
};
