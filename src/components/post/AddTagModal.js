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
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'Hairfolio/src/helpers';

import {appStack, createPost, onPress, postFilter, albumPage} from 'Hairfolio/src/routes';

import AddTagStore from '../../mobx/stores/AddTagStore';
import CreatePostStore from '../../mobx/stores/CreatePostStore';
import KeyboardStore from '../../mobx/stores/KeyboardStore';

const SearchResultItem = observer(({item}) => {
  return (
    <TouchableHighlight
      underlayColor='#ccc'
      onPress={() => {

        CreatePostStore.gallery.addHashToPicture(
          CreatePostStore.gallery.position.x,
          CreatePostStore.gallery.position.y,
          item.name
         );

        AddTagStore.persistent = false

        // timeout because otherwise keyboar does not hide
        // personanal hack because
        setTimeout(() => {
          AddTagStore.visibility = false
          StatusBar.setHidden(false);
        }, 0);
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

  let myHeight = windowHeight - h(90) - KeyboardStore.height;
  if (store.isLoading) {
    return (
      <View style={{height: myHeight, alignItems: 'center', justifyContent: 'center'}}>
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


  return (<View
      style={{height: myHeight}}
    >
      <ScrollView
        bounces={false}
        style={{height: myHeight}}
      >
        {store.items.map(el =>
            <SearchResultItem key={el.key} item={el} />
        )}
      </ScrollView>
    </View>
  );
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
        autoCapitalize='none'
        persistent={store.persistent}
        ref={(el) => {
          store.textInput = el;
        }}
        onSubmitEditing={() => {
          if (store.searchTerm.length == 0) {
            Alert.alert('Error', 'The search term is empty!');
            return;
          }
          store.search();
        }}
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
      onPress={() => {
        store.persistent = false

        // timeout because otherwise keyboar does not hide
        // personanal hack because
        setTimeout(() => {
          store.visibility = false
          StatusBar.setHidden(false);
        }, 0);
      }}
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
