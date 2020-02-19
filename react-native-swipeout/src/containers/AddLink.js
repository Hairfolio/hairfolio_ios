import { ActivityIndicator, autobind, Component, FONTS, h, Image, observer, React, Text, TextInput, TouchableHighlight, TouchableOpacity, View, WebView, COLORS } from '../helpers';
import { FlatList, NativeModules } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import NavigatorStyles from '../common/NavigatorStyles';
import LinkTabBar from '../components/post/LinkTabBar';
import SlimHeader from '../components/SlimHeader';
import { showLog } from '../helpers';
import AddLinkStore from '../mobx/stores/AddLinkStore';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import EditPostStore from '../mobx/stores/EditPostStore';

const RCTUIManager = NativeModules.UIManager;

const SearchBar = observer(({ catalog }) => {
  catalog.searchText = "";
  setTimeout(() => {
    catalog.search();
  }, 500);
  return (
    <View
      style={{
        height: h(90),
        backgroundColor: COLORS.BACKGROUND_SEARCH_FIELD, //'#E6E6E6',
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
            backgroundColor: COLORS.WHITE,
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
            backgroundColor: COLORS.DARK5,
            borderRadius: h(9),
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              color: COLORS.BACKGROUND_SEARCH_FIELD,
            }}
          >
            Search
          </Text>
        </TouchableOpacity>

      </View>

    </View>

  );
});


