import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BlackHeader from "../components/BlackHeader";
import MenuItemsRow from '../components/Product/MenuItems';
import { ActivityIndicator, showLog, StatusBar, windowHeight, windowWidth } from '../helpers';
import RelatedAllProductStore from '../mobx/stores/hfStore/RelatedProductStore';
import WishListStore from '../mobx/stores/hfStore/WishListStore';
import { COLORS, FONTS, h } from '../style';
import FilterProduct from './FilterProduct';
import ProductTagStore from '../mobx/stores/ProductTagStore';
import RelatedProduct from './RelatedProductComponent';

@observer
export default class RelatedProductViewAll extends Component {

  constructor(props) {

    super(props);
    this.state = {
      ProductList: [],
      showModal: false,
      showFilterModal: false,
      isLoading:false
    };
    // this.hideFilterModel = this.hideFilterModel.bind(this);
    // this.resetFilter = this.resetFilter.bind(this);
    // this.buildAnimations(props);
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    // AllProductStore.load();
  }

  componentWillUnmount(){
    StatusBar.setBarStyle('dark-content')
  }

  returnBlank() {
    return 'There are no products yet.';
  }


  render() {
    let store = RelatedAllProductStore;
    let wishListStore = WishListStore;

    let content = (
      <View style={styles.indicator}>
        <ActivityIndicator size='large' />
      </View>
    );

    if (this.state.isLoading) {
      content = (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    } else if (store.relatedProducts.length == 0) {
      content = (
        <View style={{ flex: 1 }}>
          <Text
            style={{
              paddingTop: h(38),
              fontSize: h(34),
              textAlign: 'center',
              fontFamily: FONTS.BOOK_OBLIQUE
            }}
          >
            {this.returnBlank()}
          </Text>
        </View>
      );
    } else {

      content = (
        <View style={{ flex: 1 }}>
        <RelatedProduct tabLabel="Sort by" 
                          navigator={this.props.navigator}
                         categoryTitle={this.props.categoryTitle}
        />
        </View>
      );
    }

    return (
      <View style={{
        flex: 1,
        backgroundColor: COLORS.WHITE
      }}>

        <BlackHeader
          onLeft={() => {this.props.navigator.pop({ animated: true })
            StatusBar.setBarStyle('dark-content')
          }}
          title={this.props.categoryTitle}
        //   onRenderRight={() => (
        //     <View style={{ flexDirection: "row" }}>
        //     </View>

        //   )}
        />
        {content}
      </View>
    )
  }
}

const styles = StyleSheet.create({

  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuIconButton: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  modal: {
    padding: 5,
    position: 'absolute',
    right: 5,
    marginTop: (windowHeight > 800) ? h(88) + 40 : h(88) + 20,
    width: windowWidth * 40 / 100,
    alignItems: 'flex-end',
    elevation: 1,
    shadowOpacity: 0.40,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    shadowOffset: {
      height: 1.2,
      width: 1.2,
    },
    borderRadius: 5,

  },
  filterModal: {
    padding: 5,
    position: 'absolute',
    right: 5,
    marginTop: (windowHeight > 800) ? h(88) + 40 : h(88) + 20,
    width: windowWidth - 80,
    height: (windowHeight > 800) ?
      windowHeight - (h(88) + 100) :
      windowHeight - (h(88) + 80),
    elevation: 1,
    shadowOpacity: 0.40,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 40,
  },
  menuItems: {
    height: 40,
    justifyContent: 'flex-start',
    marginLeft: 5,
    alignItems: 'center',
    flexDirection: 'row'
  },
  modalClickView: {
    height: windowHeight,
    width: windowWidth,
    backgroundColor: COLORS.TRANSPARENT,
  }
});
