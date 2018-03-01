import React from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';
import {Map, OrderedMap} from 'immutable';
import PureComponent from '../components/PureComponent';
import {autobind} from 'core-decorators';
import {View, Text} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import LoadingContainer from '../components/LoadingContainer';
import SearchList from '../components/SearchList';
import whiteBack from '../../resources/img/nav_white_back.png';

@observer
export default class StylistCertificates extends PureComponent {
  state = {};

  constructor(props) {
    super(props);
    EnvironmentStore.getCertificates();
  }

  static navigatorButtons = {
    leftButtons: [
      {
        id: 'back',
        icon: whiteBack,
      }
    ],
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
  // TODO
  render() {
    const certificates = new OrderedMap(
      EnvironmentStore.certificates.map(certificate => [certificate.id, new Map(certificate)])
    );
    const loadingState = [EnvironmentStore.certificatesState];
    return (
      <LoadingContainer state={loadingState}>
        {() => <SearchList
          items={certificates}
          placeholder="Search for certificates"
          ref={sL => {
            this._searchList = sL;
            if (!this.selectedIds)
              return;
            this._searchList.setSelected(this.selectedIds);
            delete this.selectedIds;
          }}
          style={{
            flex: 1,
            backgroundColor: COLORS.LIGHT,
          }}
        />}
      </LoadingContainer>
    );
  }
};
