import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../helpers';
import AlbumStore from '../mobx/stores/AlbumStore';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import CreateLogStore from '../mobx/stores/CreateLogStore';
import { FONTS, h } from '../style';
var { height, width } = Dimensions.get('window');

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
        backgroundColor: COLORS.LIGHT_GRAY1,
      }} />
  </View>

  );
});

const AlbumHeader = observer(({onLeft, leftText, title, rightText}) => {
  return (
    <View
      style={{
        // height: h(88),
        height:(height > 800) ? h(88) + 40 : h(88) + 20,
        paddingHorizontal: h(25),
        flexDirection: 'row',
        // alignItems: 'center',
        alignItems: 'flex-end',
        borderBottomWidth: h(1),
        borderColor: COLORS.LIGHT_GRAY1
      }}
    >
    <View style={{height:50, width:width,
                  flexDirection: 'row',
                  alignItems: 'center'}}>
      <TouchableOpacity
        onPress={onLeft}
        style={{flex: 1}}>
        <Text style={{
          fontSize: h(34),
          color: COLORS.LIGHT3,
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
          // alert(JSON.stringify(this.props.fromScreen))
          if (this.props.fromScreen == 'CreateLogScreen') {
            CreateLogStore.changeGroupName(el.title);
            this.props.navigator.pop({ animated: true });
            
          }
          else {            
            CreatePostStore.changeGroupName(el.title);
            this.props.navigator.pop({ animated: true });
          }
        }}
        uri={el.uri}
        key={el.key}
      />
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
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
