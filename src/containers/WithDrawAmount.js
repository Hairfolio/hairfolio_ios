import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import BlackHeader from '../components/BlackHeader';
import { COLORS, FONTS, SCALE } from '../style';
import NavigatorStyles from '../common/NavigatorStyles';
import { windowWidth, showAlert, h, showLog } from '../helpers';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CartStore from '../mobx/stores/hfStore/CartStore';
import BankAccountStore from '../mobx/stores/hfStore/BankAccountStore';

@observer
@autobind
export default class WithDrawAmount extends Component {

  constructor(props) {
    super(props);

    this.state = {
      account_Number: "",
      account_Holder_Name: "",
      routing_number: 0,
      country: "US",
      currency: "USD",
      account_holder_type: "individual",     
    }

  }

  checkValidations() {

    if (this.state.account_Number.length < 12) {
      showAlert("Invalid Account Number")
    }
    else if (this.state.routing_number.length < 9) {
      showAlert("Invalid Routing Number")
    }
    else if (this.state.account_Holder_Name.length < 0) {
      showAlert("Please enter account holder name")
    }
    else {
      this.addNewAccount()
    }
  }

  addNewAccount() {

    let post_data = {
      "bank_account": {
        "country": this.state.country,
        "currency": this.state.currency,
        "account_number": this.state.account_Number,
        "account_holder_name": this.state.account_Holder_Name,
        "routing_number": this.state.routing_number,
        "account_holder_type": this.state.account_holder_type,
      }
    }

    BankAccountStore.addAccountData = post_data
    let isAccountAvailable =  (this.props && this.props.isAccountAvailable) ? this.props.isAccountAvailable : true
    BankAccountStore.addBankAccount(post_data, this.props.navigator, isAccountAvailable);
    
  }

  onPressViewAll() {

    this.props.navigator.push({
      screen: 'hairfolio.CardList',
      navigatorStyle: NavigatorStyles.tab,
    });
  }


  viewWithBankAccount() {

    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.titleText}>Address</Text>

          <Text style={styles.textSave}
            onPress={() => {
              //  this.onEditAddressClick()
            }}
          >EDIT DETAILS</Text>


