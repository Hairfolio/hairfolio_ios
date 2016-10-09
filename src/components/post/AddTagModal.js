import {
  _, // lodash
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
  ActivityIndicator,
  Modal,
  ScrollView,
  StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import {appStack, createPost, onPress, postFilter, albumPage} from 'hairfolio/src/routes.js';

import AddTagStore from 'stores/AddTagStore.js'
import CreatePostStore from 'stores/CreatePostStore.js'

const SearchResultItem = observer(({item}) => {
  console.log('item', item.name);
  return (
    <TouchableHighlight
      underlayColor='#ccc'
      onPress={() => {
        CreatePostStore.gallery.addHashToPicture(
          CreatePostStore.gallery.position.x,
          CreatePostStore.gallery.position.y
        );
        AddTagStore.visibility = false;
      }}
    >
      <View
        style={{
          borderBottomWidth: h(1),
          borderColor: '#979797',
          justifyContent: 'center',
          height: h(86),
        }}>
        <Text style={{paddingLeft: 20, fontSize: h(28)}}>{item.name}</Text>
      </View>
    </TouchableHighlight>
  );
});

const SearchResults = observer(({store}) => {

  if (store.isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (store.items == null) {
    return <View />;
  } else if (store.items.length == 0) {
    return <View>
      <Text style={{flex: 1, textAlign: 'center', fontSize: h(40), marginTop: 25}} > No results found </Text>
    </View>
  }

  return <ScrollView bounces={false}>
    {store.items.map(el =>
        <SearchResultItem key={el.key} item={el} />
    )}
  </ScrollView>

});

const Header = observer(({store}) => {
  return (
    <View
      style = {{
        height: h(90),
        flexDirection: 'row',
        marginRight: h(16),
      }}
    >
      <TextInput
        onSubmitEditing={() => store.search()}
        style={{
          flex: 1,
          margin: h(16),
          height: h(60),
          fontSize: h(28),
          backgroundColor: '#E6E6E6',
          borderRadius: h(9),
          paddingHorizontal: h(16)
        }}
        returnKeyType='search'
        value={store.searchTerm}
        onChangeText={v => store.searchTerm = v}
        placeholder='Search Tag'
      />

    <TouchableOpacity
      style = {{
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onPress={() => store.visibility = false}
    >
      <Text
        style={{
          fontSize: h(34),
          fontFamily: FONTS.MEDIUM
        }}
      >Cancel</Text>
    </TouchableOpacity>
  </View>
  );
});


const AddTagModal = observer(() => {
  return (
    <Modal
      animationType='slide'
      style={{height: windowHeight, backgroundColor: 'white'}}
      visible={AddTagStore.visibility}
    >
      <Header store={AddTagStore} />

      <View style={{height: h(1), width: windowWidth, backgroundColor: '#979797'}} />
      <SearchResults store={AddTagStore} />
    </Modal>
  );
});

export default AddTagModal;
