import { ActivityIndicator, FONTS, h, Image, ListView, observer, React, Text, TouchableWithoutFeedback, View, windowWidth } from '../../helpers';
import { StatusBar, TouchableOpacity } from 'react-native';
import NavigatorStyles from '../../common/NavigatorStyles';
import SearchStore from '../../mobx/stores/SearchStore';
import TagPostStore from '../../mobx/stores/TagPostStore';
import GridPost from '../favourites/GridPost';
import { COLORS } from '../../helpers';
import Picker from '../Picker'

const CHOICES = [{ label: 'All Tags' }, { label: 'Hair Stylist' }, { label: 'Salon' }, { label: 'Brand' }]

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
        // height: h(220),
        width: h(220),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.WHITE
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
        paddingHorizontal: h(15),
        flexDirection:'row'
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
        // style={{flex: 1}}
      >
        <View
          style = {{
            backgroundColor: COLORS.WHITE1,
            flex: 1,
            height: h(58),
            borderRadius: h(7),
            justifyContent: 'center',
            marginRight:10
          }}
        >
          <Text
            style = {{
              marginLeft: h(14),
              fontSize: h(30),
              // fontFamily: FONTS.OBLIQUE,
              color: COLORS.DARK6,
              backgroundColor: COLORS.TRANSPARENT
            }}
          >
            I'm looking for...
          </Text>
          
        </View>
      </TouchableWithoutFeedback>
    
      <Picker
        choices={CHOICES}
        disabled={false}
        isSearch={true}
        onDone={(item = {}) => {
          alert(JSON.stringify(item))
        }}
      />
    </View>
  );
});

const TagItem = observer(({store, navigator}) => {
  return (
    <TouchableOpacity onPress = {() => {store.isSelected = !store.isSelected}}
      style={
        (store.isSelected)
          ? { borderColor: COLORS.GRAY_BORDER,
              borderRadius: 4,
              borderWidth: 1,
              height: 40,
              justifyContent: "center",
              alignContent: "center",
              alignItems: 'center',
              margin: 5,
              backgroundColor: COLORS.DARK
            }
          : { borderColor: COLORS.GRAY_BORDER,
              borderRadius: 4,
              borderWidth: 1,
              height: 40,
              justifyContent: "center",
              alignContent: "center",
              alignItems: 'center',
              margin: 5
            }
      }
    >
      <Text
        style={
          (store.isSelected)
            ? {  margin: 10,
                alignSelf: 'center',
                color: COLORS.WHITE }
            : {  margin: 10,
                 alignSelf: 'center' }
        }
      >
        {store.name}
      </Text>
    </TouchableOpacity>
  );
});

const TopTags = observer(({store, navigator}) => {
  StatusBar.setBarStyle('dark-content', true); 
  if (store.isLoading) {
    return (
      <View style={{justifyContent: 'center'}}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <View
      style={{
        // height: h(220),
        // flex:1,
      }}
    >
    <ListView
      // style = {{
      //   height: h(220)
      // }}
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
      {/* <Text
        style = {{
          position: 'absolute',
          top: h(8),
          left: h(21),
          fontSize: h(28),
          color: COLORS.WHITE3,
          fontFamily: FONTS.MEDIUM_OBLIQUE,
          backgroundColor: 'transparent'
        }}
      >TOP TAGS </Text> */}
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
          flexDirection: 'row',
          paddingLeft: h(17),
          justifyContent: 'space-between'
        }}
      >
        <Text
          style = {{
            color: COLORS.COLLAPSABLE_TEXT_COLOR,
            fontSize: h(28),
            fontFamily: FONTS.ROMAN
          }}>
          Trending
        </Text>

        <TouchableOpacity onPress={() => {alert('See All Clicked')}}>
          <Text
            style = {{
              color: COLORS.COLLAPSABLE_TEXT_COLOR,
              fontSize: h(28),
              fontFamily: FONTS.ROMAN
            }}>
            See All
          </Text>
        </TouchableOpacity>

      </View>
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
        // marginTop: 20,
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
        }
         else if (el.type == 'popularPostHeader') {
          return <PopularPostHeader />;
        }
         else {
          return (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              <GridPost key={el[0].key} post={el[0]} navigator={navigator}/>
              {
                el[1] != null ?  <GridPost key={el[1].key} post={el[1]} navigator={navigator}/> :
                  <View
                    style = {{
                      width: windowWidth / 2,
                      height: windowWidth / 2,
                      backgroundColor: COLORS.WHITE
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