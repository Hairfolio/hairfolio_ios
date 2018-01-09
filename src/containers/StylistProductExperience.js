import React from 'react';
import _ from 'lodash';
import {OrderedMap, Map} from 'immutable';
import PureComponent from '../components/PureComponent';
import {autobind} from 'core-decorators';
import {View, Text} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {environment} from '../selectors/environment';
import {COLORS} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import SearchList from '../components/SearchList';

import {throwOnFail} from '../lib/reduxPromiseMiddleware';

import LoadingContainer from '../components/LoadingContainer';

import {registrationActions} from '../actions/registration';

import {NAVBAR_HEIGHT} from '../constants';

@connect(app, environment)
export default class StylistProductExperience extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    backTo: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    experiences: React.PropTypes.object.isRequired,
    experiencesState: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  static defaultProps = {
    title: 'Product Experience'
  };

  state = {};

  @autobind
  onWillFocus() {
    this.props.dispatch(
      registrationActions.getExperiences(
        this.props.experiencesNextPage
      )
    );
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

  getNextPage() {
    if (this.props.experiencesNextPage) {
      this.props.dispatch(
        registrationActions.getExperiences(this.props.experiencesNextPage)
      )
    }
  }

  render () {
    let newExperiences = this.props.experiences
      .filter((experience) => Map.isMap(experience) && experience.has('id'))
      .map(experience =>
        [experience.get('id'), experience]
      );
    let experiences = new OrderedMap(newExperiences);
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
      title={this.props.title}
    >
      <SearchList
          items={experiences}
          placeholder="Search for products"
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
          onEndReached={this.getNextPage.bind(this)}
        />
    </NavigationSetting>);
  }
};
