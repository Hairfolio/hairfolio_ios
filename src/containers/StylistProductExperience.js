import React, { Component } from 'react';
import _ from 'lodash';
import { toJS } from 'mobx';
import {OrderedMap, Map} from 'immutable';
import { observer } from 'mobx-react';
import {autobind} from 'core-decorators';
import {View, Text} from 'react-native';
import EnvironmentStore from '../mobx/stores/EnvironmentStore';
import UserStore from '../mobx/stores/UserStore';
import {COLORS, FONTS, SCALE} from '../style';
import SearchList from '../components/SearchList';
import LoadingContainer from '../components/LoadingContainer';
import whiteBack from '../../resources/img/nav_white_back.png';

@observer
export default class StylistProductExperience extends React.Component {
  static defaultProps = {
    title: 'Product Experience'
  };

  state = {};

  constructor(props) {
    super(props);
    EnvironmentStore.getExperiences(EnvironmentStore.experiencesNextPage);
    this.state = {
      selectedIds: toJS(UserStore.user.experiences.map(exp => exp.id)),
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  static navigatorButtons = {
    leftButtons: [
      {
        id: 'back',
        icon: whiteBack,
      }
    ],
    rightButtons: [
      {
        id: 'done',
        title: 'Done',
        buttonFontSize: SCALE.h(30),
        buttonColor: COLORS.WHITE,
      }
    ],
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.navigator.pop({
          animated: true,
          animationStyle: 'fade',
        })
      }
      if (event.id == 'done') {
        const formData = { experience_ids: this.state.selectedIds };
        UserStore.editUser(formData, UserStore.user.account_type)
        .catch((e) => {
          this.refs.ebc.error(e);
        });
        this.props.navigator.pop({
          animated: true,
          animationStyle: 'fade',
        })
      }
    }
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

  updateProductExperience = (selectedIds) => {
    this.setState({
      selectedIds: selectedIds,
    });
  }

  render() {
    let newExperiences = EnvironmentStore.experiences
      .filter((experience) => experience.id !== null)
      .map((obsExperience) => {
        let experience = toJS(obsExperience);
        if (this.state.selectedIds.find(currUsrExpId =>  currUsrExpId === experience.id)) {
          experience.selected = true;
        }
        return [experience.id, new Map(experience)];
      });
    let experiences = new OrderedMap(newExperiences);
    return (
      <SearchList
          items={experiences}
          placeholder="Search for products"
          updateSelectedIds = {this.updateProductExperience}
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
