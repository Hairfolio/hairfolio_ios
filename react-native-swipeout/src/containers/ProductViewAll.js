import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BlackHeader from "../components/BlackHeader";
import MenuItemsRow from '../components/Product/MenuItems';
import ProductElement from '../components/Product/ProductComponent';
import { ActivityIndicator, showLog, StatusBar, windowHeight, windowWidth } from '../helpers';
import AllProductStore from '../mobx/stores/hfStore/AllProductStore';
import NewArrivalStore from '../mobx/stores/hfStore/NewArrivalStore';
import TrendingStore from '../mobx/stores/hfStore/TrendingStore';
import WishListStore from '../mobx/stores/hfStore/WishListStore';
import { COLORS, FONTS, h } from '../style';
import FilterProduct from './FilterProduct';
import ProductTagStore from '../mobx/stores/ProductTagStore';
import NewArrivalsProduct from '../components/Product/NewArrivalsComponent';
import TrendingProduct from '../components/Product/TrendingComponent';
import SearchProductStore from '../mobx/stores/hfStore/SearchProductsStore';

var priorState;

@observer
export default class ProductViewAll extends Component {

  constructor(props) {

    super(props);
    this.state = {
      ProductList: [],
      showModal: false,
      showFilterModal: false,
      isFrom:props.isFrom
    };

    priorState = props.isFrom;
    showLog("PROD VIEW ALL IS FROM ==> "+JSON.stringify(priorState))

    this.hideFilterModel = this.hideFilterModel.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    // this.buildAnimations(props);
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content');

    let store = ProductTagStore;
    // alert("PRODUCT VIEW ALL ==> "+JSON.stringify(this.props.isFrom))
    if(SearchProductStore.isFrom)
    {
      store.load(SearchProductStore.searchString, true,"","");
    }
    else
    {
      store.load("", true,"","");
    }
    ProductTagStore.loadMenu();
  }

  componentWillUnmount(){
    StatusBar.setBarStyle('dark-content')
  }

  returnBlank() {
    return 'There are no products yet.';
  }

  goToScreen(isShowModal, screenName) {
    this.setState({ showModal: isShowModal })
  }

  hideFilterModel(){
    this.setState({ showFilterModal: !this.state.showFilterModal })
  }

  async resetFilter(){
    let store = ProductTagStore;
    // store.headerProductMenu = await store.headerResetMenu;
    // store.sidebarProductMenu = await store.sidebarResetMenu;
    store.inputText = "";
    store.minPrice = 0;
    // store.maxPrice = 5000;
    store.maxPrice = 400;
    store.load("", true,"","");
    this.hideFilterModel();
  }

  filterModalMenu() {
    return (
      <Modal
        style={{ backgroundColor: 'red' }}
        animationType={"none"}
        visible={this.state.showFilterModal}
        transparent={true}
      // swipeDirection={"left"}
      >

        <TouchableOpacity style={styles.modalClickView}
          activeOpacity={1}
          onPress={() => {
            SearchProductStore.isFrom = false;
            SearchProductStore.searchString = "";
            SearchProductStore.updateValues();
            SearchProductStore.products = [];
            ProductTagStore.isNewArrival = null;
            ProductTagStore.isTrending = null;
            ProductTagStore.sale_id = null;
            this.setState({ showFilterModal: !this.state.showFilterModal })
          }} >

          {/* <FilterProduct /> */}
        </TouchableOpacity>
        <View style={styles.filterModal}>
          <FilterProduct onChange={() => {this.hideFilterModel()}} onClear = { ()=>{ this.resetFilter()}}/>
        </View>
      </Modal>
    );
  }


