import React, { Component } from 'react'
import {Dimensions, ListView, ScrollView, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native'


import {COLORS, FONTS, h, SCALE} from 'hairfolio/src/style';


import {
  windowWidth,
  windowHeight,
} from 'hairfolio/src/helpers.js';


import {observer} from 'mobx-react/native'
import autobind from 'autobind-decorator'
import CreatePostStore from 'stores/CreatePostStore.js'

const EmptyPicture = observer(() => {
  return (
    <View
      style={{
        width: windowWidth / 4,
        height: windowWidth / 4
      }}
    />
  );
});

const SelectedBorder = observer(({width, picture}) => {
  if (picture.selectedNumber == null) {
    return <View />;
  }

  return (
    <View style={{
      position: 'absolute',
      width: width - 1,
      height: width - 1,
      top: 0,
      left: 0,
      borderColor: '#3E3E3E',
      borderWidth: h(7)
    }}>
    <View
      style={{
        position: 'absolute',
        width: 25,
        height: 20,
        backgroundColor: '#3E3E3E',
        top: 0,
        right: 0,
        borderBottomLeftRadius: h(8),
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: h(7),
        paddingTop: 3,
        paddingRight: 3
      }}
    >
    <Text
      style={{
        color: '#F0F0F0',
        fontSize: h(24)
      }}>
      {picture.selectedNumber}
    </Text>
  </View>
</View>

  );
});

const LibraryPicture = observer(({picture}) => {
  let width = Dimensions.get('window').width / 4;


  return (
    <TouchableWithoutFeedback
      onPress={() => picture.select()}
    >
      <View
        style={{
          height: width,
          width: width
        }}
      >
        <Image
          style={{
            borderColor: '#F0F0F0',
            borderWidth: 1,
            backgroundColor: '#F0F0F0',
            height: width,
            width: width}}
            source={{uri: picture.uri}}
            onLoadEnd={() => CreatePostStore.imageLoaded()}
          />
          <SelectedBorder
            picture={picture}
            width={width}
          />
          <Text
            style={{
              position: 'absolute',
              bottom: 5,
              right: 5,
              color: 'white',
              backgroundColor: 'transparent'
            }}
          >
            {picture.timeText}
          </Text>
        </View>
      </TouchableWithoutFeedback>
  );
    // }
});

const LibraryListView = observer(({store}) => {
  /*
  return (
    <ScrollView
      bounces={false}
      style={{height: Dimensions.get('window').height - 2 * (h(88) + Dimensions.get('window').width), width: Dimensions.get('window').width, backgroundColor: '#F0F0F0'}}>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {store.libraryPictures.map((el) => <LibraryPicture picture={el} key={el.key} />)}
      </View>
    </ScrollView>
  );
  */

  return (
    <ListView
      bounces={false}
      style={{
        height: Dimensions.get('window').height - 2 * (h(88) + Dimensions.get('window').width),
        width: Dimensions.get('window').width,
        backgroundColor: '#F0F0F0'
      }}
      dataSource={store.libraryDataSource}
      renderRow={(el, i) =>
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <LibraryPicture key={el[0].key} picture={el[0]} />
          {el[1] == null ? <EmptyPicture  /> : <LibraryPicture key={el[1].key} picture={el[1]} /> }
          {el[2] == null ? <EmptyPicture  /> : <LibraryPicture key={el[2].key} picture={el[2]} /> }
          {el[3] == null ? <EmptyPicture  /> : <LibraryPicture key={el[3].key} picture={el[3]} /> }
        </View>
      }
    />
  );
});

export default LibraryListView;
