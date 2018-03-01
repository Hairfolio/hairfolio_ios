import React from 'react';
import _ from 'lodash';
import {OrderedMap, Map} from 'immutable';
import { observer } from 'mobx-react';
import PureComponent from '../components/PureComponent';
import {autobind} from 'core-decorators';
import {View, Text} from 'react-native';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import {COLORS} from '../style';
import SearchList from '../components/SearchList';
import LoadingContainer from '../components/LoadingContainer';
import whiteBack from '../../resources/img/nav_white_back.png';

@observer
export default class StylistProductExperience extends PureComponent {
  static defaultProps = {
    title: 'Product Experience'
  };

  state = {};

  constructor(props) {
    super(props);
    EnvironmentStore.getExperiences(EnvironmentStore.experiencesNextPage);
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
    return (
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
            flex: 1,
            backgroundColor: COLORS.LIGHT,
          }}
          onEndReached={this.getNextPage.bind(this)}
        />
    );
  }
};