  modalMenu() {
    return (
      <Modal
        // animationType='fade'
        visible={this.state.showModal}
        transparent={true}
      >

        <TouchableOpacity style={styles.modalClickView}
          activeOpacity={1}
          onPress={() => {
            
            this.setState({ showModal: !this.state.showModal })

          }} >
          <View style={styles.modal}>

            <MenuItemsRow
              //  source={require('img/star_fill_icon.png')}
              menuItemText="Price Low to High"
              isDivider={true}
              onPress={() => {
                this.goToScreen(false, 'hairfolio.WishList')
              }} />

            <MenuItemsRow
              // source={require('img/rating_fill_icon.png')}  
              menuItemText="Price High to Low"
              isDivider={true}
              onPress={() => {
                this.goToScreen(false, 'hairfolio.OrderHistory')
              }} />

            <MenuItemsRow
              // source={require('img/wallet_icon.png')}
              menuItemText=" A to Z "
              isDivider={true}
              onPress={() => {
                this.goToScreen(false, 'hairfolio.Wallet')
              }} />

            <MenuItemsRow
              // source={require('img/wallet_icon.png')}
              menuItemText=" Z to A "
              isDivider={false}
              onPress={() => {
                this.goToScreen(false, 'hairfolio.Wallet')
              }} />

            {/* <MenuItemsRow source={require('img/wallet_icon.png')}
              menuItemText="HF Bank"
              isDivider = {false}
              onPress={() => {
                this.goToScreen(false, 'hairfolio.Wallet')
              }} /> */}

          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  render() {
    let productTagStore = ProductTagStore;
    showLog("PRODUCTS LENGTH ==> " + ProductTagStore.products.length)
    
    let wishListStore = WishListStore;
    let content = (
      <View style={styles.indicator}>
        <ActivityIndicator size='large' />
      </View>
    );

    // if (store.isLoading || wishListStore.isLoading || productTagStore.isLoading) {
      if (wishListStore.isLoading || productTagStore.isLoading) {
      content = (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    } else if (productTagStore.products.length == 0) {
    // } else if (productTagStore.products.length == 0 && SearchProductStore.products.length == 0) {
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

        {(ProductTagStore.isChanged) ? 
            <ProductElement tabLabel="Sort by" 
                            isChanged = {ProductTagStore.isChanged}
                            navigator={this.props.navigator}
                            isFrom = {this.state.isFrom}
                            categoryTitle={this.props.categoryTitle} />
        :
          null
        }

            
          
        </View>
      );
    }

    return (
      <View style={{
        flex: 1,
        backgroundColor: COLORS.WHITE
      }}>

        <BlackHeader
          onLeft={() => {
            Promise.all([NewArrivalStore.getNewArrivalCategories(1), TrendingStore.getTrendingCategories()])
          
            this.props.navigator.pop({ animated: true })
            StatusBar.setBarStyle('dark-content')
            ProductTagStore.minPrice = 0;
            // ProductTagStore.maxPrice = 5000;
            ProductTagStore.maxPrice = 400;
          }}
          title={"Results"}
          //{this.props.categoryTitle}
          onRenderRight={() => (
            <View style={{ flexDirection: "row" }}>


              <TouchableOpacity
                onPress={() => {}}
              >
                <Image
                  style={{
                    width: h(38),
                    height: h(38),
                    alignSelf: "flex-end",
                    marginRight: 15,
                    // tintColor:COLORS.WHITE,
                    tintColor: 'transparent',
                    resizeMode: "contain"
                  }}
                  source={require("img/setting-iwhite-icon.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  
                  SearchProductStore.isFrom = false;
                  SearchProductStore.searchString = "";
                  SearchProductStore.updateValues();
                  SearchProductStore.products = [];

                  ProductTagStore.isNewArrival = null;
                  ProductTagStore.isTrending = null;
                  ProductTagStore.sale_id = null;

                  if(ProductTagStore.headerProductMenu.length<1 || ProductTagStore.sidebarProductMenu.length<1){
                    ProductTagStore.loadMenu();
                  }
                  this.setState({ showFilterModal: true })
                }}>
                <Image
                  style={{
                    width: h(38),
                    height: h(38),
                    alignSelf: "flex-end",
                    marginRight: 15,
                    // padding:12,

                  }}
                  source={require("img/filter.png")}
                />
              </TouchableOpacity>

            </View>

          )}
        />
        {this.filterModalMenu()}
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
      windowHeight - (h(88) + 90) :
      windowHeight - (h(88) + 70),
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
