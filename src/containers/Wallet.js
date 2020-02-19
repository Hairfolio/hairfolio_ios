import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { FlatList, Image, StatusBar, StyleSheet, Text, View, ScrollView, TouchableOpacity, ListView, ActivityIndicator, Alert } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import BlackHeader from "../components/BlackHeader";
import LinkTabBarOrders from '../components/post/LinkTabBarOrders';
import WalletDetailRow from '../components/wallet/WalletDetailRow';
import { windowWidth, h, showLog, showAlert } from '../helpers';
import { COLORS, FONTS, SCALE } from '../style';
import WalletList from '../components/walletList';
import WalletListRow from '../components/walletList';
import CartStore from '../mobx/stores/hfStore/CartStore';
import BankAccountStore from '../mobx/stores/hfStore/BankAccountStore';
import NavigatorStyles from '../common/NavigatorStyles';
import WalletStore from '../mobx/stores/hfStore/WalletStore';
import TransferHistoryRow from '../components/transferHistoryRow';



const DiscountList = observer(({ WalletAll }) => {

  let content = (
    <View style={styles.indicator}>
      <ActivityIndicator size='large' />
    </View>
  );

  if (CartStore.isLoading) {
    content = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  } else if (CartStore.commissionList.length == 0) {
    content = (
      <View style={{ flex: 1 }}>
        <Text
          style={{
            paddingTop: h(38),
            fontSize: h(34),
            textAlign: 'center',
            fontFamily: FONTS.BOOK_OBLIQUE
          }}>
          You haven't earned any commissions yet.
            </Text>
      </View>
    );
  }
  else {
    content = (
      <ListView
        dataSource={CartStore.dataSource}
        renderRow={(rowData) => <WalletListRow wallet={rowData} />}
        onEndReachedThreshold={0.2}
        renderFooter={
          () => {
            if (CartStore.nextPage != null) {
              return (
                <View style={{ flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIndicator size='large' />
                </View>
              )
            } else {
              return <View />;
            }
          }
        }
        onEndReached={() => {
          CartStore.loadNextPage();
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1, width: windowWidth, backgroundColor: COLORS.LIGHT, paddingTop: 5 }}>

      {content}
    </View>
  )
});

const TransactionList = observer(({ transactionAll }) => {

  let content = (
    <View style={styles.indicator}>
      <ActivityIndicator size='large' />
    </View>
  );

  if (WalletStore.isLoading) {
    content = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  } else if (WalletStore.tranferHistoryList.length == 0) {
    content = (
      <View style={{ flex: 1 }}>
        <Text
          style={{
            paddingTop: h(38),
            fontSize: h(34),
            textAlign: 'center',
            fontFamily: FONTS.BOOK_OBLIQUE
          }}>
          You haven't initiated any transaction yet.
            </Text>
      </View>
    );
  }
  else {
    content = (
      <ListView
        dataSource={WalletStore.dataSource}
        renderRow={(rowData) => <TransferHistoryRow transfer={rowData} />}
        onEndReachedThreshold={0.2}
        renderFooter={
          () => {
            if (WalletStore.nextPage != null) {
              return (
                <View style={{ flex: 1, 
                              paddingVertical: 20, 
                              alignItems: 'center', 
                              justifyContent: 'center' }}>
                  <ActivityIndicator size='large' />
                </View>
              )
            } else {
              return <View />;
            }
          }
        }
        onEndReached={() => {
          WalletStore.loadNextPage();
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1, width: windowWidth, backgroundColor: COLORS.LIGHT, paddingTop: 5 }}>

      {content}
    </View>
  )
});


@observer
export default class Wallet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active_index:0
    };
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    CartStore.fetchWallet()
    CartStore.commissionList = []
    WalletStore.tranferHistoryList = []
    CartStore.load()
    WalletStore.load()
  }

  componentWillUnmount(){
    StatusBar.setBarStyle('dark-content')
  }

  handleChangeScreen(i) {
    this.setState({
      active_index: i
    });
    // OrderStore.requestedOrders = [];
    if (i == "0" || i == 0) {
      CartStore.load()
    } else if (i == "1" || i == 1) {
      WalletStore.load()
    }
  }

 

  render() {
    return (
      <View style={styles.mainContainer}>

        <BlackHeader
          onLeft={() => {this.props.navigator.pop({ animated: true })
          StatusBar.setBarStyle('dark-content')

          }}
          title="Wallet"
        />

        <View style={styles.imageContainer}>
        <Image style={{ width:80, height:80, resizeMode:"contain"}} source={require('img/wallet_icon.png')} />
        <View style={{width:windowWidth/2,justifyContent:'space-between',flexDirection:'row'}}>
            <View style={{justifyContent:'flex-start'}}>
              <Text style={[styles.title]}>WALLET AMOUNT</Text>
              <Text style={styles.priceStyle}>${CartStore.walletAmount}</Text>
            </View>

            <View style={{justifyContent:'flex-end'}}>
              <Text style={[styles.title,{paddingLeft:5}]}>TOTAL EARNED</Text>
              <Text style={styles.priceStyle}>${CartStore.commissionAmount}</Text>
            </View>

        </View>  
          <TouchableOpacity
                  activeOpacity={0.5}
                  style={(CartStore.walletAmount > 0)? styles.btnWithdraw : styles.btnWithdrawDisabled}
                  disabled={(CartStore.walletAmount > 0)? false : true}
                  onPress={async() => {
                    let response = await BankAccountStore.getWalletTransferInfo();
                    // {"total_amount":5,"wallet_transaction_fee":0.5,"wallet_transaction_service_charge":0.5,"amount":4,"status":200}
                    if(response) {
                      let amount = (response.total_amount) ? response.total_amount : 0,
                      transferFee = (response.wallet_transaction_fee) ? response.wallet_transaction_fee : 0,
                      serviceFee = (response.wallet_transaction_service_charge) ? response.wallet_transaction_service_charge : 0,
                      netPayable = (response.amount) ? response.amount : 0;
  
                      let finalMessage = `\n Amount: $${amount}
                       \n Transfer Fee: $${transferFee}
                       \n Service Fee: $${serviceFee} 
                       \n Net Payable: $${netPayable}`
                      Alert.alert(
                        `You are transferring \n $${amount}`,
                        finalMessage,
                        [
                          {
                            text: "Cancel",
                            style: 'destructive',
                            onPress: () => {}
                          },
                          {
                            text: "Ok",
                            onPress: () => {
                              BankAccountStore.getAccountListOnce(this.props.navigator)
                            }
                          }
                        ],
                        {
                          cancelable: false
                        }
                      );
                    } else {
                      showAlert('Something went wrong!')
                    }
                  }}>

                  <Text style={(CartStore.walletAmount > 0)? styles.btnText : styles.btnTextDisabled}>Deposit to bank</Text>
                </TouchableOpacity>
        </View>
        <View style={styles.tabContainer}>
                <ScrollableTabView
                    renderTabBar={() => <LinkTabBarOrders />}
                    initialPage={0}
                    onChangeTab={({ i }) => {
                      this.handleChangeScreen(i);
                    }}
                    >
                    <DiscountList tabLabel="Commission History" navigator={this.props.navigator} 
                          WalletAll={CartStore.commissionList} 
                          />   
                    <TransactionList tabLabel="Transaction History" navigator={this.props.navigator} 
                          WalletAll={WalletStore.tranferHistoryList} 
                          />       
                </ScrollableTabView>
            </View>

      </View>
    )
  }

  render_Old() {
    return (
      <View style={styles.mainContainer}>

        <BlackHeader
          onLeft={() => {this.props.navigator.pop({ animated: true })
          StatusBar.setBarStyle('dark-content')

          }}
          title="Wallet"
        />

        <View style={styles.imageContainer}>
        <Image style={{ width:80, height:80, resizeMode:"contain"}} source={require('img/wallet_icon.png')} />
        <View style={{width:windowWidth/2,justifyContent:'space-between',flexDirection:'row'}}>
            <View style={{justifyContent:'flex-start'}}>
              <Text style={[styles.title]}>WALLET AMOUNT</Text>
              <Text style={styles.priceStyle}>${CartStore.walletAmount}</Text>
            </View>

            <View style={{justifyContent:'flex-end'}}>
              <Text style={[styles.title,{paddingLeft:5}]}>TOTAL EARNED</Text>
              <Text style={styles.priceStyle}>${CartStore.commissionAmount}</Text>
            </View>

        </View>  
          <TouchableOpacity
                  activeOpacity={0.5}
                  style={(CartStore.walletAmount > 0)? styles.btnWithdraw : styles.btnWithdrawDisabled}
                  disabled={(CartStore.walletAmount > 0)? false : true}
                  onPress={() => { 
                    
                    // BankAccountStore.getBankAccount(this.props.navigator)
                    BankAccountStore.getAccountListOnce(this.props.navigator)
                   
                    }}>

                  <Text style={(CartStore.walletAmount > 0)? styles.btnText : styles.btnTextDisabled}>Deposit to bank</Text>
                </TouchableOpacity>
        </View>
        <View style={styles.tabContainer}>
            {/* <View
              style={{
                flexDirection: 'row',
                backgroundColor:'red'
                // flexWrap: 'wrap'
              }}
            > */}
            <DiscountList navigator={this.props.navigator} 
                          WalletAll={CartStore.commissionList} 
                          />
             {/* <discountList navigator={this.props.navigator} WalletAll={this.state.WalletAll}/> */}
            
            {/* </View> */}
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  // indicator: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center'
  // },
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    flexDirection: 'column'
  },
  imageContainer: {
    flex: 0.4,
    backgroundColor: COLORS.TRANSPARENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    // backgroundColor:'green',
    flex: 0.6,
    // backgroundColor:'green'
    elevation: 1,
    shadowOpacity: 0.10,
    shadowOffset: {
      height: 1.8,
      // width: 1.2
    }
  },
  title: {
    fontFamily: FONTS.LIGHT,
    fontSize: SCALE.h(24),
    color: COLORS.DARK,
    marginTop: 15,
    alignSelf:'center',
    
    // paddingRight:5,
    // paddingTop:5
  },
  priceStyle: {
    fontFamily: FONTS.BLACK,
    fontSize: SCALE.h(40),
    color: COLORS.DARK,
    alignSelf:'center'
  },
  btnText: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    color: COLORS.LIGHT
  },
  btnWithdraw:{
    marginTop: 15,
    backgroundColor: COLORS.DARK,
    width: windowWidth/2,
    height: 35,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center"
  },
  btnWithdrawDisabled:{
    marginTop: 15,
    backgroundColor: COLORS.LIGHT,
    width: windowWidth/2,
    height: 35,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center"
  },
  btnTextDisabled: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.BLACK
  },
 
});

