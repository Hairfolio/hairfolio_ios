import React from 'react';
import _ from 'lodash';
import {OrderedMap, Map} from 'immutable';
import PureComponent from '../components/PureComponent';
import {autobind} from 'core-decorators';
import {View, Text} from 'react-native';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import {COLORS} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import SearchList from '../components/SearchList';

import LoadingContainer from '../components/LoadingContainer';

import {NAVBAR_HEIGHT} from '../constants';

export default class StylistProductExperience extends PureComponent {
  static propTypes = {
    backTo: React.PropTypes.object.isRequired,
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
    EnvironmentStore.getExperiences(EnvironmentStore.experiencesNextPage);
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
    if (EnvironmentStore.experiencesNextPage) {
      EnvironmentStore.getExperiences(EnvironmentStore.experiencesNextPage);
    }
  }

  render() {
    let newExperiences = EnvironmentStore.experiences
      .filter((experience) => experience.id !== null)
      .map(experience =>
        [experience.id, experience]
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
