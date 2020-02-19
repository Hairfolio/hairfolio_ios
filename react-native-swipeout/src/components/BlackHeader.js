import { Dimensions, FONTS, h, Image, observer, Platform, React, Text, TouchableOpacity, View } from 'Hairfolio/src/helpers';
import { COLORS } from '../helpers';

var { height, width } = Dimensions.get('window');

const BlackHeader = observer(({title, onLeft, onRenderRight, onRenderLeft}) => {

  let renderRight = () => null;
  if (onRenderRight) {
    renderRight = onRenderRight;
  }

  let renderLeft = () => (
    <View
      style = {{
        height: h(60),
        flexDirection: 'row',
        alignItems: 'center',
        // padding:(Platform.he)
      }}
    >
    
      <Image
        style={{height: 16, width: 28, paddingTop:0}}
        source={require('img/nav_white_back.png')}
      />
    </View>
  );

  if (onRenderLeft) {
    renderLeft = onRenderLeft;
  }

  return (
    <View
      style={{
        backgroundColor: COLORS.DARK,
        height:(height > 800) ? h(88) + 40 : h(88) + 20,
        paddingTop: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',  
      }}
    >
     <View style={{height:50, width:width,
                  flexDirection: 'row',
                  alignItems: 'center'}}>
      <TouchableOpacity
        style={{
          width: 80,
          paddingLeft: h(26),
        }}
        onPress={onLeft}
      >
        {renderLeft()}
      </TouchableOpacity>
      <Text
        numberOfLines={1}
        style={{
          flex: 1,
          fontFamily: FONTS.ROMAN,
          fontSize: h(34),
          color: COLORS.WHITE,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>

      <View
        style={{
          width: 80,
          backgroundColor: COLORS.TRANSPARENT
        }}
      >
        {renderRight()}
      </View>
      </View>
    </View>
  );
});

export default BlackHeader;
