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
  ActivityIndicatorIOS,
  Modal,
  ScrollView,
  WebView,
  ActivityIndicator,

  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'Hairfolio/src/helpers.js';

import SlimHeader from 'components/SlimHeader.js'
import AlbumStore from 'stores/AlbumStore.js'
import CreatePostStore from 'stores/CreatePostStore.js'

import { FlatList} from 'react-native'

import {appStack, createPost, onPress, postFilter, albumPage, addServiceTwo, gallery} from '../routes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var RCTUIManager = require('NativeModules').UIManager;

import MyPicker from 'components/MyPicker.js'

import AddLinkStore from 'stores/AddLinkStore.js'


import ReactNative from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view'

import LinkTabBar from 'components/post/LinkTabBar.js'

const SearchBar = observer(({catalog}) => {
  return (
    <View
      style = {{
        height: h(90),
        backgroundColor: '#E6E6E6',
        flexDirection: 'row'
      }}>
      <View
        style={{
          flex: 1,
          padding: h(15)
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: 'white',
            paddingLeft: h(20),
            fontSize: h(28),
            borderRadius: h(9)
          }}
          value={catalog.searchText}
          onChangeText={v => catalog.searchText = v}
          placeholder='Search Catalog'
        />
      </View>
      <View
        style={{
          width: h(160),
          padding: h(16),
          paddingLeft: 0,
        }}
      >
        <TouchableOpacity
          onPress={() => catalog.search()}
          style={{
            flex: 1,
            backgroundColor: '#8D8D8D',
            borderRadius: h(9),
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              color: '#E6E6E6',
            }}
          >
            Search
          </Text>
        </TouchableOpacity>

      </View>

    </View>

  );
});

const CatalogResultItem = observer(({item}) => {
  return (
    <TouchableHighlight
      underlayColor='#ccc'
      onPress={() => {
        CreatePostStore.gallery.addLinkToPicture(
          CreatePostStore.gallery.position.x,
          CreatePostStore.gallery.position.y,
          item
        );
        _.last(window.navigators).jumpTo(gallery);
      }}
    >
      <View
        style={{
          borderBottomWidth: h(1),
          borderColor: '#979797',
          alignItems: 'center',
          height: h(172),
          flexDirection: 'row'
        }}>
        <Image
          source={{uri: item.imageUrl}}
          style={{height: h(150), width: h(150), marginLeft: h(11) }}
        />
        <Text
          style={{paddingLeft: 20, flex:1, fontSize: h(28)}}>
          {item.name}
        </Text>
      </View>
    </TouchableHighlight>
  );
});