const CatalogResultItem = observer(({ item, navigator }) => {

  return (
    <TouchableHighlight
      underlayColor={COLORS.ABOUT_SEPARATOR}
      onPress={() => {
        CreatePostStore.gallery.addLinkToPicture(
          CreatePostStore.gallery.position.x,
          CreatePostStore.gallery.position.y,
          item
        );
        if (CreatePostStore.postId) {
          
          let currentPicId = CreatePostStore.gallery.selectedPicture.id;
          let currentPic = CreatePostStore.gallery.selectedPicture.source.uri;


          if (EditPostStore.photos_attributes.length > 0) {
            
            EditPostStore.photos_attributes.map((value, index) => {
              if (value.id == currentPicId) {
                let tempAttributes = [];
                tempAttributes = EditPostStore.photos_attributes[index].labels_attributes;
                tempAttributes.push({ "url": item.linkUrl, "name": item.name, "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y })
                EditPostStore.photos_attributes[index].labels_attributes=tempAttributes
                
              }
              else {
                if ((index + 1) == EditPostStore.photos_attributes.length) {
                  let tempAttributes = [];
                  tempAttributes.push({ "url": item.linkUrl, "name": item.name, "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y })                    

                  EditPostStore.photos_attributes.push({
                    'id': currentPicId,
                    'asset_url':currentPic,
                    'labels_attributes':tempAttributes
                  })                   
                }
              }
              
            })
            
          } else {
            let tempAttributes = [];
            tempAttributes.push({ "url": item.linkUrl, "name": item.name, "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y })
      
            EditPostStore.photos_attributes.push({
              'id': currentPicId,
              'asset_url':currentPic,
              'labels_attributes':tempAttributes
            })
          }
          
          // EditPostStore.labels_attributes.push({ "url": item.linkUrl, "name": item.name, "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y })
        }
        console.log('EDITED TAGS=>'+JSON.stringify(EditPostStore.photos_attributes))
        navigator.pop({ animated: true });
      }}
    >
      <View
        style={{
          borderBottomWidth: h(1),
          borderColor: COLORS.BOTTOMBAR_BORDER,
          alignItems: 'center',
          height: h(172),
          flexDirection: 'row'
        }}>
        <Image
          source={{ uri: item.imageUrl }}
          style={{ height: h(150), width: h(150), marginLeft: h(11) }}
        />
        <Text
          style={{ paddingLeft: 20, flex: 1, fontSize: h(28) }}>
          {item.name}
        </Text>
      </View>
    </TouchableHighlight>
  );
});

const CatalogResults = observer(({ catalog, navigator }) => {

  if (catalog.isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (catalog.items == null) {
    return <View />;
  } else if (catalog.items.length == 0) {
    return (
      <View>
        <Text style={{ flex: 1, textAlign: 'center', fontSize: h(40), marginTop: 25 }} > No results found </Text>
      </View>
    )
  }

  showLog("CATALOG ITEMS => " + JSON.stringify(catalog.items))

  return (
    <FlatList
      data={catalog.items}
      renderItem={({ item }) => <CatalogResultItem key={item.key} item={item} navigator={navigator} />}


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

const CatalogPage = observer(({ navigator }) => {
  // AddLinkStore.catalog.searchText= "";
  // AddLinkStore.catalog.search();
  return (
    <View style={{ flex: 1 }}>
      <SearchBar catalog={AddLinkStore.catalog} />
      <CatalogResults
        catalog={AddLinkStore.catalog}
        navigator={navigator}
      />
    </View>
  );
});

const BrowseFooter = observer(({ navigator }) => {
  return (
    <View
      style={{
        height: h(100),
        backgroundColor: COLORS.DARK3,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'

      }}
    >
      <TouchableOpacity
        onPress={() => window.webview.goBack()}
        style={{ width: h(70), justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('img/post_browse_arrow_left.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          CreatePostStore.gallery.addLinkToPicture(
            CreatePostStore.gallery.position.x,
            CreatePostStore.gallery.position.y,
            { name: AddLinkStore.browse.title, linkUrl: AddLinkStore.browse.link }
          );
          if (CreatePostStore.postId) {
          
            let currentPicId = CreatePostStore.gallery.selectedPicture.id;
            let currentPic = CreatePostStore.gallery.selectedPicture.source.uri;

            if (EditPostStore.photos_attributes.length > 0) {
              EditPostStore.photos_attributes.map((value, index) => {
                if (value.id == currentPicId) {
                  let tempAttributes = [];
                  tempAttributes = EditPostStore.photos_attributes[index].labels_attributes;
                  tempAttributes.push({ "url": AddLinkStore.browse.link, "name": AddLinkStore.browse.title, "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y })
                  EditPostStore.photos_attributes[index].labels_attributes = tempAttributes;                  
                }
                else {
                  if ((index + 1) == EditPostStore.photos_attributes.length) {
                    let tempAttributes = [];
                    tempAttributes.push({ "url": AddLinkStore.browse.link, "name": AddLinkStore.browse.title, "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y })
  
                    EditPostStore.photos_attributes.push({
                      'id': currentPicId,
                      'asset_url':currentPic,
                      'labels_attributes':tempAttributes
                    })                   
                  }
                }                
              })
              
            } else {
              let tempAttributes = [];
              tempAttributes.push({ "url": AddLinkStore.browse.link, "name": AddLinkStore.browse.title, "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y })
        
              EditPostStore.photos_attributes.push({
                'id': currentPicId,
                'asset_url':currentPic,
                'labels_attributes':tempAttributes
              })
            }
            
            // EditPostStore.labels_attributes.push({ "url": AddLinkStore.browse.link, "name": AddLinkStore.browse.title, "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y })
          }
          console.log('EDITED TAGS=>'+JSON.stringify(EditPostStore.photos_attributes))
          navigator.pop({ animated: true });
        }}
        style={{
          backgroundColor: COLORS.WHITE,
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
            color: COLORS.DARK
          }}>ADD LINK TAG</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => window.webview.goForward()}
        style={{ width: h(70), justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('img/post_browse_arrow_right.png')}
        />
      </TouchableOpacity>
    </View>
  );
});

const BrowsePage = observer(({ navigator }) => {
  let browse = AddLinkStore.browse;
  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webview => window.webview = webview}
        source={{ uri: 'http://www.google.com' }}
        style={{ flex: 1 }}
        onLoad={({ nativeEvent }) => {
          browse.title = nativeEvent.title;
          browse.link = nativeEvent.url;
        }}
      />
      <BrowseFooter navigator={navigator} />
    </View>
  );
});

const ManualTextField = observer(({ item, placeholder, style }) => {
  return (
    <View
      style={{
        height: h(70),
        borderBottomWidth: h(1),
        borderColor: COLORS.BOTTOMBAR_BORDER,
        ...style
      }}
    >
      <TextInput
        style={{ flex: 1, height: h(70), fontSize: h(28), fontFamily: FONTS.BOOK }}
        value={item.val}
        onChangeText={v => item.val = v}
        placeholder={placeholder} />
    </View>

  );
});

const ManualPage = observer(({ navigator }) => {
  let manual = AddLinkStore.manual;
  return (
    <View style={{ marginTop: 30, paddingHorizontal: h(40) }}>
      <ManualTextField
        placeholder='Product Name'
        item={manual.title} />


      <ManualTextField
        style={{ marginTop: 10 }}
        placeholder='Product Name URL'
        item={manual.link} />

      <TouchableOpacity
        style={{
          marginTop: 30,
          height: h(86),
          backgroundColor: COLORS.DARK3,
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
            // alert("link==>"+JSON.stringify(data))
            if (CreatePostStore.postId) {
          
              let currentPicId = CreatePostStore.gallery.selectedPicture.id;
              let currentPic = CreatePostStore.gallery.selectedPicture.source.uri;

              if (EditPostStore.photos_attributes.length > 0) {
                EditPostStore.photos_attributes.map((value, index) => {
                  if (value.id == currentPicId) {
                    let tempAttributes = [];
                    tempAttributes = EditPostStore.photos_attributes[index].labels_attributes;
                    tempAttributes.push({ "url": data.linkUrl, "name": data.name, "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y })
                    EditPostStore.photos_attributes[index].labels_attributes = tempAttributes;
                  }
                  else {
                    if ((index + 1) == EditPostStore.photos_attributes.length) {
                      let tempAttributes = [];
                      tempAttributes.push({ "url": data.linkUrl, "name": data.name, "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y })
    
                      EditPostStore.photos_attributes.push({
                        'id': currentPicId,
                        'asset_url':currentPic,
                        'labels_attributes':tempAttributes
                      })                   
                    }
                  }
                  
                })
                
              } else {
                let tempAttributes = [];
                tempAttributes.push({ "url": data.linkUrl, "name": data.name, "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y })
          
                EditPostStore.photos_attributes.push({
                  'id': currentPicId,
                  'asset_url':currentPic,
                  'labels_attributes':tempAttributes
                })
              }
              
              // EditPostStore.labels_attributes.push({ "url": data.linkUrl, "name": data.name, "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y })
            }
            console.log('EDITED TAGS=>'+JSON.stringify(EditPostStore.photos_attributes))
            manual.title.val = ''
            manual.link.val = ''
            navigator.pop({ animated: true });
          } else {
            alert('Fill out all the fields');
          }
        }
        }
      >
        <Text style={{ color: 'white' }}>Add</Text>

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

  constructor(props) {
    super(props);
    this.props.navigator.toggleTabs({
      to: 'shown',
    });
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'bottomTabSelected':
        CreatePostStore.reset();

        this.props.navigator.resetTo({
          screen: 'hairfolio.CreatePost',
          animationType: 'fade',
          navigatorStyle: NavigatorStyles.tab
        });

        break;
      default:
        break;
    }
  }
  
  render() {
    let store = AddLinkStore;

    return (
      <View style={{ paddingTop: 20, flex: 1, backgroundColor: 'white' }}>
        <SlimHeader
          leftText='Back'
          onLeft={() => {
            this.props.navigator.pop({ animated: true });
          }}
          title='Add Link'
          titleStyle={{ fontFamily: FONTS.SF_MEDIUM }}
          onRight={() => {
          }}
        />
        <View
          style={{
            height: h(1),
            backgroundColor: COLORS.BOTTOMBAR_BORDER
          }} />
        <ScrollableTabView
          renderTabBar={() => <LinkTabBar />}
          initialPage={1}
        >
          {/* <CatalogPage tabLabel="Catalog" navigator={this.props.navigator}/> */}
          <BrowsePage tabLabel="Browse" navigator={this.props.navigator} />
          <ManualPage tabLabel="Manual" navigator={this.props.navigator} />
        </ScrollableTabView>

      </View>
    );
  }
}
