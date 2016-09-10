import React from 'react';
import _ from 'lodash';
import {OrderedMap} from 'immutable';
import PureComponent from '../components/PureComponent';
import {autobind} from 'core-decorators';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {environment} from '../selectors/environment';
import {COLORS} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import SearchList from '../components/SearchList';

import LoadingContainer from '../components/LoadingContainer';

import {registrationActions} from '../actions/registration';

import {stylistInfo} from '../routes';

import {NAVBAR_HEIGHT} from '../constants';

@connect(app, environment)
export default class StylistProductExperience extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    experiences: React.PropTypes.object.isRequired,
    experiencesState: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  @autobind
  onWillFocus() {
    this.props.dispatch(registrationActions.getExperiences());
  }

  getValue() {
    return this._searchList.getValue().join(',');
  }

  clear() {
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
      title="Product Experience"
    >
      <LoadingContainer state={[this.props.experiencesState]} style={{flex: 1}}>
        {() => <SearchList
          items={new OrderedMap(this.props.experiences.map(experience =>
            [experience.get('id'), experience]
          ))}
          placeholder="Search for products"
          ref={sL => this._searchList = sL}
          style={{
            flex: 1
          }}
        />}
      </LoadingContainer>
    </NavigationSetting>);
  }
};
