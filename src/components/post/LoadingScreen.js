import { ActivityIndicator, observer, React, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';

const LoadinScreen = observer(() => {
  return (
    <View style={style}>
      <ActivityIndicator size='large' />
    </View>
  );
});

const style = {
  position: 'absolute',
  backgroundColor: 'black',
  opacity: 0.25,
  top: 0,
  left: 0,
  height: windowHeight,
  width: windowWidth,
  alignItems: 'center',
  justifyContent: 'center'
};


export default LoadinScreen;
