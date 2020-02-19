import { FONTS, h, observer, React, Text, View } from 'Hairfolio/src/helpers';

const ServiceRow = observer(({selector}) => {

  if (!selector.value) {
    return null;
  }

  return (
    <View style={{flexDirection: 'row', paddingLeft: h(30), marginBottom: h(10)}}>
      <View >
        <Text
          style={{
            fontFamily: FONTS.HEAVY,
            fontSize: h(32)
          }}
        >
          {selector.title + ': '}
        </Text>
      </View>
      <View style={{flex: 1}}>
        <Text
          style={{
            fontFamily: FONTS.BOOK,
            fontSize: h(32)
          }}
        >
          {selector.value}
        </Text>
      </View>
    </View>
  );
});


export default ServiceRow;
