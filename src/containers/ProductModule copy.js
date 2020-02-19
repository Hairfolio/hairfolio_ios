import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NavigatorStyles from '../common/NavigatorStyles';
import MenuItemsRow from '../components/Product/MenuItems';
import ProductHome from '../components/Product/ProductHome';
import WhiteHeader from '../components/WhiteHeader';
import { ActivityIndicator, ListView, StatusBar } from '../helpers';
// import CategoryStore from '../mobx/stores/hfStore/CategoryStore';
import CategoryStore from '../mobx/stores/hfStore/NewArrivalStore';
import { COLORS, FONTS, h } from '../style';
var { height, width } = Dimensions.get('window');
import CartStore from '../mobx/stores/hfStore/CartStore';
import CartCounterView from '../components/CartCounterView';

@observer
export default class ProductModule extends Component { 
  constructor(props) {
    super(props);

    this.state={
      showModal : false
    }
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content');
    CategoryStore.load();
    CartStore.fetchCart();
  }

  // updateStatusBar(){
  //   StatusBar.setBarStyle('dark-content');
  // }

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

              <MenuItemsRow source={require('img/Earn.png')}
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

  render() {
    
    let store = CategoryStore;
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
          renderRow={(p, i) => <ProductHome product={p} navigator={this.props.navigator}/> }
          renderFooter={
            () => {
              if (store.nextPage != null) {
                return (
                  <View style={{flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large' />
                  </View>
                )
              } else {
                return <View />;
              }
            }
          }
          onEndReached={() => {
            store.loadNextPage();
          }}
        />
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
    width: h(38),
    height: h(38),
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

