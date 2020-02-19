import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Dimensions, Image, Modal, StyleSheet, Text,TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import NavigatorStyles from '../common/NavigatorStyles';
import MenuItemsRow from '../components/Product/MenuItems';
import ProductHome from '../components/Product/ProductHome';
import WhiteHeader from '../components/WhiteHeader';
import { ActivityIndicator, ListView, StatusBar, showLog, windowHeight, windowWidth } from '../helpers';
import NewArrivalStore from '../mobx/stores/hfStore/NewArrivalStore';
import TrendingStore from '../mobx/stores/hfStore/TrendingStore';
import SalesStore from '../mobx/stores/hfStore/SalesStore';
import { COLORS, FONTS, h } from '../style';
var { height, width } = Dimensions.get('window');
import CartStore from '../mobx/stores/hfStore/CartStore';
import CartCounterView from '../components/CartCounterView';
import SalesProductHome from '../components/Product/SalesProductHome';
import SearchProductStore from '../mobx/stores/hfStore/SearchProductsStore';
import ProductTagStore from '../mobx/stores/ProductTagStore';
import CouponListStore from '../mobx/stores/hfStore/CouponListStore';

const SearchBar = observer(({ store, navigator }) => {
  showLog("store.searchString ==> " + SearchProductStore.isIconVisible);
  let text = "I'm looking for...";
  StatusBar.setBarStyle("dark-content", true);
  return (
    <View
      style={{
        width: windowWidth,
        // marginVertical: h(40),
        marginVertical: h(20),
        paddingHorizontal: h(25),
        flexDirection: "row",
        // backgroundColor:'red'
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.WHITE1,
          flex: 1,
          height: h(58),
          borderRadius: h(7),
          alignItems: "center",
          marginRight: 10,
          flexDirection: "row",
          // backgroundColor:'green'
        }}
      >
        <TextInput
          autoCorrect={false}
          returnKeyType="search"
          value={SearchProductStore.searchString}
          onSubmitEditing={() => {
            SearchStore.search();
          }}
          onChangeText={text => {
            SearchProductStore.searchString = text;
            SearchProductStore.updateValues();
          }}
          onSubmitEditing={
            async () => {
              // SearchDetailsStore.search();
              // let res = await SearchProductStore.load()
              SearchProductStore.isFrom = true;
              ProductTagStore.products=[];
              navigator.push({
                screen: 'hairfolio.ProductViewAll',
                navigatorStyle: NavigatorStyles.tab,
                passProps:{ 
                  categoryTitle : SearchProductStore.searchString, 
                  isFrom:'searchProduct'
                }
              });  
            }
          }
          ref={el => {
            SearchProductStore.input = el;
            window.myInput = el;
          }}
          placeholder={text}
          style={{
            flex: 1,
            marginLeft: h(14),
            fontSize: h(30),
            // color: COLORS.DARK6,
            color: COLORS.BLACK,
            backgroundColor: COLORS.TRANSPARENT
          }}

        />

        {SearchProductStore.isIconVisible ? (
          <TouchableOpacity
            onPress={() => {
              SearchProductStore.searchString = "";
              SearchProductStore.updateValues();
            }}
          >
            <View
              style={{
                paddingRight: h(23),
                justifyContent: "center",
                height: h(58)
              }}
            >
              <Image
                style={{ height: h(30), width: h(30) }}
                source={require("img/search_clear.png")}
              />
            </View>
          </TouchableOpacity>
        ) : null}
       
      </View>
    </View>
  );
});



