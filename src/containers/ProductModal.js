import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View, Image, TouchableWithoutFeedback, TextInput, ListView, StyleSheet } from 'react-native';
import { windowHeight, windowWidth, h, COLORS, FONTS } from '../helpers';
import { SCALE } from '../style';
import { observer } from 'mobx-react/native';

const ProductRow = observer(({ item, index, onPress, store }) => {
  let placeholder_icon = require('img/medium_placeholder_icon.png');
  return (
    <View
      style={styles.listRowContainer}>
      <TouchableOpacity
        style={styles.btnClickView}
        onPress={onPress}>
        <View style={{paddingHorizontal:5, paddingTop:5, alignSelf:'flex-end'}}>
          {(item.discount_percentage) ?
            <View>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={styles.priceLabel}>{(item.price) ? ("$" + item.price) : "$0.0"}</Text>

                <Text
                  style={styles.finalPriceLabel}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
              </View>
              <Text
                style={styles.finalPriceLabel}>{item.discount_percentage}% off</Text>
            </View>
            :
            <Text
              style={[styles.finalPriceLabel, { color: COLORS.BLACK }]}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
          }
        </View>
        <Image
          // source={(item.product_image) ? { uri: (BASE_URL + item.product_image)} : require('img/medium_placeholder_icon.png')}
          defaultSource={placeholder_icon}
          source={(item.product_image) ? { uri: item.product_image } : placeholder_icon}
          style={styles.imageView} />
      </TouchableOpacity>

      <Text
        style={styles.itemNameView}
        numberOfLines={2}>{item.name}</Text>

    </View>
  );
});