        </View>
        <View style={styles.cardStyle}>
          <Text style={styles.UserNameText}>{BankAccountStore.newAccountResponse.account_holder_name}</Text>
          <Text style={styles.textStyle} numberOfLines={5}>
            {"Bank Name : " + BankAccountStore.newAccountResponse.bank_name + "\n" +
              "Account Number : " + BankAccountStore.newAccountResponse.account_number + "\n" +
              "Routing Number :" + BankAccountStore.newAccountResponse.routing_number + "\n" +
              "Country : " + BankAccountStore.newAccountResponse.country + "\n" +
              "Currency : " + BankAccountStore.newAccountResponse.currency + "\n"
            }
          </Text>
        </View>
      </View>
    );
  }


  viewWithouTAccount() {

    return (
      <View>

        <View style={[styles.cardStyleTextInput, { marginTop: 10 }]}>
          <TextInput style={styles.textInputStyle}
            placeholder="Account Number"
            placeholderTextColor={COLORS.DARK}
            maxLength={12}
            keyboardType={'number-pad'}
            onChangeText={(text) => {
              this.setState({ account_Number: text })
            }}
            value={this.state.account_Number}
          />
        </View>

        <View style={styles.cardStyleTextInput}>
          <TextInput style={styles.textInputStyle}
            placeholder="Account Holder Name"
            keyboardType={'default'}
            placeholderTextColor={COLORS.DARK}
            onChangeText={(text) => {
              this.setState({ account_Holder_Name: text })
            }}
            value={this.state.account_Holder_Name}
          />
        </View>

        <View style={styles.cardStyleTextInput}>
          <TextInput style={styles.textInputStyle}
            placeholder="Routing Number"
            keyboardType={'default'}
            placeholderTextColor={COLORS.DARK}
            maxLength={9}
            onChangeText={(text) => {
              this.setState({ routing_number: text })
            }}
            value={this.state.routing_number}
          />
        </View>


        <View style={styles.flexHor}>
          <View style={[styles.cardStyleTextInput, { width: windowWidth / 2 - 20 }]}>
            <TextInput style={[styles.textInputStyle, { width: windowWidth / 2 - 20 }]}
              placeholder="Country"
              placeholderTextColor={COLORS.DARK}
              keyboardType={'number-pad'}
              onChangeText={(text) => {
                this.setState({ country: text })
              }}
              editable={false}
              value={this.state.country} />

          </View>


          <View style={[styles.cardStyleTextInput, { width: windowWidth / 2 - 20 }]}>
            <TextInput style={[styles.textInputStyle, { width: windowWidth / 2 - 20 }]}
              placeholder="Currency"
              placeholderTextColor={COLORS.DARK}
              maxLength={3}
              keyboardType={'number-pad'}
              onChangeText={(text) => {
                this.setState({ currency: text })
              }}
              editable={false}
              value={this.state.currency} />
          </View>
          {/* </View> */}

        </View>

      </View>


    );

  }


  render() {

    if (BankAccountStore.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    return (
      <View style={styles.wrapper}>
        <BlackHeader
          onLeft={() => this.props.navigator.pop({ animated: true })}
          title='Add Account' />
        <KeyboardAwareScrollView>
          <View style={styles.mainContainer}>

            <View>
              <Text style={styles.labelText}>Total Payable Amount</Text>
              <View style={styles.flexHor}>
                <Text style={styles.priceText}>${CartStore.netPayableWalletAmount}</Text>
              </View>
            </View>

              {this.viewWithouTAccount()}

          </View>

          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              backgroundColor: COLORS.DARK,
              width: windowWidth - 60,
              height: 35,
              justifyContent: "center",
              alignSelf: "center",
              alignItems: "center",
              marginTop: 10
            }}
            onPress={() => {
              // this.props.navigator.push({
              //   screen: 'hairfolio.ReferAFriend',
              //   title: 'ReferAFriend',
              //   navigatorStyle: NavigatorStyles.tab,
              // });

              this.checkValidations()
            }}
          >
            <Text style={styles.btnText}>Save Account</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  mainContainer: {
    padding: 15,
    flex: 1,
  },
  labelText: {
    color: COLORS.BOTTOMBAR_BORDER,
    fontSize: SCALE.h(25),
    fontFamily: FONTS.ROMAN
  },
  priceText: {
    color: COLORS.DARK,
    fontSize: SCALE.h(50),
    fontFamily: FONTS.ROMAN
  },
  labelPayment: {
    color: COLORS.DARK,
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN
  },
  viewOrderText: {
    color: COLORS.RED_TAB_UNDERLINE,
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN
  },
  viewAllText: {
    color: COLORS.RED_TAB_UNDERLINE,
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    // marginTop:10,
  },
  flexHor: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  imgView: {
    height: 30,
    width: 30,
    resizeMode: "contain"
  },
  imgView2: {
    height: 30,
    // width:80,
    resizeMode: "contain"
  },
  cardStyleTextInput: {
    width: windowWidth - 30,
    backgroundColor: COLORS.WHITE,
    padding: 5,
    elevation: 1,
    shadowOpacity: 0.10,
    shadowOffset: {
      height: 1.2,
      width: 1.2,
    },
    marginTop: 7
  },
  textInputStyle: {
    width: windowWidth - 40,
    height: SCALE.h(80),
    fontSize: SCALE.h(25),
    fontFamily: FONTS.LIGHT,
    color: COLORS.DARK,
    paddingLeft: 5
  },
  btnText: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    color: COLORS.LIGHT
  },
  textSave: {
    fontFamily: FONTS.ROMAN,
    fontSize: h(30),
    color: COLORS.RED,
    marginTop: 15
  },
  cardStyle: {
    width: windowWidth - 30,
    // height:100,
    backgroundColor: COLORS.WHITE,
    padding: 10,
    paddingLeft: 15,
    elevation: 1,
    shadowOpacity: 0.10,
    shadowOffset: {
      height: 1.2,
      width: 1.2,
    },
    marginTop: 7
  },
  UserNameText: {
    fontSize: SCALE.h(25),
    fontFamily: FONTS.MEDIUM,
    paddingTop: 2,
    color: COLORS.BLACK
  },
  textStyle: {
    fontFamily: FONTS.LIGHT,
    fontSize: h(25),
    color: COLORS.BLACK,
  },
});
