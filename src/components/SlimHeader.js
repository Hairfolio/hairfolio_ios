import React from 'react';
import {h, COLORS, FONTS, SCALE} from '../style';
import {observer} from 'mobx-react/native';

import {View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';

const SlimHeader = observer(({leftText, titleWidth=100, titleStyle, rightText, onLeft, onRight, title, rightStyle}, context) => {
  return (
    <View
      style={{
        height: SCALE.h(88),
        paddingHorizontal: SCALE.h(25),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: h(1),
        borderColor: '#D3D3D3',
        backgroundColor: 'white'
      }}
    >
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
  );
});

export default SlimHeader;
