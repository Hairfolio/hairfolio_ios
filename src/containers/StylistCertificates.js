import React from 'react';
import _ from 'lodash';
import {Map, OrderedMap} from 'immutable';
import PureComponent from '../components/PureComponent';
import {autobind} from 'core-decorators';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {environment} from '../selectors/environment';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import LoadingContainer from '../components/LoadingContainer';

import {registrationActions} from '../actions/registration';

import SearchList from '../components/SearchList';

import {stylistInfo} from '../routes';

import {NAVBAR_HEIGHT} from '../constants';

@connect(app, environment)
export default class StylistCertificates extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    certificates: React.PropTypes.object.isRequired,
    certificatesState: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  @autobind
  onWillFocus() {
    this.props.dispatch(registrationActions.getCertificates());
  }

  getValue() {
    return this._searchList.getValue().join(',');
  }

  clear() {
    this._searchList.clear();
  }

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
      <LoadingContainer state={[this.props.certificatesState]}>
        {() => <SearchList
          items={new OrderedMap(this.props.certificates.map(certificate =>
            [certificate.get('id'), certificate]
          ))}
          placeholder="Search for certificates"
          ref={sL => this._searchList = sL}
          style={{
            flex: 1
          }}
        />}
      </LoadingContainer>
    </NavigationSetting>);
  }
};
