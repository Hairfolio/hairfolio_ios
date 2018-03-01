import {
  _, // lodash
  v4,
  observable,
  computed,
  moment,
  action,
  observer, // mobx
  h,
  FONTS,
  autobind,
  React, // react
  Component,
  windowWidth,
  windowHeight,
  // react-native components
  AlertIOS,
  Modal,
  ActivityIndicator,
  ScrollView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'Hairfolio/src/helpers';

import {ListView} from 'react-native'

import GridPost from './favourites/GridPost'

const MyFooter = observer(({store}) => {

  if (store.nextPage != null) {
    return (
      <View style={{flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size='large' />
      </View>
    )
  } else {
    return <View />;
  }
});


const GridList = observer(({store, noElementsText, navigator}) => {

  if (store.isLoading) {
    return (
      <View style={{marginTop: 20}}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (store.elements.length == 0) {
    return (
      <View style={{flex: 1}}>
        <Text
          style= {{
            paddingTop: h(38),
            fontSize: h(34),
            textAlign: 'center',
            fontFamily: FONTS.BOOK_OBLIQUE
          }}
        >
          {noElementsText}
        </Text>
      </View>
    );
  }

  if (store.supportPaging) {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <ListView
          style = {{
            height: windowHeight - 83 - 50 - 53
          }}
          dataSource={store.dataSource}
          renderRow={(el, i) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap'
                }}
              >
                <GridPost key={el[0].key} post={el[0]} navigator={navigator} />
                {
                  el[1] != null ?  <GridPost key={el[1].key} post={el[1]} navigator={navigator} /> :
                    <View
                      style = {{
                        width: windowWidth / 2,
                        height: windowWidth / 2,
                        backgroundColor: 'white'
                      }}
                    />
                }
              </View>
            )
          }}
          renderFooter={
            () => <MyFooter store={store} />
          }
          onEndReached={() => {
            store.loadNextPage();
          }} />
      </View>
    );
  } else {
    return (
      <ScrollView>
        <View
          style = {{
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}
        >
          {store.elements.map(p => <GridPost key={p.key} post={p} navigator={navigator} />)}
        </View>
      </ScrollView>
    );
  }
});

export default GridList ;