@observer
export default class ProductModule extends Component { 
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));    
    this.state={
      showModal : false,
      isLoader: false
    };
  }

  onNavigatorEvent(event) {
    showLog("productmodule js ==>" + event.id);  
    switch (event.id) {
      case "willAppear":
        this.setState({ is_loaded: true });
        showLog("productmodule js ==>" + event.id);    
        CouponListStore.couponDiscount = "";
        CouponListStore.discountRate=0;
        ProductTagStore.minPrice = 0;
        // ProductTagStore.maxPrice = 5000;
        ProductTagStore.maxPrice = 400;
        this.loadScreenOnAppear();
        break;
      case "didAppear":
        showLog("productmodule js ==>" + event.id);
        CouponListStore.couponDiscount = "";
        CouponListStore.discountRate=0;    
        ProductTagStore.minPrice = 0;
        // ProductTagStore.maxPrice = 5000;
        ProductTagStore.maxPrice = 400;
        break;
      case "bottomTabSelected":
        showLog("productmodule js ==>" + event.id); 
        break;
      case "bottomTabReselected":
        showLog("productmodule js ==>" + event.id);
        CouponListStore.couponDiscount = "";
        CouponListStore.discountRate=0;
        ProductTagStore.minPrice = 0;
        // ProductTagStore.maxPrice = 5000;
        ProductTagStore.maxPrice = 400;
        this.loadScreenOnAppear();
           
        break;
      default:
        break;
    }
  }

  async loadScreenOnAppear() {
    
    StatusBar.setBarStyle('dark-content');

    // NewArrivalStore.load();
    // TrendingStore.load();
    CartStore.fetchCart();
    let bannrData = await NewArrivalStore.getMobileStoreBanners();
    if(bannrData)
    {
      NewArrivalStore.getBannerImage()
    }
    NewArrivalStore.getNewArrivalCategories(1);
    TrendingStore.getTrendingCategories();

  

    showLog("AFTER TRENDING")
    // if(trnding)
    // {
      showLog("BEFORE FETCH SALES")
       let saleDat = await SalesStore.getSales();
       
       if(saleDat)
      {
        SalesStore.getSalesProductsList(saleDat.sale.id);
      }
    // }
    
  }


  goToScreen(isShowModal,screenName)
  {
    this.setState({ showModal: isShowModal })
    this.props.navigator.push({
      screen: screenName,
      navigatorStyle: NavigatorStyles.tab,
    });
  }

  modalMenu() {
    
    return (
      <Modal
        // animationType='slide'
        visible={this.state.showModal}
        transparent={true}>

        <TouchableOpacity 
        activeOpacity={1}
        style={styles.modalClickView}
          onPress={() => { this.setState({ showModal: false }) }} >
          <View style={styles.modal}>

            <MenuItemsRow source={require('img/wishlist.png')}
                          menuItemText="Wishlist"
                          isDivider = {true}
                          onPress={() => {
                            this.goToScreen(false, 'hairfolio.WishList')
                          }} />

            <MenuItemsRow source={require('img/order_history.png')}
                          menuItemText="Order History"
                          isDivider = {true}
                          onPress={() => {
                            this.goToScreen(false, 'hairfolio.OrderHistory')
                          }} />

            <MenuItemsRow source={require('img/wallet.png')}
                          menuItemText="Wallet"
                          isDivider = {true}
                          onPress={() => {
                            this.goToScreen(false, 'hairfolio.Wallet')
                          }} />

            <MenuItemsRow source={require('img/notification.png')}
                          menuItemText="Notifications"
                          isDivider = {true}
                          onPress={() => {
                            this.goToScreen(false, 'hairfolio.Notifications')
                          }} />

              <MenuItemsRow source={require('img/refer_earn.png')}
                            menuItemText="Refer And Earn"
                            isDivider = {false}
                            onPress={() => {
                              this.goToScreen(false, 'hairfolio.ReferAndEarn')
                            }} />

          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  returnBlank(){
    StatusBar.setBarStyle('dark-content', true);   
    return 'There is no data.';
  }

  

  renderProductSearchBar(){

    return(
      // <SearchHeader navigator={this.props.navigator}/>
      <SearchBar navigator={this.props.navigator}/>
    )

  }

  render() {
    if (this.state.is_loaded) {
      return this.render2();
    } else {
      return null;
    }
  }

  render2() {
    showLog("PRODUCT JS ==>");
    let store = NewArrivalStore;
    let trendingStore = TrendingStore;
    let content = (
      <View style={styles.indicator}>
        <ActivityIndicator size='large' />
      </View>
    );

    if (store.isLoading) {
      content = (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size='large' />
        </View>
      );
    } else  if (store.categories.length == 0) {
      content =  (
        <View style={{flex: 1}}>
          <Text
            style= {{
              paddingTop: h(38),
              fontSize: h(34),
              textAlign: 'center',
              fontFamily: FONTS.BOOK_OBLIQUE
            }}
          >
            { this.returnBlank() }
          </Text>
        </View>
      );
    } else {
      content = (

      <ScrollView>

      {(NewArrivalStore.categories.length > 0) ? 
              <ProductHome  product={store.categories} 
                            productImage={(NewArrivalStore.mobileStoreBanners.length>0)?
                              NewArrivalStore.newArrivalBanner? 
                              NewArrivalStore.newArrivalBanner:
                              ""
                              :""
                            }
                            navigator={this.props.navigator}
                            title={"New Arrivals"} />

      :
      null                         
    }
       {(TrendingStore.trendingProducts.length > 0) ?
            <ProductHome product={trendingStore.trendingProducts}
                         productImage={(NewArrivalStore.mobileStoreBanners.length > 0) ?
                                        NewArrivalStore.trendingNowBanner? 
                                        NewArrivalStore.trendingNowBanner:
                                          ""
                                          : ""
                          }
              navigator={this.props.navigator}
              title={"Trending Now"} />  
          :

          null

      
        } 
        

      {(SalesStore.saleData && SalesStore.saleData != null) ? 
      
        (SalesStore.saleData.sale) ?
          (SalesStore.saleData.sale.active)?
                <SalesProductHome product={SalesStore.saleData}
                  productImage={(NewArrivalStore.mobileStoreBanners.length > 0) ?
                    NewArrivalStore.saleBanner? 
                    NewArrivalStore.saleBanner:
                      ""
                    : ""
                  }
                  navigator={this.props.navigator}
                  title={"Sale"} />

        :
        null
        :
        null
        :
        null
    
    }
                                        

     </ScrollView>
        
       
      );
    }

    return (
      <View style={styles.oneFlex}>
        <WhiteHeader
          onRenderRight={() =>
            <View style={{ flexDirection: "row", 
                           marginLeft:-20,
                           justifyContent:'flex-end'
                        }}>

              <TouchableOpacity
                // style={styles.rightMenuIcon}
                onPress={
                  () => {
                    this.props.navigator.push({
                      screen: 'hairfolio.CartList',
                      navigatorStyle: NavigatorStyles.tab,
                    });
                  }
                }
              >
                <Image
                  style={styles.rightMenuIcon1}
                  // source={require('img/more_icon.png')}
                  source={require('img/cart_icon.png')}
                />
               <CartCounterView numberOfBagItems={CartStore.numberOfBagItems}/>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.rightMenuIcon, {marginRight:0,marginLeft:15}]}

                onPress={
                  () => {
                    
                    if (this.state.showModal) {
                      this.setState({ showModal: false })
                    }
                    else {
                      this.setState({ showModal: true })
                    }

                  }
                }
              >
                <Image
                  style={styles.rightMenuIcon1}
                  source={require('img/menu_icon.png')}
                />
              </TouchableOpacity>

            </View>
          }
          title='Hairfolio Store'
          titleStyle={{
            fontFamily: FONTS.SF_BOLD,
            color: COLORS.BLACK
          }}
        />
        {this.modalMenu()}
        {this.renderProductSearchBar()}
        {content}

      </View>
    );
  }



  renderHELLO() {
    
    let store = NewArrivalStore;
    let trendingStore = TrendingStore;
    let content = (
      <View style={styles.indicator}>
        <ActivityIndicator size='large' />
      </View>
    );

    if (store.isLoading) {
      content = (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size='large' />
        </View>
      );
    } else  if (store.categories.length == 0) {
      content =  (
        <View style={{flex: 1}}>
          <Text
            style= {{
              paddingTop: h(38),
              fontSize: h(34),
              textAlign: 'center',
              fontFamily: FONTS.BOOK_OBLIQUE
            }}
          >
            { this.returnBlank() }
          </Text>
        </View>
      );
    } else {
      content = (

        <ListView
          dataSource={store.dataSource}
          renderRow={(p, i) => 
          // <ProductHome product={p} navigator={this.props.navigator}/> 
          // showLog("PRODUCT AT ==> "+{i}+" is ==> "+JSON.stringify(p))
          (p == "New Arrivals")?
          
            <ProductHome product={store.categories} 
                         navigator={this.props.navigator}
                         title={p} />
            :
          
            (p == "Trending") ?
                <ProductHome product={trendingStore.trendingProducts} 
                             navigator={this.props.navigator} 
                             title={p} />
                :
                (SalesStore.saleData != null)?
                  (SalesStore.saleData.sale.active)?
                     <SalesProductHome product={SalesStore.saleData}
                      navigator={this.props.navigator}
                      title={"Sale"} />
                  :
                  null
                  :
                  null
                
        }
          
        />

        
        // <ProductHome product={p} navigator={this.props.navigator}/>
       
      );
    }

    return (
      <View style={styles.oneFlex}>
        <WhiteHeader
          onRenderRight={() =>
            <View style={{ flexDirection: "row", marginLeft:-20,justifyContent:'flex-end' }}>

              <TouchableOpacity
                style={styles.rightMenuIcon}
                onPress={
                  () => {
                    this.props.navigator.push({
                      screen: 'hairfolio.CartList',
                      navigatorStyle: NavigatorStyles.tab,
                    });
                  }
                }
              >
                <Image
                  style={styles.rightMenuIcon1}
                  // source={require('img/more_icon.png')}
                  source={require('img/cart_icon.png')}
                />
               <CartCounterView numberOfBagItems={CartStore.numberOfBagItems}/>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.rightMenuIcon, {marginRight:0,marginLeft:10}]}

                onPress={
                  () => {
                    
                    if (this.state.showModal) {
                      this.setState({ showModal: false })
                    }
                    else {
                      this.setState({ showModal: true })
                    }

                  }
                }
              >
                <Image
                  style={styles.rightMenuIcon1}
                  source={require('img/menu_icon.png')}
                />
              </TouchableOpacity>

            </View>
          }
          title='Hairfolio Store'
          titleStyle={{
            fontFamily: FONTS.SF_BOLD,
            color: COLORS.BLACK
          }}
        />
        {this.modalMenu()}
        {content}

      </View>
    );
  }

}

