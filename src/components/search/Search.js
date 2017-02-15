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
  ActivityIndicator,
  Modal,
  ScrollView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import {BOTTOMBAR_HEIGHT, STATUSBAR_HEIGHT} from 'hairfolio/src/constants.js';

import TagPostStore from 'stores/TagPostStore'

import SearchStore from 'stores/SearchStore';

import GridView from 'components/GridView.js';

import SearchModeSearch from 'components/search/SearchModeSearch.js'


import * as routes from 'hairfolio/src/routes.js'

const SearchBar = observer(({store}) => {
  return (
    <View
      style={{
        marginVertical: h(25),
        paddingHorizontal: h(15)
      }}
    >
      <TouchableWithoutFeedback
        onPress={() =>
          window.navigators[0].jumpTo(routes.searchDetails)
        }
      >
        <View
          style = {{
            backgroundColor: '#EDEEEE',
            flex: 1,
            height: h(58),
            borderRadius: h(7),
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <View
            style = {{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Image
              style={{height: h(24), width: h(24)}}
              source={require('img/search_logo.png')}
            />
            <Text
              style = {{
                marginLeft: h(14),
                fontSize: h(30),
                fontFamily: FONTS.OBLIQUE,
                color: '#9E9E9E',
                backgroundColor: 'transparent'
              }}
            >
              Search
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
});

const TagItem = observer(({store}) => {
  return (
    <TouchableWithoutFeedback
      onPress={
        () => {
          let name = store.name;
          TagPostStore.title = `#${name}`;
          TagPostStore.load(name);
          TagPostStore.back = () => {
            window.navigators[0].jumpTo(routes.appStack);
          }
          window.navigators[0].jumpTo(routes.tagPosts);
        }
      }
    >
      <View
        style = {{
          height: h(220),
          width: h(220)
        }}
      >
        <Image
          style={{height: h(220), width: h(220)}}
          source={store.picture.getSource(220)} />
        <Text
          style = {{
            width: h(220 - 2 * 13),
            position: 'absolute',
            bottom: 0,
            left: h(13),
            color: '#FCFAFA',
            fontFamily: FONTS.MEDIUM_OBLIQUE,
            fontSize: h(27),
            backgroundColor: 'transparent'
          }}
        >
          {'#' + store.name}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
});

const TopTags = observer(({store}) => {

  if (store.isLoading) {
    return (
      <View style={{height: h(220), justifyContent: 'center'}}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <ScrollView
      style = {{
        height: h(220),
      }}
      horizontal
      bounces={false}
    >
      {store.elements.map(e => <TagItem key={e.key} store={e} />)}
      <Text
        style = {{
          position: 'absolute',
          top: h(8),
          left: h(21),
          fontSize: h(28),
          color: '#FAF6F6',
          fontFamily: FONTS.MEDIUM_OBLIQUE,
          backgroundColor: 'transparent'
        }}
      >TOP TAGS </Text>
    </ScrollView>
  );



});

const PopularPosts = observer(({store}) => {
  return (
    <View>
      <View
        style = {{
          marginTop: h(25),
          height: h(90),
          backgroundColor: 'white',
          paddingLeft: h(17),
          justifyContent: 'center'
        }}
      >
        <Text
          style = {{
            color: '#BFBFBF',
            fontSize: h(28),
            fontFamily: FONTS.ROMAN
          }}
        >
          POPULAR POSTS
        </Text>

      </View>
      <GridView store={store} emptyText='POPULAR TODAY' />
    </View>

  );
});

const Search = observer(() => {

  return (
    <View style={{paddingTop: 20}}>
      <ScrollView style={{height: windowHeight - 20 - BOTTOMBAR_HEIGHT}}>
        <SearchBar store={SearchStore} />
        <TopTags store={SearchStore.topTags} />
        <PopularPosts store={SearchStore.popularPosts} />
      </ScrollView>
    </View>
  );

});

export default Search;
