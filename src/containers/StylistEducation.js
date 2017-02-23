import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {List, OrderedMap} from 'immutable';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import SafeList from '../components/SafeList';
import LoadingContainer from '../components/LoadingContainer';

import {NAVBAR_HEIGHT} from '../constants';

@connect(app, user)
export default class StylistEducation extends PureComponent {
  static propTypes = {
    addEducation: React.PropTypes.object.isRequired,
    appVersion: React.PropTypes.string.isRequired,
    backTo: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
    userState: React.PropTypes.string.isRequired
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
      }}>{education.get('name')}</Text>
      <Text style={{
        fontFamily: FONTS.ROMAN,
        fontSize: SCALE.h(30),
        color: COLORS.DARK2
      }}>{education.get('degree').get('name')}</Text>
      <Text style={{
        fontFamily: FONTS.BOOK,
        fontSize: SCALE.h(30),
        color: COLORS.LIGHT3
      }}>{education.get('year_from')} - {education.get('year_to')}</Text>
    </TouchableOpacity>);
  }

  renderContent() {
    var education = new OrderedMap(this.props.user.get('educations').map(education => [education.get('id'), education]));

    window.user = this.props.user;

    return (<View style={{
      flex: 1
    }}>
      {!this.props.user.get('educations').count() ?
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
      <LoadingContainer state={[this.props.userState]}>
        {() => this.renderContent()}
      </LoadingContainer>
    </NavigationSetting>);
  }
};
