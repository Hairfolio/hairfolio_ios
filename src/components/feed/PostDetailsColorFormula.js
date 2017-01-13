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
  ScrollView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import LinearGradient from 'react-native-linear-gradient';

import Swiper from 'hairfolio/react-native-swiper';

import ServiceRow from 'components/post/ServiceRow.js'

const ColorInfo = observer(({store, unit, textStyle, style}) => {
  let colorArray;

  if (store.color.start_hex && store.color.end_hex) {
    colorArray = [`#${store.color.start_hex}`, `#${store.color.end_hex}`];
  } else {
    colorArray = [`#${store.color.hex}`, `#${store.color.hex}`];
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
          {store.color.code}
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

const ServiceInfo = observer(({store}) => {

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
        <ServiceRow selector={{title: 'Service', value: store.serviceName }} />
        <ServiceRow selector={{title: 'Brand', value: store.brandName}} />
        <ServiceRow selector={{title: 'Color', value: store.lineName}} />
      </View>
      {colors}
    </View>
  );
});


const PostDetailsColorFormula = observer(({store}) => {

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
            <ServiceInfo key={e.key} store={e} />
        )}
      </Swiper>
    </View>
  );
});


export default PostDetailsColorFormula;
