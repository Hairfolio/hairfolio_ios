import { COLORS, FONTS, h, Image, observer, React, ScrollView, Text, TouchableOpacity, View, windowWidth } from "../../helpers";
import { StyleSheet } from "react-native";
import NavigatorStyles from "../../common/NavigatorStyles";

const ProductPostList = observer(({ post, navigator }) => {
  const placeholder_icon = require("img/medium_placeholder_icon.png");
  return (
    <View style={{ height: 200 }}>
      <ScrollView
        horizontal={true}
        bounces={false}
        style={styles.scrollViewStyle}
      >
        {post.products.map((data1, index1) => {
          return (
            <View style={styles.productListingWrapper}>
              <TouchableOpacity
                style={styles.productTouchable}
                onPress={() => {
                  navigator.push({
                    screen: "hairfolio.ProductDetail",
                    navigatorStyle: NavigatorStyles.tab,
                    passProps: {
                      prod_id: data1.id,
                      categoryTitle: data1.name,
                      isFromFeed:true
                    }
                  });
                }}
              >
                <Image
                  defaultSource={placeholder_icon}
                  source={
                    data1.product_image
                      ? { uri: data1.product_image }
                      : placeholder_icon
                  }
                  style={styles.productImage}
                />
              </TouchableOpacity>
              <Text style={styles.productName} numberOfLines={1}>
                {data1.name}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  productListingWrapper: {
    width: h(220),
    height: h(300),
    marginRight: 5,
    marginLeft: 5
  },
  productTouchable: {
    height: h(300),
    width: h(220),
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    shadowOpacity: 0.1,
    shadowOffset: {
      height: 1.2,
      width: 1.2
    },
    backgroundColor: COLORS.WHITE
  },
  productImage: {
    height: h(300),
    width: h(220),
    borderRadius: 5,
    flex:1,
    resizeMode: "contain"
  },
  productName: {
    fontFamily: FONTS.LIGHT,
    fontSize: h(24),
    textAlign: "center",
    color: COLORS.DARK,
    backgroundColor: "transparent",
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5
  },
  scrollViewStyle: {
    width: windowWidth - 15,
    marginLeft: -5,
    paddingTop: 5,
    paddingRight: 5,
    paddingLeft: 2,
    paddingBottom: 20,
    display: "flex"
  }
});

export default ProductPostList;
