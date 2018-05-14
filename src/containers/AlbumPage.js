import React, { Component } from 'react'
import { ScrollView, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import {h, FONTS} from '../style';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import SlimHeader from '../components/SlimHeader';
import AlbumStore from '../mobx/stores/AlbumStore';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import _ from 'lodash';

const AlbumRow = observer(({text, uri, onPress}) => {
  return (
    <View>
    <TouchableHighlight
      onPress={onPress}
    >
      <View
        style = {{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center'
        }}
      >
        <Image
          style={{height: h(88), width: h(88), margin: h(9)}}
          source={{uri: uri}}
        />
        <Text
          style = {{
            fontSize: h(32),
            marginHorizontal: h(16)
          }}
        > {text}
        </Text>
      </View>
    </TouchableHighlight>
    <View
      style={{
        height: h(1),
        backgroundColor: '#D3D3D3',
      }} />
  </View>

  );
});

const AlbumHeader = observer(({onLeft, leftText, title, rightText}) => {
  return (
    <View
      style={{
        height: h(88),
        paddingHorizontal: h(25),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: h(1),
        borderColor: '#D3D3D3'
      }}
    >
      <TouchableOpacity
        onPress={onLeft}
        style={{flex: 1}}>
        <Text style={{
          fontSize: h(34),
          color: '#B5B5B5',
          fontFamily: FONTS.MEDIUM}} >
          {leftText}
        </Text>
      </TouchableOpacity>
      <View style={{flex: 2}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: h(34),
            fontFamily: FONTS.SF_REGULAR}}>
            {title}
          </Text>
        </View>
        <TouchableOpacity
          style={{flex: 1}}>
          <Text style={{
            fontSize: h(34),
            textAlign: 'right',
            fontFamily: FONTS.SF_REGULAR}} >
            {rightText}
          </Text>
        </TouchableOpacity>
      </View>
  );
});

@observer
@autobind
export default class AlbumPage extends Component {
  renderAlbumRow(el) {
    return (
      <AlbumRow
        text={el.text}
        onPress={() => {
          CreatePostStore.changeGroupName(el.title);
          this.props.navigator.pop({ animated: true });
        }}
        uri={el.uri}
        key={el.key}
      />
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <AlbumHeader
          leftText='Cancel'
          title='Change Album'
          onLeft={() => this.props.navigator.pop({ animated: true })}
        />
        <ScrollView>
        {AlbumStore.albums.map((el) => this.renderAlbumRow(el))}
      </ScrollView>
      </View>
    );
  }
}
