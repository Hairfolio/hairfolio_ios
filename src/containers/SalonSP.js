import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import {List, OrderedMap} from 'immutable';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import UserStore from '../mobx/stores/UsersStore';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import SafeList from '../components/SafeList';
import LoadingContainer from '../components/LoadingContainer';

import {NAVBAR_HEIGHT} from '../constants';

export default class SalonSP extends PureComponent {
  static propTypes = {
    addSP: React.PropTypes.object.isRequired,
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

  renderSP(sp) {
    window.sp = sp;
    return (<TouchableOpacity
      onPress={() => {
        this.props.addSP.scene().setEditing(sp.offering);
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
      }}>{sp.service.name}</Text>
      <Text style={{
        fontFamily: FONTS.ROMAN,
        fontSize: SCALE.h(30),
        color: COLORS.DARK2
      }}>${sp.price}</Text>
    </TouchableOpacity>);
  }

  renderContent() {
    window.myuser = UserStore.user;
    var offerings = new OrderedMap(UserStore.user.offerings.map(offerings => [offerings.id, offerings]));

    return (<View style={{
      flex: 1
    }}>
      {!UserStore.user.offerings.count() ?
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
      <LoadingContainer state={[UserStore.userState]}>
        {() => this.renderContent()}
      </LoadingContainer>
    </NavigationSetting>);
  }
};
