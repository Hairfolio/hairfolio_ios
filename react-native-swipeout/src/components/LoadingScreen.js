import { ActivityIndicator, observer, React, Text, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';
import { COLORS } from '../helpers';

const LoadingScreen = observer(({store, style = {}}) => {
  if (!store.isLoading) {
    return null;
  }
  return (
    <View style={[loadingStyle, style]}>
      <ActivityIndicator size='large' />
      <Text style={{color: COLORS.WHITE, marginTop: 20}}>{store.loadingText}</Text>
    </View>
  );
});

const loadingStyle = {
  position: 'absolute',
  backgroundColor: COLORS.BLACK,
  opacity: 0.4,
  top: 0,
  left: 0,
  height: windowHeight,
  width: windowWidth,
  alignItems: 'center',
  justifyContent: 'center'
};


export default LoadingScreen;
