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
  ActivityIndicator,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import {BOTTOMBAR_HEIGHT, STATUSBAR_HEIGHT} from 'hairfolio/src/constants.js';
import FollowUserList from 'components/FollowUserList.js'

import TagPostStore from 'stores/TagPostStore.js'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import LinkTabBar from 'components/post/LinkTabBar.js'

import * as routes from 'hairfolio/src/routes.js'

import SearchDetailsStore from 'stores/search/SearchDetailsStore'

const SearchHeader = observer(() => {
  return (
    <View
      style = {{
        backgroundColor: '#3E3E3E',
        height: h(136),
        paddingTop: 20
      }}
    >
      <View
        style = {{
          flexDirection: 'row',
          padding: h(15),
        }}
      >

      <View
        style = {{
          height: h(58),
          backgroundColor: 'white',
          borderRadius: 9,
          flexDirection: 'row',
          paddingLeft: h(23),
          flex: 1,
          alignItems: 'center'
        }}
      >
        <Image
          style={{height: h(24), width: h(24), marginRight: h(23)}}
          source={require('img/search_logo.png')}
        />
        <TextInput
          autoCorrect={false}
          returnKeyType='search'
          value={SearchDetailsStore.searchString}
          onSubmitEditing={
            () => {
              SearchDetailsStore.search();
            }
          }
          onChangeText={text => {
            SearchDetailsStore.searchString = text;
          }}
          ref={el => {
            SearchDetailsStore.input = el;
            window.myInput = el;
          } }
          placeholder='Search'
          style={{
            flex: 1,
            fontSize: h(30)
          }}

        />

      <TouchableOpacity
        onPress={() =>{
          SearchDetailsStore.searchString = '';
        }}
      >
        <View
          style = {{
            paddingRight: h(23),
            justifyContent: 'center',
            height: h(58)
          }}
        >
          <Image
            style={{height: h(30), width: h(30)}}
            source={require('img/search_clear.png')}
          />
        </View>
      </TouchableOpacity>
    </View>


    <TouchableOpacity
      onPress={() => window.navigators[0].jumpTo(routes.appStack)}
    >
      <Text
        style = {{
          fontSize: h(34),
          fontFamily: FONTS.ROMAN,
          color: 'white',
          backgroundColor: 'transparent',
          marginLeft: h(15),
          marginTop: h(7)
        }}
      >
        Cancel
      </Text>
    </TouchableOpacity>
  </View>
</View>
  );
});

const StylistSearch = observer(({store}) => {
  return (
    <FollowUserList
      store={store}
      noResultText='Nothing was found'
    />
  );

});



const TagItem = observer(({item}) => {
  return (
    <TouchableHighlight
      underlayColor='#ccc'
      onPress={
        () => {
          console.log('onPress');
          let name = item.name.substring(1);
          TagPostStore.title = `#${name}`;
          TagPostStore.load(name);
          TagPostStore.back = () => {
            SearchDetailsStore.dontReset = true;
            window.navigators[0].jumpTo(routes.searchDetails);
          }
          window.navigators[0].jumpTo(routes.tagPosts);
        }
      }
    >
      <View
        style={{
          borderBottomWidth: h(1),
          borderColor: '#979797',
          justifyContent: 'center',
          height: h(86),
        }}
      >
        <Text style={{paddingLeft: 20, fontSize: h(28)}}>{item.name}</Text>
      </View>
    </TouchableHighlight>
  );
})

const TagSearch = observer(({store}) => {

  if (store.tags.length == 0) {
    return (
      <Text
        style= {{
          paddingTop: h(38),
          fontSize: h(34),
          textAlign: 'center',
          fontFamily: FONTS.BOOK_OBLIQUE
        }}
      >
        Nothing was found.
      </Text>
    );
  }


  return (
    <ScrollView>
      {store.tags.map(e => <TagItem key={e.key} item={e} />)}
    </ScrollView>
  );
});



const NearbySearch = observer(({store}) => {
  return (
    <FollowUserList
      store={store}
      noResultText='Nothing was found'
    />
  );

});

const SalonSearch = observer(({store}) => {
  return (
    <FollowUserList
      store={store}
      noResultText='Nothing was found'
    />
  );

});

const BrandSearch = observer(({store}) => {
  return (
    <FollowUserList
      store={store}
      noResultText='Nothing was found'
    />
  );
});

let SearchPage = (Class, store, props) => observer(() => {

  if (store.isLoading) {
    return <ActivityIndicator size='large' style={{marginTop: 20}}/>;
  }

  if (!store.wasLoaded) {
    return (
      <Text
        style= {{
          paddingTop: h(38),
          fontSize: h(34),
          textAlign: 'center',
          fontFamily: FONTS.BOOK_OBLIQUE
        }}
      >
        Nothing was searched for yet.
      </Text>
    );
  } else {
    return  <Class store={store} {...props} />
  }
})


const SearchDetailsElement = observer(() => {

  const StylistPage = SearchPage(StylistSearch, SearchDetailsStore.stylistStore);
  const TagPage = SearchPage(TagSearch, SearchDetailsStore.hashStore);
  const SalonPage = SearchPage(SalonSearch, SearchDetailsStore.salonStore);
  const BrandPage = SearchPage(BrandSearch, SearchDetailsStore.brandStore);
  const NearbyPage = SearchPage(NearbySearch, SearchDetailsStore.nearbyStore);

  return (
    <View style={{height: windowHeight}}>
      <SearchHeader />
        <ScrollableTabView
          renderTabBar={() => <LinkTabBar />}
          initialPage={0}
        >
          <StylistPage tabLabel='Stylists' />
          <TagPage tabLabel='Tags' />
          <SalonPage tabLabel='Salon' />
          <BrandPage tabLabel='Brand' />
          <NearbyPage tabLabel='Nearby' />
        </ScrollableTabView>
    </View>
  );
});

export default SearchDetailsElement;
