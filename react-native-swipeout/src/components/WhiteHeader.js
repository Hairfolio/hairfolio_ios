import { Dimensions, FONTS, h, Image, observer, React, Text, TouchableOpacity, View } from 'Hairfolio/src/helpers';
import { COLORS } from '../helpers';

var { height, width } = Dimensions.get('window');

const WhiteHeader = observer(({title, numberOfLines, titleStyle, onLeft, onRenderRight}) => {

  let renderRight = () => null;
  if (onRenderRight) {
    renderRight = onRenderRight;
  }

  return (
    <View
      style={{
        backgroundColor: COLORS.WHITE,
        //height: h(88) + 20,
        height:(height > 800) ? h(88) + 40 : h(88) + 20,
        paddingTop: 20,
        paddingHorizontal: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderBottomWidth: h(1),
        borderBottomColor: COLORS.LIGHT_GRAY1,
        
      }}
    >
    <View style={{height:50, width:width,
                  flexDirection: 'row',
                  alignItems: 'center'}}>
      <TouchableOpacity
        style={{
          width: 100
        }}
        onPress={onLeft}
      >
      {onLeft ?
          <View
            style = {{
              height: h(60),
              paddingLeft: h(26),
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Image
              style={{height: 16, width: 28}}
              source={require('img/nav_black_back.png')}
            />
        </View>
          : null
      }

    </TouchableOpacity>
      <Text
        style={{
          flex: 1,
          fontFamily: FONTS.MEDIUM,
          fontSize: h(34),
          color: COLORS.DARK,
          textAlign: 'center',
          ...titleStyle
        }}
        numberOfLines={numberOfLines}
      >
        {title}
      </Text>

      <View
        style={{
          width: 80,
          paddingRight: h(26)
        }}
      >
        {renderRight()}
      </View>
      </View>
    </View>
  );
});

export default WhiteHeader;
