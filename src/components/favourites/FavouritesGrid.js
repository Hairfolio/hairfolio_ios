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
} from 'hairfolio/src/helpers.js';

import FavoriteStore from 'stores/FavoriteStore';
import GridPost from 'components/favourites/GridPost'

const FavouritesGrid = observer(() => {

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
    <ScrollView>
      <View
        style = {{
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}
      >
    {store.elements.map(p => <GridPost key={p.key} post={p} />)}
    </View>
    </ScrollView>
  );
});

export default FavouritesGrid;
