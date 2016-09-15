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
export default class SalonSP extends PureComponent {
  static propTypes = {
    addSP: React.PropTypes.object.isRequired,
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

  renderSP(sp) {
    return (<TouchableOpacity
      onPress={() => {
        this.props.addSP.scene().setEditing(sp);
        _.last(this.context.navigators).jumpTo(this.props.addSP);
      }}
      style={{
        backgroundColor: COLORS.WHITE,
        padding: SCALE.w(25),
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <Text style={{
        fontFamily: FONTS.HEAVY,
        fontSize: SCALE.h(30),
        color: COLORS.DARK
      }}>{sp.get('service').get('name')}</Text>
      <Text style={{
        fontFamily: FONTS.ROMAN,
        fontSize: SCALE.h(30),
        color: COLORS.DARK2
      }}>{sp.get('price')}$</Text>
    </TouchableOpacity>);
  }

  renderContent() {
    var offerings = new OrderedMap(this.props.user.get('offerings').map(offerings => [offerings.get('id'), offerings]));

    console.log(this.props.user.get('offerings').count());

    return (<View style={{
      flex: 1
    }}>
      {!this.props.user.get('offerings').count() ?
        <Text style={{
          marginTop: SCALE.h(35),
          marginLeft: SCALE.w(25),
          marginRight: SCALE.w(25),
          fontFamily: FONTS.MEDIUM,
          fontSize: SCALE.h(26),
          color: COLORS.TEXT
        }}>No Services added yet</Text>
      :
        <SafeList
          dataSource={{offerings: offerings.toObject()}}
          dataSourceRowIdentities={[Array.from(offerings.keys())]}
          pageSize={10}
          renderRow={(sp) => this.renderSP(sp)}
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
        this.props.addSP.scene().setNew();
        _.last(this.context.navigators).jumpTo(this.props.addSP);
      }}
      rightLabel="Add"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT + SCALE.h(15)
      }}
      title="Services & Prices"
    >
      <LoadingContainer state={[this.props.userState]}>
        {() => this.renderContent()}
      </LoadingContainer>
    </NavigationSetting>);
  }
};