var products = [
  {
    "id": 104,
    "name": "Specifique Oily Scalp Set 111111111 dfjkjgjkhd kmdfjgjkldfgh kdfgkldklf dfhjgdjkghdfk dfkhgkdfhgkdfjg kdfhgkhdfh dfkjhgkdfhg kdfhgkdhf kdhgkdhg",
    "product_thumb": "https://d23qi8xb3q5mph.cloudfront.net/uploads/prod_thumb_image_DA4CF6E3-9BB2-444E-9972-BEAC0C4460BC.png",
    "is_favourite": false,
    "is_trending": true,
    "new_arrival": true,
    "price": "82.80",
    "short_description": "Energizing set for oily scalp.\r\n",
    "description": "Product set for oily roots. Product Set Includes:\r\nBain Divalent: Silicone free. Nourishes sensitized hair fibers from roots to ends. Purifies the scalp while nourishing the lengths. Gives hair a soft, shiny feel.\r\nMasque Hydra-Apaisant: Silicone free. Moisturizes and soothes scalp discomforts. Provides softness, suppleness and lightness to the hair.\r\nAward Winner: Oprah Magazine Fall 2017 Beauty O-Ward Winner. Best product for frizzy hair.Bain\r\nGlycine: regulates sebum production to help purify the scalp\r\nVitamin B6: nourishes and strengthens the fiber\r\n\r\nMasque\r\nL-Carnosine: limits ridging of dermal proteins, collagen fibers and elastin\r\nVitamin E: protects hair protein and eliminates free radicals\r\nMoringa: cleans the scalp from pollutants",
    "product_image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/DA4CF6E3-9BB2-444E-9972-BEAC0C4460BC.png",
    "quantity": 6,
    "favourites_count": null,
    "link_url": "",
    "image_url": "",
    "cloudinary_url": "",
    "created_at": "2019-07-11T03:38:05.357Z",
    "categories": [],
    "final_price": "82.80",
    "discount_percentage": null,
    "tag": null,
    "product_brand": {
      "id": 4,
      "title": "Kerastase",
      "image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/download.png",
      "name": "Kerastase"
    },
    "product_galleries": [],
    "hair_types": [
      {
        "id": 7,
        "name": "Oily Hair"
      }
    ],
    "product_types": [
      {
        "id": 16,
        "name": "Deep Conditioning Mask"
      },
      {
        "id": 15,
        "name": "Scalp Treatment"
      },
      {
        "id": 10,
        "name": "Hair Care Kits and Value Sets"
      },
      {
        "id": 4,
        "name": "Leave In Conditioner"
      },
      {
        "id": 3,
        "name": "Hair Treatments"
      },
      {
        "id": 2,
        "name": "Conditioner"
      },
      {
        "id": 1,
        "name": "Shampoo"
      }
    ],
    "ingredients": [],
    "preferences": [],
    "styling_tools": [],
    "consistency_types": [
      {
        "id": 3,
        "name": "Cream"
      }
    ],
    "collection": {
      "id": 7,
      "name": "Reparative"
    },
    "shampoo": {
      "id": 7,
      "name": "Oily Hair"
    },
    "conditioner": {
      "id": 7,
      "name": "Oily Hair"
    },
    "styling_product": null
  },
  {
    "id": 103,
    "name": "Specifique Oily Hair Set",
    "product_thumb": "https://d23qi8xb3q5mph.cloudfront.net/uploads/prod_thumb_image_7A69B887-0F1A-48EB-A604-CFC7A47AFBA9.png",
    "is_favourite": false,
    "is_trending": true,
    "new_arrival": true,
    "price": "128.70",
    "short_description": "For oily roots and sensitized lengths.",
    "description": "Hair set that nourishes sensitized hair fibers from roots to ends, purifies the scalp and gives hair a soft, shiny feel. The set includes a shampoo, hair mask and an advanced hair and scalp treatment hair serum.",
    "product_image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/7A69B887-0F1A-48EB-A604-CFC7A47AFBA9.png",
    "quantity": 6,
    "favourites_count": null,
    "link_url": "",
    "image_url": "",
    "cloudinary_url": "",
    "created_at": "2019-07-11T03:26:51.622Z",
    "categories": [],
    "final_price": "128.70",
    "discount_percentage": null,
    "tag": null,
    "product_brand": {
      "id": 4,
      "title": "Kerastase",
      "image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/download.png",
      "name": "Kerastase"
    },
    "product_galleries": [],
    "hair_types": [
      {
        "id": 7,
        "name": "Oily Hair"
      }
    ],
    "product_types": [
      {
        "id": 16,
        "name": "Deep Conditioning Mask"
      },
      {
        "id": 15,
        "name": "Scalp Treatment"
      },
      {
        "id": 14,
        "name": "U/V Protection"
      },
      {
        "id": 10,
        "name": "Hair Care Kits and Value Sets"
      },
      {
        "id": 2,
        "name": "Conditioner"
      },
      {
        "id": 1,
        "name": "Shampoo"
      }
    ],
    "ingredients": [],
    "preferences": [],
    "styling_tools": [],
    "consistency_types": [
      {
        "id": 8,
        "name": "Oil"
      },
      {
        "id": 3,
        "name": "Cream"
      }
    ],
    "collection": {
      "id": 7,
      "name": "Reparative"
    },
    "shampoo": {
      "id": 7,
      "name": "Oily Hair"
    },
    "conditioner": {
      "id": 7,
      "name": "Oily Hair"
    },
    "styling_product": null
  },
  {
    "id": 102,
    "name": "Specifique Thinning Hair Set",
    "product_thumb": "https://d23qi8xb3q5mph.cloudfront.net/uploads/prod_thumb_image_CFC73A6C-A7A0-48CF-860A-0AF1BFB0FD36.png",
    "is_favourite": false,
    "is_trending": true,
    "new_arrival": true,
    "price": "127.80",
    "short_description": "Scalp and hair treatment set for thinning hair.",
    "description": "Hair set that aims to soothe the scalp, give hair volume and provide energy in order to stimulate fiber production and regenerate hair metabolism. The set includes a shampoo, hair mask and an advanced scalp treatme",
    "product_image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/CFC73A6C-A7A0-48CF-860A-0AF1BFB0FD36.png",
    "quantity": 6,
    "favourites_count": null,
    "link_url": "",
    "image_url": "",
    "cloudinary_url": "",
    "created_at": "2019-07-11T03:18:50.968Z",
    "categories": [],
    "final_price": "127.80",
    "discount_percentage": null,
    "tag": null,
    "product_brand": {
      "id": 4,
      "title": "Kerastase",
      "image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/download.png",
      "name": "Kerastase"
    },
    "product_galleries": [],
    "hair_types": [
      {
        "id": 12,
        "name": "Thinning Hair"
      }
    ],
    "product_types": [
      {
        "id": 15,
        "name": "Scalp Treatment"
      },
      {
        "id": 3,
        "name": "Hair Treatments"
      },
      {
        "id": 2,
        "name": "Conditioner"
      },
      {
        "id": 1,
        "name": "Shampoo"
      }
    ],
    "ingredients": [],
    "preferences": [
      {
        "id": 15,
        "name": " Silicone free,"
      },
      {
        "id": 13,
        "name": "Hypoallergenic"
      }
    ],
    "styling_tools": [],
    "consistency_types": [
      {
        "id": 3,
        "name": "Cream"
      }
    ],
    "collection": {
      "id": 7,
      "name": "Reparative"
    },
    "shampoo": null,
    "conditioner": {
      "id": 11,
      "name": "Thinning Hair"
    },
    "styling_product": null
  },
  {
    "id": 104,
    "name": "Specifique Oily Scalp Set",
    "product_thumb": "https://d23qi8xb3q5mph.cloudfront.net/uploads/prod_thumb_image_DA4CF6E3-9BB2-444E-9972-BEAC0C4460BC.png",
    "is_favourite": false,
    "is_trending": true,
    "new_arrival": true,
    "price": "82.80",
    "short_description": "Energizing set for oily scalp.\r\n",
    "description": "Product set for oily roots. Product Set Includes:\r\nBain Divalent: Silicone free. Nourishes sensitized hair fibers from roots to ends. Purifies the scalp while nourishing the lengths. Gives hair a soft, shiny feel.\r\nMasque Hydra-Apaisant: Silicone free. Moisturizes and soothes scalp discomforts. Provides softness, suppleness and lightness to the hair.\r\nAward Winner: Oprah Magazine Fall 2017 Beauty O-Ward Winner. Best product for frizzy hair.Bain\r\nGlycine: regulates sebum production to help purify the scalp\r\nVitamin B6: nourishes and strengthens the fiber\r\n\r\nMasque\r\nL-Carnosine: limits ridging of dermal proteins, collagen fibers and elastin\r\nVitamin E: protects hair protein and eliminates free radicals\r\nMoringa: cleans the scalp from pollutants",
    "product_image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/DA4CF6E3-9BB2-444E-9972-BEAC0C4460BC.png",
    "quantity": 6,
    "favourites_count": null,
    "link_url": "",
    "image_url": "",
    "cloudinary_url": "",
    "created_at": "2019-07-11T03:38:05.357Z",
    "categories": [],
    "final_price": "82.80",
    "discount_percentage": null,
    "tag": null,
    "product_brand": {
      "id": 4,
      "title": "Kerastase",
      "image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/download.png",
      "name": "Kerastase"
    },
    "product_galleries": [],
    "hair_types": [
      {
        "id": 7,
        "name": "Oily Hair"
      }
    ],
    "product_types": [
      {
        "id": 16,
        "name": "Deep Conditioning Mask"
      },
      {
        "id": 15,
        "name": "Scalp Treatment"
      },
      {
        "id": 10,
        "name": "Hair Care Kits and Value Sets"
      },
      {
        "id": 4,
        "name": "Leave In Conditioner"
      },
      {
        "id": 3,
        "name": "Hair Treatments"
      },
      {
        "id": 2,
        "name": "Conditioner"
      },
      {
        "id": 1,
        "name": "Shampoo"
      }
    ],
    "ingredients": [],
    "preferences": [],
    "styling_tools": [],
    "consistency_types": [
      {
        "id": 3,
        "name": "Cream"
      }
    ],
    "collection": {
      "id": 7,
      "name": "Reparative"
    },
    "shampoo": {
      "id": 7,
      "name": "Oily Hair"
    },
    "conditioner": {
      "id": 7,
      "name": "Oily Hair"
    },
    "styling_product": null
  },
  {
    "id": 104,
    "name": "Specifique Oily Scalp Set",
    "product_thumb": "https://d23qi8xb3q5mph.cloudfront.net/uploads/prod_thumb_image_DA4CF6E3-9BB2-444E-9972-BEAC0C4460BC.png",
    "is_favourite": false,
    "is_trending": true,
    "new_arrival": true,
    "price": "82.80",
    "short_description": "Energizing set for oily scalp.\r\n",
    "description": "Product set for oily roots. Product Set Includes:\r\nBain Divalent: Silicone free. Nourishes sensitized hair fibers from roots to ends. Purifies the scalp while nourishing the lengths. Gives hair a soft, shiny feel.\r\nMasque Hydra-Apaisant: Silicone free. Moisturizes and soothes scalp discomforts. Provides softness, suppleness and lightness to the hair.\r\nAward Winner: Oprah Magazine Fall 2017 Beauty O-Ward Winner. Best product for frizzy hair.Bain\r\nGlycine: regulates sebum production to help purify the scalp\r\nVitamin B6: nourishes and strengthens the fiber\r\n\r\nMasque\r\nL-Carnosine: limits ridging of dermal proteins, collagen fibers and elastin\r\nVitamin E: protects hair protein and eliminates free radicals\r\nMoringa: cleans the scalp from pollutants",
    "product_image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/DA4CF6E3-9BB2-444E-9972-BEAC0C4460BC.png",
    "quantity": 6,
    "favourites_count": null,
    "link_url": "",
    "image_url": "",
    "cloudinary_url": "",
    "created_at": "2019-07-11T03:38:05.357Z",
    "categories": [],
    "final_price": "82.80",
    "discount_percentage": null,
    "tag": null,
    "product_brand": {
      "id": 4,
      "title": "Kerastase",
      "image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/download.png",
      "name": "Kerastase"
    },
    "product_galleries": [],
    "hair_types": [
      {
        "id": 7,
        "name": "Oily Hair"
      }
    ],
    "product_types": [
      {
        "id": 16,
        "name": "Deep Conditioning Mask"
      },
      {
        "id": 15,
        "name": "Scalp Treatment"
      },
      {
        "id": 10,
        "name": "Hair Care Kits and Value Sets"
      },
      {
        "id": 4,
        "name": "Leave In Conditioner"
      },
      {
        "id": 3,
        "name": "Hair Treatments"
      },
      {
        "id": 2,
        "name": "Conditioner"
      },
      {
        "id": 1,
        "name": "Shampoo"
      }
    ],
    "ingredients": [],
    "preferences": [],
    "styling_tools": [],
    "consistency_types": [
      {
        "id": 3,
        "name": "Cream"
      }
    ],
    "collection": {
      "id": 7,
      "name": "Reparative"
    },
    "shampoo": {
      "id": 7,
      "name": "Oily Hair"
    },
    "conditioner": {
      "id": 7,
      "name": "Oily Hair"
    },
    "styling_product": null
  },
]

