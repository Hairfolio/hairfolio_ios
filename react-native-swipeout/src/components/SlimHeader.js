import { observer } from 'mobx-react';
import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { FONTS, h, SCALE } from '../style';
import { COLORS } from '../helpers';

var { height, width } = Dimensions.get('window');

const SlimHeader = observer(({leftText, titleWidth=100, titleStyle, rightText, onLeft, onRight, title, rightStyle, isDisabled=false}, context) => {
  return (
    <View
      style={{
        // height: SCALE.h(88),
        height:(height > 800) ?  SCALE.h(88) + 20 :  SCALE.h(88),
        paddingHorizontal: (height > 800) ? SCALE.h(0) : SCALE.h(25),
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderBottomWidth: h(1),
        borderColor: COLORS.LIGHT_GRAY1,
        backgroundColor: COLORS.WHITE
      }}
    >

 <View style={{height:50, width:width-20,
                    marginLeft:(height>800) ? 10 : 0,
                   flexDirection: 'row',
                  alignItems: 'center'}}>
      <TouchableOpacity
        onPress={onLeft}
        style={{flex: 1}}>
        <Text style={{
          fontSize: SCALE.h(34),
          fontFamily: FONTS.SF_REGULAR}} >
          {leftText}
        </Text>
      </TouchableOpacity>
      <View style={{width: titleWidth}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: SCALE.h(34),
            fontFamily: FONTS.SF_BOLD,
            ...titleStyle
          }}>
            {title}
          </Text>
        </View>
        <TouchableOpacity
          disabled = {isDisabled}
          onPress={onRight}
          style={{flex: 1}}>
          <Text style={{
            fontSize: SCALE.h(34),
            textAlign: 'right',
            fontFamily: FONTS.SF_REGULAR,
            ...rightStyle
          }} >
            {rightText}
          </Text>
        </TouchableOpacity>
     </View>
      </View>
  );
});

export default SlimHeader;
