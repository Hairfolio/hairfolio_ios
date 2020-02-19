import { ActivityIndicator, Component, Dimensions, FONTS, h, Image, observable, observer, React, ScrollView, Text, TextInput, TouchableHighlight, TouchableOpacity, View, windowHeight } from 'Hairfolio/src/helpers';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { COLORS, showLog } from '../../helpers';
import SearchDetailsStore from '../../mobx/stores/search/SearchDetailsStore';
import TagPostStore from '../../mobx/stores/TagPostStore';
import FollowUserList from '../FollowUserList';
import LinkTabBar from '../post/LinkTabBar';
var { height, width } = Dimensions.get('window');

const SearchHeader = observer(({navigator}) => {
  return (
    <View
      style = {{
        backgroundColor: COLORS.DARK3,
        height: (height > 800) ? h(136)+10 : h(136),
        paddingTop: (height > 800) ? 35 : 20,
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
          backgroundColor: COLORS.WHITE,
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
      onPress={() => navigator.pop({animated: true})}
    >
      <Text
        style = {{
          fontSize: h(34),
          fontFamily: FONTS.ROMAN,
          color: COLORS.WHITE,
          backgroundColor: COLORS.TRANSPARENT,
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

const StylistSearch = observer(({store, navigator}) => {

  let s_store = SearchDetailsStore.stylistStore; 
  
  showLog("SalonSearch ==>"+JSON.stringify(s_store.allUsers));

  return (
    <FollowUserList
      store={s_store.allUsers}
      navigator={navigator}
      noResultText='Nothing was found'
      store_name="stylistStore"
    />
  );
});

const TagItem = observer(({item, navigator}) => {
  return (
    <TouchableHighlight
      underlayColor={COLORS.ABOUT_SEPARATOR}
      onPress={
        () => {
          let name = item.name.substring(1);
          TagPostStore.jump(
            name,
            `#${name}`,
            navigator,
            'from_search'
          );
        }
      }
    >
      <View
        style={{
          borderBottomWidth: h(1),
          borderColor: COLORS.BOTTOMBAR_BORDER,
          justifyContent: 'center',
          height: h(86),
        }}
      >
        <Text style={{paddingLeft: 20, fontSize: h(28)}}>{item.name}</Text>
      </View>
    </TouchableHighlight>
  );
})

const TagSearch = observer(({store, navigator}) => {

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
      {store.tags.map(e => <TagItem key={e.key} item={e} navigator={navigator}  />)}
    </ScrollView>
  );
});



const NearbySearch = observer(({store, navigator}) => {
  
  let s_store = SearchDetailsStore.nearbyStore; 

  return (
    <FollowUserList
      store={s_store.allUsers}
      navigator={navigator}
      noResultText='Nothing was found'
      store_name="nearbyStore"
    />
  );

});

const SalonSearch = observer(({store, navigator}) => {
  // alert(JSON.stringify(store))

  let s_store = SearchDetailsStore.salonStore; 
  

  return (
    // <FollowUserList
    //   store={store}
    //   navigator={navigator}
    //   noResultText='Nothing was found'
    // />

    <FollowUserList
      store={s_store.allUsers}
      navigator={navigator}
      noResultText='Nothing was found'
      store_name="salonStore"
    />
  );

});


const BrandSearch = observer(({store, navigator}) => {

  let s_store = SearchDetailsStore.brandStore; 

  return (
    <FollowUserList
      store={s_store.allUsers}
      navigator={navigator}
      noResultText='Nothing was found'
      store_name="brandStore"
    />
  );
});

let SearchPage = (Class, store, props) => observer(() => {
  
  if (store.isLoading) {
    return <ActivityIndicator size='large'/>;
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


const SearchDetailsElement2 = observer(({navigator}) => {
  
  const StylistPage = SearchPage(StylistSearch, SearchDetailsStore.stylistStore, { navigator });
  const TagPage = SearchPage(TagSearch, SearchDetailsStore.hashStore, { navigator });
  const SalonPage = SearchPage(SalonSearch, SearchDetailsStore.salonStore, { navigator });
  const BrandPage = SearchPage(BrandSearch, SearchDetailsStore.brandStore, { navigator });
  const NearbyPage = SearchPage(NearbySearch, SearchDetailsStore.nearbyStore, { navigator });

  return (
    <View style={{height: windowHeight}}>
      <SearchHeader navigator={navigator} />
        <ScrollableTabView
          renderTabBar={() => <LinkTabBar />}
          initialPage={0} >

          <StylistPage tabLabel='Stylists' navigator={navigator} />
          <TagPage tabLabel='Tags' navigator={navigator} />
          <SalonPage tabLabel='Salon' navigator={navigator} />
          <BrandPage tabLabel='Brand' navigator={navigator} />
          <NearbyPage tabLabel='Nearby' navigator={navigator} />
          
        </ScrollableTabView>
    </View>
  );
});


export default class SearchDetailsElement extends Component{

  @observable tempStoreData = [];

  render(){

    return(<SearchDetailsElement2 navigator={this.props.navigator}/>)

  }

}

//export default SearchDetailsElement;
