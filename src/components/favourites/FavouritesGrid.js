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
  ListView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'Hairfolio/src/helpers';

import FavoriteStore from '../../mobx/stores/FavoriteStore';
import GridPost from './GridPost';

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

const FavouritesGrid = observer(({navigator,from}) => {

  let store = FavoriteStore;

  if (store.isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
          No posts have been starred yet.
        </Text>
      </View>
    );
  }

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
              <GridPost key={el[0].key} post={el[0]} navigator={navigator} from={from}/>
              {
                el[1] != null ?  <GridPost key={el[1].key} post={el[1]} navigator={navigator} from={from}/> :
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
});

export default FavouritesGrid;
