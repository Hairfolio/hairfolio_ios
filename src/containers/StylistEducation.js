import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {List, OrderedMap} from 'immutable';
import {View, Text, StyleSheet} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import SafeList from '../components/SafeList';

import {NAVBAR_HEIGHT} from '../constants';
import {stylistAddEducation} from '../routes';

@connect(app, user)
export default class StylistEducation extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired
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
    return (<View style={{
      backgroundColor: COLORS.WHITE,
      padding: SCALE.w(25)
    }}>
      <Text style={{
        fontFamily: FONTS.HEAVY,
        fontSize: SCALE.h(30),
        color: COLORS.DARK
      }}>{education.get('school_name')}</Text>
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
    </View>);
  }

  render() {
    var education = new OrderedMap(this.props.user.get('education').map(education => [education.get('id'), education]));

    return (<NavigationSetting
      forceUpdateEvents={['login', 'user-edited']}
      leftAction={() => {
        _.last(this.context.navigators).jumpBack();
      }}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      rightAction={() => {
        _.last(this.context.navigators).jumpTo(stylistAddEducation);
      }}
      rightLabel="Add"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT + SCALE.h(15)
      }}
      title="Education"
    >
      <View style={{
        flex: 1
      }}>
        {!(this.props.user.get('education') || List([])).count() ?
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
            dataSourceRowIdentities={[Array.from(education.keys())]}
            pageSize={10}
            renderRow={(education) => this.renderEducation(education)}
            renderSeparator={(sId, rId) => <View key={`sep_${sId}_${rId}`} style={{height: StyleSheet.hairlineWidth, backgroundColor: 'transparent'}} />}
            style={{
              flex: 1,
              backgroundColor: 'transparent'
            }}
          />
        }
      </View>
    </NavigationSetting>);
  }
};
