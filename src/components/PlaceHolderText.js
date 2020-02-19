import { FONTS,observer, React, Text, View, windowHeight, windowWidth,StyleSheet,h } from "Hairfolio/src/helpers";
import { COLORS } from "../helpers";

const PlaceHolderText = (props) => {  
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>       
        {props.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    height: windowHeight - 20 - h(88) - windowWidth - h(82),
    width: windowWidth,
    backgroundColor: COLORS.WHITE,
    justifyContent: "center",
    alignItems: "center"
  },
  textStyle:{
    color: COLORS.DARK4,
    fontSize: h(33),
    fontFamily: FONTS.OBLIQUE,
    fontWeight: "400"
  }
})

export default PlaceHolderText;