const styles = StyleSheet.create({
  oneFlex: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightMenuIcon: {
    width: h(35),
    height: h(35),
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  rightMenuIconCartNew: {
    width: h(38),
    height: h(38),
    tintColor:COLORS.BLACK,
  },
  rightMenuIcon1: {
    // width: h(38),
    // height: h(38),
    width: h(45),
    height: h(42),
    alignSelf: 'flex-end',
    tintColor: COLORS.BLACK,
  },
  rightMenuIconCart: {
    width: h(38),
    height: h(38),
    alignSelf: 'flex-end',
    tintColor: COLORS.BLACK,
    marginRight:5,
    alignSelf:'center'
  },
  menuIconButton:{
    width:"100%",
    flexDirection:'row',
    justifyContent:'flex-end'
  },
  modal: {
    padding:5,
    position:'absolute',
    right:5,
    marginTop: (height>800) ? h(88)+40 : h(88)+20,
    width: (height<600) ? width*50/100 : width*40/100 ,
    alignItems:'flex-end',
    elevation: 1,
    shadowOpacity: 0.40,
    backgroundColor:COLORS.WHITE,
    justifyContent:'flex-start',
    alignItems:'flex-start',
    shadowOffset: {
      height: 1.2,
      width: 1.2,
    },
    borderRadius: 5,
    
  },
  menuItems:{ 
    height: 40, 
    justifyContent:'flex-start',
    marginLeft:5,
    alignItems:'center',
    flexDirection:'row' 
  },
  modalClickView:{
    height:height,
    width:width,
    backgroundColor: COLORS.TRANSPARENT,
  }
});

