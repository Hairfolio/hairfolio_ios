import React from 'react';
import {COLORS, FONTS, SCALE} from '../style';
import {observer} from 'mobx-react/native';

import {View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';

const SlimHeader = observer(({leftText, rightText, onLeft, onRight, title}, context) => {
  return (
    <View
      style={{
        height: SCALE.h(88),
        paddingHorizontal: SCALE.h(25),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: 'black'
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
      <View style={{flex: 1}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: SCALE.h(34),
            fontFamily: FONTS.SF_BOLD }}>
            {title}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onRight}
          style={{flex: 1}}>
          <Text style={{
            fontSize: SCALE.h(34),
            textAlign: 'right',
            fontFamily: FONTS.SF_REGULAR}} >
            {rightText}
          </Text>
        </TouchableOpacity>
      </View>
  );
});

export default SlimHeader;
