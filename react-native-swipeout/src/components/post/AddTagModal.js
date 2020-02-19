import { COLORS,ActivityIndicator, Alert, Dimensions, FONTS, h, Modal, observer, React, ScrollView, StatusBar, Text, TextInput, TouchableHighlight, TouchableOpacity, View, windowHeight, windowWidth } from '../../helpers';
import AddTagStore from '../../mobx/stores/AddTagStore';
import CreatePostStore from '../../mobx/stores/CreatePostStore';
import EditPostStore from '../../mobx/stores/EditPostStore';
import KeyboardStore from '../../mobx/stores/KeyboardStore';
var { height, width } = Dimensions.get('window');

const SearchResultItem = observer(({ item }) => {

  return (
    <TouchableHighlight
      underlayColor={COLORS.ABOUT_SEPARATOR}
      onPress={() => {

        console.log('CreatePostStore.gallery.position.x=>'+CreatePostStore.gallery.position.x)
        console.log('CreatePostStore.gallery.position.y=>'+CreatePostStore.gallery.position.y)
        console.log('item=>' + JSON.stringify(item))
        
        CreatePostStore.gallery.addHashToPicture(
          CreatePostStore.gallery.position.x,
          CreatePostStore.gallery.position.y,
          item.name
        );   
        // console.log('hash item==>'+JSON.stringify(item))
        if (CreatePostStore.postId) {
          console.log('SELECTED IMAGES==>'+JSON.stringify(CreatePostStore.gallery.selectedPicture.source))
          let currentPicId = CreatePostStore.gallery.selectedPicture.id;
          let currentPic = CreatePostStore.gallery.selectedPicture.source.uri;

          if (EditPostStore.photos_attributes.length > 0) {
            
            EditPostStore.photos_attributes.map((value, index) => {
              if (value.id == currentPicId) {
                let tempAttributes = [];
                tempAttributes = EditPostStore.photos_attributes[index].labels_attributes;
                console.log('EDITED TAGS=>1 '+JSON.stringify(tempAttributes))
                tempAttributes.push({ "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y, "tag_id": item.id })
                console.log('EDITED TAGS=>2 ' + JSON.stringify(tempAttributes))
                EditPostStore.photos_attributes[index].labels_attributes = tempAttributes;               
              }
              else {
                if ((index + 1) == EditPostStore.photos_attributes.length) {
                  let tempAttributes = [];
                  tempAttributes.push({ "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y, "tag_id": item.id })

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
            tempAttributes.push({ "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y, "tag_id": item.id })

            EditPostStore.photos_attributes.push({
              'id': currentPicId,
              'asset_url':currentPic,
              'labels_attributes':tempAttributes
            })
          }

          
          // EditPostStore.labels_attributes.push({ "position_left": CreatePostStore.gallery.position.x, "position_top": CreatePostStore.gallery.position.y, "tag_id": item.id })
        }
        console.log('EDITED TAGS=>'+JSON.stringify(EditPostStore.photos_attributes))
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
          borderColor: COLORS.BOTTOMBAR_BORDER,
          justifyContent: 'center',
          height: h(86),
        }}>
        <Text style={{ paddingLeft: 20, fontSize: h(28) }}>{item.name}</Text>
      </View>
    </TouchableHighlight>
  );
});

const SearchResults = observer(({ store }) => {

  let myHeight = windowHeight - h(90) - KeyboardStore.height;
  if (store.isLoading) {
    return (
      <View style={{ height: myHeight, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (store.items == null) {
    return <View />;
  } else if (store.items.length == 0) {
    return <View>
      <Text style={{ flex: 1, textAlign: 'center', fontSize: h(40), marginTop: 25 }} > No results found </Text>
    </View>
  }


  return (<View
    style={{ height: myHeight }}
  >
    <ScrollView
      bounces={false}
      style={{ height: myHeight }}
    >
      {store.items.map(el =>
        <SearchResultItem key={el.key} item={el} />
      )}
    </ScrollView>
  </View>
  );
});

const Header = observer(({ store }) => {

  return (
    <View
      style={{
        height: (height > 800) ? h(90) + 40 : h(90) + 20,
        flexDirection: 'row',
        marginRight: h(16),
        alignItems: 'flex-end',
      }}
    >
      <View style={{
        height: 50, width: width - 10,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
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
            backgroundColor: COLORS.BACKGROUND_SEARCH_FIELD,
            borderRadius: h(9),
            paddingHorizontal: h(16)
          }}
          returnKeyType='search'
          value={store.searchTerm}
          maxLength={20}
          onChangeText={v => store.searchTerm = v.trim()}
          placeholder='Search Tag'
        />

        <TouchableOpacity
          style={{
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

    </View>
  );
});


const AddTagModal = observer(() => {
  return (
    <Modal
      animationType='slide'
      style={{ height: windowHeight, backgroundColor: 'white' }}
      visible={AddTagStore.visibility}
    >
      <Header store={AddTagStore} />

      <View style={{ height: h(1), width: windowWidth, backgroundColor: COLORS.BOTTOMBAR_BORDER }} />
      <SearchResults store={AddTagStore} />
    </Modal>
  );
});

export default AddTagModal;
