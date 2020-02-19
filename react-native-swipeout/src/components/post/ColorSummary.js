import { FONTS, h, observer, React, Text, View, windowWidth } from 'Hairfolio/src/helpers';
import { COLORS } from '../../helpers';


const ColorInfo = observer(({color}) => {
  return (
    <View style={{
      paddingLeft: h(15),
      width: (windowWidth - h(15)) / 2,
      height: h(175),
      marginTop: h(12),
      flexDirection: 'row'
    }}>

    <LinearGradient
      colors={color.gradientColors}
      style={{
        width: (windowWidth - h(15)) / 4 - h(15),
        height: h(175),
        justifyContent: 'center',
        alignItems: 'center',
        ...color.borderStyle
      }}
    >
      <Text
        style={{
          color: color.textColor,
          fontFamily: FONTS.BOOK_OBLIQUE,
          fontSize: h(42),
          backgroundColor: COLORS.TRANSPARENT
        }}
      >
        {color.name}
      </Text>
    </LinearGradient>
    <PickerBox
      selector={color.amountSelector2} />
  </View>
  );
});


export default ColorInfo;
