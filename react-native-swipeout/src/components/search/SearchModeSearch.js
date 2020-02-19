import { h, observer, React, Text, View, windowHeight } from 'Hairfolio/src/helpers';
import { COLORS } from '../../helpers';

const SearchModeSearch = observer(() => {
  return (
    <View style={{height: windowHeight}}>
      <View
        style = {{
          backgroundColor: COLORS.DARK3,
          height: h(136)
        }}
      >
        <Text>This is a text</Text>
      </View>
    </View>
  );
});

export default SearchModeSearch;
