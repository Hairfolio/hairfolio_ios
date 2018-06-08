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
  ListView,
  ActivityIndicator,
  Modal,
  ScrollView,
  PickerIOS, Picker, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'Hairfolio/src/helpers';
import NavigatorStyles from '../../common/NavigatorStyles';
import {STATUSBAR_HEIGHT} from 'Hairfolio/src/constants';
import TagPostStore from '../../mobx/stores/TagPostStore';
import SearchStore from '../../mobx/stores/SearchStore';
import GridView from '../GridView';
import GridPost from '../favourites/GridPost';
import SearchModeSearch from '../search/SearchModeSearch';
import {StatusBar} from 'react-native';

const MyFooter = observer(({store}) => {
  StatusBar.setBarStyle('dark-content', true); 
  if (store.nextPage != null || store.isLoading) {
    return (
      <View style={{flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size='large' />
      </View>
    )
  } else {
    return <View />;
  }
});

const TagFooter = observer(({store}) => {
  StatusBar.setBarStyle('dark-content', true); 
  if (store.nextPage != null) {
    return (
      <View style={{flex: 1,
        height: h(220),
        width: h(220),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
      }}>
        <ActivityIndicator size='large' />
      </View>
    )
  } else {
    return <View />;
  }
});


const SearchBar = observer(({store, navigator}) => {
  StatusBar.setBarStyle('dark-content', true); 
  return (
    <View
      style={{
        marginVertical: h(25),
        paddingHorizontal: h(15)
      }}
    >
      <TouchableWithoutFeedback
        onPress={() =>
          navigator.push({
            screen: 'hairfolio.SearchDetails',
            navigatorStyle: NavigatorStyles.tab,
            title: 'Search',
          })
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

const TagItem = observer(({store, navigator}) => {
  StatusBar.setBarStyle('dark-content', true); 
  return (
    <TouchableWithoutFeedback
      onPress={
        () => {
          TagPostStore.jump(
            store.name,
            `#${store.name}`,
            navigator,
          );
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
          source={store.picture.getSource(220, 220)} />
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

const TopTags = observer(({store, navigator}) => {
  StatusBar.setBarStyle('dark-content', true); 
  if (store.isLoading) {
    return (
      <View style={{height: h(220), justifyContent: 'center'}}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <View
      style={{
        height: h(220)
      }}
    >
    <ListView
      style = {{
        height: h(220)
      }}
      horizontal
      enableEmptySections
      dataSource={store.dataSource}
      renderRow={(el, i) => {
        return (
          <TagItem key={el.key} store={el} navigator={navigator}/>
        )
      }}
      renderFooter={
        () => <TagFooter store={store} navigator={navigator}/>
      }
      onEndReached={() => {
        store.loadNextPage();
      }} />
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
    </View>
  );
});

const PopularPostHeader = observer(({store}) => {
  StatusBar.setBarStyle('dark-content', true); 
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
      {/*<GridView store={store} emptyText='POPULAR TODAY' />*/}
    </View>
  );
});

const Search = observer(({navigator}) => {

  StatusBar.setBarStyle('dark-content', true);  

  if (!SearchStore.loaded) {
    return <View />;
  }

  return (
    <ListView
      style={{
        marginTop: 20,
        flex: 1,
      }}
      bounces={false}
      enableEmptySections
      dataSource={SearchStore.dataSource}
      renderRow={(el, i) => {
        if (el.type == 'searchBar') {
          return <SearchBar store={SearchStore} navigator={navigator}/>;
        } else if (el.type == 'topTags') {
          return <TopTags store={SearchStore.topTags} navigator={navigator}/>;
        } else if (el.type == 'popularPostHeader') {
          return <PopularPostHeader />;
        } else {
          return (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              <GridPost key={el[0].key} post={el[0]} navigator={navigator}/>
              {
                el[1] != null ?  <GridPost key={el[1].key} post={el[1]} navigator={navigator}/> :
                  <View
                    style = {{
                      width: windowWidth / 2,
                      height: windowWidth / 2,
                      backgroundColor: 'white'
                    }}
                  />
              }
            </View>
          );
        }
      }}
      renderFooter={
        () => <MyFooter store={SearchStore.popularPosts} navigator={navigator}/>
      }
      onEndReached={() => {
        SearchStore.popularPosts.loadNextPage();
      }}
    />
  );

});

export default Search;
