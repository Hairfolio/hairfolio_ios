import React, { Component } from 'react';
import _ from 'lodash';
import {debounce} from 'core-decorators';
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from './Icon';
import SafeList from './SafeList';

import {COLORS, FONTS, SCALE} from '../style';

export default class SearchList extends React.Component {
  static propTypes = {
    items: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func,
    placeholder: React.PropTypes.string.isRequired
  };

  state = {
    search: '',
    selected: []
  };

  componentWillMount() {
    this.setItems(this.props.items);
  }

  getValue() {
    return this.state.items.filter(item => item.get('selected')).map(item => item.get('id')).toArray();
  }

  setItems(items) {
    this.setState({items});
    this.props.updateSelectedIds(
      items.filter(item => item.get('selected'))
      .map(item => item.get('id'))
      .toArray());
  }

  clear() {
    this.setItems(this.state.items.map(item => {
      if (!item.get('selected'))
        return item;

      return item.set('selected', false);
    }));

    this.setState({search: ''}, () => this.filter());
  }

  onChange() {
    if (this.props.onChange)
      this.props.onChange(this.state.items);
  }

  setSelected(selectedIds) {
    var items = this.state.items;
    _.each(selectedIds, (id) => {
      items = items.setIn([id, 'selected'], true);
    });
    this.setItems(items);
  }

  @debounce
  filter() {
    this.setItems(this.state.items.map(item => {
      var isFilteredOut = item.get('name').toLowerCase().indexOf(this.state.search.toLowerCase()) === -1;

      if (item.get('isFilteredOut') !== isFilteredOut)
        return item.set('isFilteredOut', isFilteredOut);

      return item;
    }));
  }

  renderItem(item) {
    return (<TouchableOpacity
      key={item.get('name')}
      onPress={() => {
        this.setItems(this.state.items.setIn([item.get('id'), 'selected'], !item.get('selected')));
      }}
      style={{
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: SCALE.h(86),
        paddingLeft: SCALE.w(16),
        paddingRight: SCALE.w(16)
      }}
    >
      <Text style={{
        fontFamily: FONTS.ROMAN,
        fontSize: SCALE.h(28),
        color: COLORS.SEARCH_LIST_ITEM_COLOR
      }}>{item.get('name')}</Text>
      {item.get('selected') && <Icon
        color={COLORS.SEARCH_LIST_ITEM_COLOR}
        name="check"
        size={SCALE.h(28)}
      />}
    </TouchableOpacity>);
  }

  render() {
    var items = this.state.items.filter(item => !item.get('isFilteredOut'));

    return (<View
      {...this.props}
    >
      <View style={{
        height: SCALE.h(86),
        backgroundColor: COLORS.BACKGROUND_SEARCH_FIELD,
        justifyContent: 'center',
        paddingLeft: SCALE.w(16),
        paddingRight: SCALE.w(16)
      }}>
        <View style={{position: 'relative'}}>
          <TextInput
            onBlur={() => {
              this.setState({focus: false});
            }}
            onChangeText={(search) => {
              this.setState({search}, () => this.filter());
            }}
            onFocus={() => {
              this.setState({focus: true});
            }}
            selectionColor={COLORS.LIGHT2}
            style={{
              backgroundColor: 'white',
              borderWidth: 0,
              height: SCALE.h(58),
              borderRadius: SCALE.h(9),
              color: COLORS.DARK,
              textAlign: 'center',
              fontFamily: FONTS.ROMAN
            }}
            value={this.state.search}
          />
          {!this.state.search && !this.state.focus && <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              backgroundColor: 'transparent'
            }}
          >
            <Icon
              color={COLORS.PLACEHOLDER_SEARCH_FIELD}
              name="loupe"
              size={SCALE.h(26)}
            />
            <Text style={{
              color: COLORS.PLACEHOLDER_SEARCH_FIELD,
              textAlign: 'center',
              backgroundColor: 'transparent',
              fontSize: SCALE.h(30),
              marginLeft: 6,
              fontFamily: FONTS.ROMAN
            }}>{this.props.placeholder}</Text>
          </View>}
        </View>
      </View>
      <SafeList
        dataSource={{items: items.toObject()}}
        dataSourceRowIdentities={[Array.from(items.keys())]}
        pageSize={10}
        renderRow={(item) => this.renderItem(item)}
        renderSeparator={(sId, rId) => <View key={`sep_${sId}_${rId}`} style={{height: StyleSheet.hairlineWidth, backgroundColor: 'transparent'}} />}
        style={{
          flex: 1,
          backgroundColor: 'transparent'
        }}
        onEndReached={this.props.onEndReached}
      />
    </View>);
  }
}
