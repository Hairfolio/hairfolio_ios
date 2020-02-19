import { FONTS, h, Image, observer, React, Text, TouchableWithoutFeedback, View, windowWidth } from 'Hairfolio/src/helpers';
import { COLORS } from '../../helpers';

const BoxSelector = observer(() => {
  return (
    <TouchableWithoutFeedback>
      <View
        style={{
          height: h(80),
          backgroundColor: COLORS.WHITE,
          marginHorizontal: h(20),
          flexDirection: 'row'
        }}>
        <View style={{flex: 1, paddingLeft: h(40), justifyContent: 'center' }}>
          <Text style={{fontSize: h(28)}}>Highlights</Text>
        </View>
        <View style={{width: h(81), flexDirection: 'row'}}>
          <View style={{width: h(1), height: h(80), backgroundColor: COLORS.BOTTOMBAR_NOTSELECTED}} />
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image
              source={require('img/post_arrow_down.png')}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

const ServiceBox = observer(({serviceBox}) => {
  if (!serviceBox.show) {
    return <View />;
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: serviceBox.locY,
        left: serviceBox.locX - h(30)
      }}>
      <Image
        style={{height: h(12), width: h(40)}}
        source={require('img/post_triangle.png')}
      />
      <View
        style={{
          position: 'absolute',
          height: h(400),
          backgroundColor: COLORS.BLACK,
          opacity: 0.5,
          top: h(12),
          left: -serviceBox.locX + h(30),
          width: windowWidth
        }}
      >
      </View>

      <View
        style={{
          position: 'absolute',
          backgroundColor: COLORS.TRANSPARENT,
          height: h(400),
          top: h(12),
          left: -serviceBox.locX + h(30),
          width: windowWidth
        }}
      >
        <Text
          style={{
            color: COLORS.WHITE,
            fontSize: h(28),
            textAlign: 'center',
            opacity: 1.5,
            fontFamily: FONTS.SF_BOLD,
            paddingTop: h(30),
            paddingBottom: h(30)
          }}
        >COLOR</Text>
        <BoxSelector />
             </View>
    </View>

  );
});

export default ServiceBox;
