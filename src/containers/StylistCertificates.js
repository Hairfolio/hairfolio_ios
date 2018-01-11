import React from 'react';
import _ from 'lodash';
import {Map, OrderedMap} from 'immutable';
import PureComponent from '../components/PureComponent';
import {autobind} from 'core-decorators';
import {View, Text} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import LoadingContainer from '../components/LoadingContainer';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import SearchList from '../components/SearchList';

import {NAVBAR_HEIGHT} from '../constants';

export default class StylistCertificates extends PureComponent {
  static propTypes = {
    backTo: React.PropTypes.object.isRequired,
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  @autobind
  onWillFocus() {
    EnvironmentStore.getCertificates();
  }

  getValue() {
    if (!this._searchList)
      return '';
    return this._searchList.getValue().join(',');
  }

  setValue(selectedIds) {
    if (this._searchList)
      return this._searchList.setSelected(selectedIds);

    this.selectedIds = selectedIds;
  }

  clear() {
    if (this._searchList)
      this._searchList.clear();
  }

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.last(this.context.navigators).jumpTo(this.props.backTo);
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
      <LoadingContainer state={[EnvironmentStore.certificatesState]}>
        {() => <SearchList
          items={new OrderedMap(EnvironmentStore.certificates.map(certificate => {
            return [certificate.id, certificate]
          }
          ))}
          placeholder="Search for certificates"
          ref={sL => {
            this._searchList = sL;

            if (!this.selectedIds)
              return;

            this._searchList.setSelected(this.selectedIds);
            delete this.selectedIds;
          }}
          style={{
            flex: 1
          }}
        />}
      </LoadingContainer>
    </NavigationSetting>);
  }
};
