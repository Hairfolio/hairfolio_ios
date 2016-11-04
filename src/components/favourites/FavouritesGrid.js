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
  ScrollView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import FavoriteStore from 'stores/FavoriteStore';
import GridPost from 'components/favourites/GridPost'

const FavouritesGrid = observer(() => {

  let store = FavoriteStore;
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
