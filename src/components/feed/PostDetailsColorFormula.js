import {
  _, // lodash
  v4,
  observer, // mobx
  h,
  FONTS,
  COLORS,
  autobind,
  React, // react
  Component,
  windowWidth,
  windowHeight,
  // react-native components
  AlertIOS,
  Modal,
  getUserId,
  ScrollView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import LinearGradient from 'react-native-linear-gradient';

import ServiceBackend from 'backend/ServiceBackend.js'

import Swiper from 'hairfolio/react-native-swiper';

import ServiceRow from 'components/post/ServiceRow.js'

import AddServiceStore from 'stores/AddServiceStore.js'

import * as routes from 'hairfolio/src/routes.js'

import PostDetailStore from 'stores/PostDetailStore'

const ColorInfo = observer(({store, unit, textStyle, style}) => {
  let colorArray;

  if (store.color.start_hex && store.color.end_hex) {
    colorArray = [`#${store.color.start_hex}`, `#${store.color.end_hex}`];
  } else {
    colorArray = [`#${store.color.hex}`, `#${store.color.hex}`];
  }

  let code = store.color.code;

  if (code.startsWith('0')) {
    code = code.substr(1);
  }

  return (
    <View
      style={{
        paddingLeft: h(15),
        width: (windowWidth - h(15)) / 4,
        marginTop: h(12),
        height: h(210)
      }}
    >
      <View
        style={{
          height: h(80),
          backgroundColor: '#F3F3F3',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: h(10)
        }}
      >
        <Text
          style = {{
            fontSize: h(33),
            fontFamily: FONTS.BOOK,
            color: '#3C3C3C'
          }}

        >
          {store.weight}{unit}
        </Text>
      </View>
      <LinearGradient
        colors={colorArray}
        style={{
          width: (windowWidth - h(15)) / 4 - h(15),
          height: h(116),
          justifyContent: 'center',
          alignItems: 'center',
          ...style
        }}
      >
        <Text
          style={{
            color: 'white',
            fontFamily: FONTS.BOOK_OBLIQUE,
            fontSize: h(42),
            backgroundColor: 'transparent',
            ...textStyle
          }}
        >
          {code}
        </Text>
      </LinearGradient>
    </View>
  );
});

const DuratationInfo = observer(({store}) => {

  if (!store.developerTime) {
    return null;
  }

  return (
    <View
      style={{
        paddingLeft: h(15),
        width: (windowWidth - h(15)) / 2 - h(15),
        marginTop: h(12),
        height: h(210),
        backgroundColor: 'black',
        marginLeft: h(15),
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text
        style = {{
          color: 'white',
          fontSize: h(42)
        }}
      >{store.developerTime} min
      </Text>
    </View>

  );
});

const ServiceInfo = observer(({canEdit, store}) => {



  let editService = () => {


    window.serviceTag = store;

    // AddServiceStore.reset();
    AddServiceStore.init(store);

    // AddServiceStore.posX = a.nativeEvent.locationX;
    // AddServiceStore.posY = a.nativeEvent.locationY;

    AddServiceStore.myBack = () => {
      window.navigators[0].jumpTo(routes.postDetails);
    };

    let myId = store.id;

    AddServiceStore.save = async (obj) => {

      console.log('save', obj);
      obj.id = myId;


      if (obj.post_item_tag_colors) {
        let colors = obj.post_item_tag_colors;

        let myArr = [];

        for (let formula of colors) {
          let col = formula.toJSON();
          console.log('new color', col);
          myArr.push(col);
        }

        obj.post_item_tag_colors = myArr;
      }


      let store = PostDetailStore.currentStore;

      let picture = await store.selectedPicture.toJSON(false, obj);

      let res = await ServiceBackend.put('photos/' + store.selectedPicture.id,
        {
          photo: picture
        });

      console.log('res photo', res);

      AddServiceStore.myBack();
    };

    window.navigators[0].jumpTo(routes.addServiceOne);
  };


  let editButton =  (
    <TouchableOpacity
      style={{flexDirection: 'row'}}
      onPress={editService}
    >
      <Image
        style={{
          height: 16,
          width: 16
        }}
        source={require('img/feed_settings.png')}
      />
      <Text
        style={{
          color: '#393939',
          fontSize: h(28),
          marginRight: h(28),
          marginLeft: h(13)
        }}
      >
        Edit
      </Text>
    </TouchableOpacity>
  );

  if (!canEdit) {
    editButton = <View />;
  }

  let colors = (
    <View
      style = {{
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}
    >
      {store.colors.map(c => <ColorInfo unit={store.unit} key={c.color.id} store={c} />)}
      {
        store.developerVolume ?
          <ColorInfo
            key='vl'
            unit={store.unit}
            textStyle={{color: '#3C3C3C'}}
            style={{borderWidth: h(1), borderColor: '#979797' }}
            store={{
              color: {
                code: `${store.developerVolume}VL`,
                start_hex: 'ffffff',
                end_hex: 'ffffff',
              },
              weight: store.developerAmount
            }}
          />
          : <View />
      }
      <DuratationInfo store={store}/>
  </View>
  );

  return (
    <View>
      <View style={{marginTop: h(81)}}>
        <View
          style={{flexDirection: 'row'}}
          st>
          <View style={{flex: 1}}>
            <ServiceRow selector={{title: 'Service', value: store.serviceName }} />
            <ServiceRow selector={{title: 'Brand', value: store.brandName}} />
            <ServiceRow selector={{title: 'Color', value: store.lineName}} />
          </View>

          <View
            style={{
              width: 60
            }}

          >
            {editButton}
          </View>
        </View>
      </View>
      {colors}
    </View>
  );
});


const PostDetailsColorFormula = observer(({store}) => {

  let creatorId = store.post.creator.id;

  let canEdit = getUserId() == store.post.creator.id;


  let serviceTags =  store.serviceTags;

  if (store.serviceTags.length == 0) {
    return null;
  }

  return (
    <View
      onLayout={({nativeEvent}) => store.colorFormulaPosY = nativeEvent.layout.y}
    >
      <View
        style = {{
          flex: 1,
          height: h(80),
          backgroundColor: '#F3F3F3',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text
          style = {{
            fontFamily: FONTS.ROMAN,
            fontSize: h(28),
            color: '#BFBFBF',
            paddingLeft: h(24)
          }}
        >
          COLOR FORMULA
        </Text>
      </View>
      <Swiper
        showsButtons={false}
        ref={(el) => {
          window.formula = el;
          store.swiper = el
        }}
        paginationStyle={{
          position: 'absolute',
          top: 10,
          bottom: null
        }}
      >
        {store.serviceTags.map(e =>
            <ServiceInfo canEdit={canEdit} key={e.key} store={e} />
        )}
      </Swiper>
    </View>
  );
});


export default PostDetailsColorFormula;