const CatalogResults = observer(({catalog}) => {

  if (catalog.isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (catalog.items == null) {
    return <View />;
  } else if (catalog.items.length == 0) {
    return (
      <View>
        <Text style={{flex: 1, textAlign: 'center', fontSize: h(40), marginTop: 25}} > No results found </Text>
      </View>
    )
  }

  return (
    <FlatList
      data={catalog.items}
      renderItem={({item}) => <CatalogResultItem key={item.key} item={item} /> }


      onEndReached={() => {
        catalog.loadNextPage();
      }}

      ListFooterComponent={() => {
        if (catalog.nextPage != null) {
          return (
            <View
              style={{
                height: h(172),
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <ActivityIndicator size='large' />
            </View>
          );
        } else {
          return <View />;
        }
      }}
    />
  )
});

const CatalogPage = observer(() => {
  return (
    <View style={{flex: 1}}>
      <SearchBar catalog={AddLinkStore.catalog} />
      <CatalogResults catalog={AddLinkStore.catalog} />
    </View>
  );
});

const BrowseFooter = observer(() => {
  return (
    <View
      style={{
        height: h(100),
        backgroundColor: '#3E3E3E',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'

      }}
    >
      <TouchableOpacity
        onPress={() => window.webview.goBack()}
        style={{width: h(70), justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('img/post_browse_arrow_left.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          CreatePostStore.gallery.addLinkToPicture(
            CreatePostStore.gallery.position.x,
            CreatePostStore.gallery.position.y,
            {name: AddLinkStore.browse.title, linkUrl: AddLinkStore.browse.link}
          );
          _.last(window.navigators).jumpTo(gallery);
        }}
        style={{
          backgroundColor: 'white',
          borderRadius: h(10),
          flex: 1,
          height: h(60),
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        <Image
          style={{
            height: h(26),
            width: h(24),
            marginRight: h(10)
          }}
          source={require('img/post_link_off.png')}
        />
        <Text
          style={{
            fontSize: h(30),
            color: '#3E3E3E'
          }}>ADD LINK TAG</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => window.webview.goForward()}
        style={{width: h(70), justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('img/post_browse_arrow_right.png')}
        />
      </TouchableOpacity>
    </View>
  );
});

const BrowsePage = observer(() => {

  let browse = AddLinkStore.browse;

  return (
    <View style={{flex: 1}}>
      <WebView
        ref={webview => window.webview = webview}
        source={{uri: 'http://www.google.com'}}
        style={{flex: 1}}
        onLoad={({nativeEvent}) => {
          browse.title = nativeEvent.title;
          browse.link = nativeEvent.url;
        }}
      />
    <BrowseFooter />
  </View>
  );
});

const ManualTextField = observer(({item, placeholder, style}) => {
  return (
    <View
      style={{
        height: h(70),
        borderBottomWidth: h(1),
        borderColor: '#979797',
        ...style
      }}
    >
    <TextInput
      style={{flex: 1, height: h(70), fontSize: h(28), fontFamily: FONTS.BOOK}}
      value={item.val}
      onChangeText={v => item.val = v}
      placeholder={placeholder} />
  </View>

  );
});

const ManualPage = observer(() => {

  let manual = AddLinkStore.manual;

  return (
    <View style={{marginTop: 30, paddingHorizontal: h(40)}}>
      <ManualTextField
        placeholder='Product Name'
        item={manual.title} />


      <ManualTextField
        style={{marginTop: 10}}
        placeholder='Product Name URL'
        item={manual.link} />

      <TouchableOpacity
        style={{
          marginTop: 30,
          height: h(86),
          backgroundColor: '#3E3E3E',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: h(86),
        }}
        onPress={() => {
          if (manual.title.val.length > 0 && manual.link.val.length > 0) {
            let data = {
              name: manual.title.val,
              linkUrl: manual.link.val
            };
            CreatePostStore.gallery.addLinkToPicture(
              CreatePostStore.gallery.position.x,
              CreatePostStore.gallery.position.y,
              data
            );
            _.last(window.navigators).jumpTo(gallery);
          } else {
            alert('Fill out all the fields');
          }
        }
        }
      >
        <Text style={{color: 'white'}}>Add</Text>

      </TouchableOpacity>


      {/*
      <View
        style={{
          height: h(30),
          marginTop: 30,
          borderBottomWidth: h(1),
          borderColor: '#979797'
        }}
      >
        <TextInput
          style={{fontSize: h(28), fontFamily: FONTS.BOOK}}
          value={manual.link}
          onChangeText={l => manual.link = l}
          placeholder='Product Page URL' />
      </View>
      */}

     </View>
  );
});

@observer
@autobind
export default class AddLink extends Component {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {

    window.navigators = this.context.navigators;
    let store = AddLinkStore;


    return (
        <View style={{paddingTop: 20, flex: 1, backgroundColor: 'white'}}>
          <SlimHeader
            leftText='Back'
            onLeft={() => {
              _.last(window.navigators).jumpTo(gallery);
            }}
            title='Add Link'
            titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
            onRight={() => {
            }}
          />
          <View
            style={{
              height: h(1),
              backgroundColor: '#979797'
            }} />
          <ScrollableTabView
            renderTabBar={() => <LinkTabBar />}
            initialPage={1}
          >
            <CatalogPage tabLabel="Catalog" />
            <BrowsePage tabLabel="Browse" />
            <ManualPage tabLabel="Manual" />
          </ScrollableTabView>

        </View>
    );
  }
}