export default class ProductModal extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      modalVisible: false,
      productArr: ds.cloneWithRows(products.slice())
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  renderModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => { this.setModalVisible(false) }}>
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor:'rgb(0,0,0,0.1)',  }}
          activeOpacity={1}
        // onPressOut={() => { this.setModalVisible(false) }}
        >
          <View style={{ alignSelf: 'flex-end', borderTopLeftRadius: 10, borderTopRightRadius: 10, height: windowHeight / 1.25, width: windowWidth, backgroundColor: COLORS.WHITE }}>
            <Image source={require('img/product.png')} style={{ alignSelf: 'center', width: 40, height: 40, resizeMode: 'contain', position: 'absolute', top: -20 }} />
            <TouchableOpacity
              style={{ padding: 15, alignSelf: 'flex-end' }}
              onPress={() => { this.setModalVisible(false) }}
            >
              <Image source={require('img/close.png')} style={{}} />
            </TouchableOpacity>

            {/* SearchView */}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: COLORS.WHITE,
                // width: windowWidth, 
                height: 30,
                marginHorizontal: 15,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 1,
                marginBottom:5
              }}>
              <TextInput
                autoCorrect={false}
                returnKeyType='search'
                // onSubmitEditing={
                //   () => {
                //     SearchDetailsStore.search();
                //   }
                // }
                // onChangeText={text => {
                //   SearchDetailsStore.searchString = text;
                // }}
                // ref={el => {
                //   SearchDetailsStore.input = el;
                //   window.myInput = el;
                // } }
                placeholder='Search Product'
                placeholderTextColor={COLORS.DARK}
                style={{
                  flex: 1,
                  paddingHorizontal: 15,
                  fontSize: h(30),
                  fontFamily:FONTS.MEDIUM,
                  color: COLORS.DARK,
                }}
              />
            </View>

            {
              this.renderProductsListView()
            }
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }

  async onClickObject(item, index) {
  }

  renderProductsListView = () => {
    return (
      <ListView
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContainer}
        bounces={false}
        enableEmptySections={true}
        dataSource={(this.state.productArr)}
        renderRow={(item, index) => {
          return (
            <ProductRow
              onPress={() => {
                this.onClickObject(item, index)
              }}
              item={item}
              indx={index}

            />
          );
        }}
        onEndReached={() => {
          // if (SearchProductStore.isFrom) {
          // 	//  pStore.loadNextPage();
          // 	ProductTagStore.loadNextPageNew(SearchProductStore.searchString, true);
          // }
          // else {
          // 	ProductTagStore.loadNextPageNew(ProductTagStore.lastSearchedText, true);
          // }

        }}
        renderFooter={() => {

          // if (ProductTagStore.nextPage != null) {

          // 	return (
          // 		<View
          // 			style={{
          // 				flex: 1,
          // 				width: windowWidth,
          // 				paddingVertical: 20,
          // 				alignItems: "center",
          // 				justifyContent: "center",
          // 				left: 0,
          // 				right: 0,
          // 				bottom: -10,
          // 				position: 'absolute'
          // 			}}
          // 		>
          // 			<ActivityIndicator size="large" />
          // 		</View>
          // 	);
          // } else {
          // 	return <View />;
          // }
        }
        } />
    )
  }

  render() {
    return (
      <View style={{ marginTop: 22, flex: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: 'red' }}>
        {this.renderModal()}

        <TouchableOpacity
          style={{ alignSelf: 'center', }}
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Text>Show Modal</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  productImageView: {
    flex: 1,
    width: (windowWidth / 2) - 30,
    height: (windowHeight / 2) - 150,
    resizeMode: 'contain',
  },
  imageClickView: {
    position: 'absolute',
    top: 7,
    right: 7,
  },
  priceLabel: {
    color: COLORS.GRAY2,
    fontFamily: FONTS.ROMAN,
    fontSize: SCALE.h(27),
    textDecorationLine: 'line-through'
  },
  finalPriceLabel: {
    color: COLORS.BLACK,
    fontFamily: FONTS.ROMAN,
    fontSize: SCALE.h(27),
    marginLeft: 10
  },
  listContainer: {
    padding: 10,
    // backgroundColor: COLORS.PINK,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  listRowContainer: {
    margin: 5,
    marginTop: 10,
    // width: (windowWidth / 2) - 20,
    // height: (windowHeight / 2) - 150,
    width: (windowWidth / 2) - 20,
		height: (windowHeight / 2) - 100,
  },
  btnClickView: {
    borderRadius: 5,
    // width: (windowWidth / 2) - 20,
    // height: (windowHeight / 2) - 200,
    width: (windowWidth / 2) - 20,
		height: (windowHeight / 2) - 150,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1
    // elevation: 1,
    // shadowOpacity: 0.10,
    // shadowOffset: {
    //   height: 1.2,
    //   width: 1.2
    // }
  },
  imageView: {
    flex: 1,
    // width: (windowWidth / 2) - 30,
    // height: (windowHeight / 2) - 300,
    width: (windowWidth / 2) - 30,
		height: (windowHeight / 2) - 150,
    resizeMode: 'contain',
  },
  itemNameView: {
    marginTop: 7,
    color: COLORS.BLACK,
    fontFamily: FONTS.LIGHT,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: SCALE.h(25),
  },
});