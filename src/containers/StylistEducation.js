import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {List, OrderedMap} from 'immutable';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import UserStore from '../mobx/stores/UserStore';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import SafeList from '../components/SafeList';
import LoadingContainer from '../components/LoadingContainer';

import {NAVBAR_HEIGHT} from '../constants';

@observer
export default class StylistEducation extends PureComponent {
  static propTypes = {
    addEducation: React.PropTypes.object.isRequired,
    backTo: React.PropTypes.object.isRequired,
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

  renderEducation(education) {

    return (<TouchableOpacity
      onPress={() => {
        this.props.addEducation.scene().setEditing(education);
        _.last(this.context.navigators).jumpTo(this.props.addEducation);
      }}
      style={{
        backgroundColor: COLORS.WHITE,
        padding: SCALE.w(25)
      }}
    >
      <Text style={{
        fontFamily: FONTS.HEAVY,
        fontSize: SCALE.h(30),
        color: COLORS.DARK
      }}>{education.name}</Text>
      <Text style={{
        fontFamily: FONTS.ROMAN,
        fontSize: SCALE.h(30),
        color: COLORS.DARK2
      }}>{education.degree.name}</Text>
      <Text style={{
        fontFamily: FONTS.BOOK,
        fontSize: SCALE.h(30),
        color: COLORS.LIGHT3
      }}>{education.year_from} - {education.year_to}</Text>
    </TouchableOpacity>);
  }

  renderContent() {
    const user = toJS(UserStore.user);
    var education = new OrderedMap(user.educations.map(education => [education.id, education]));

    window.user = user;
    return (<View style={{
      flex: 1
    }}>
      {!user.educations.length === 0 ?
        <Text style={{
          marginTop: SCALE.h(35),
          marginLeft: SCALE.w(25),
          marginRight: SCALE.w(25),
          fontFamily: FONTS.MEDIUM,
          fontSize: SCALE.h(26),
          color: COLORS.TEXT
        }}>No Education added</Text>
      :
        <SafeList
          dataSource={{education: education.toObject()}}
          pageSize={10}
          renderRow={(education) => this.renderEducation(education)}
          renderSeparator={(sId, rId) => <View key={`sep_${sId}_${rId}`} style={{height: StyleSheet.hairlineWidth, backgroundColor: 'transparent'}} />}
          style={{
            flex: 1,
            backgroundColor: 'transparent'
          }}
        />
      }
    </View>);
  }

  render() {
    return (<NavigationSetting
      forceUpdateEvents={['login', 'user-edited']}
      leftAction={() => {
        _.last(this.context.navigators).jumpTo(this.props.backTo);
      }}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      rightAction={() => {
        this.props.addEducation.scene().setNew();
        _.last(this.context.navigators).jumpTo(this.props.addEducation);
      }}
      rightLabel="Add"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT + SCALE.h(15)
      }}
      title="Education"
    >
      <LoadingContainer state={[UserStore.userState]}>
        {() => this.renderContent()}
      </LoadingContainer>
    </NavigationSetting>);
  }
};
