import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert, NativeModules } from 'react-native';
import BlackHeader from '../components/BlackHeader';
import { COLORS, FONTS, SCALE } from '../style';
import NavigatorStyles from '../common/NavigatorStyles';
import { windowWidth, showAlert } from '../helpers';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CardStore from '../mobx/stores/hfStore/CardAndPlaceOrderStore';
import CartStore from '../mobx/stores/hfStore/CartStore';


let internetCheck = NativeModules.testInternet;


@observer
@autobind
export default class CheckoutMethods extends Component {

  constructor(props) {
    super(props);

    this.state={
      card_Number:"",
      card_Holder_Name:"",
      month:"",
      year:"",
      cvv:""
    }

    CartStore.fetchCart();

  }

  async checkIfCartUpdated(){

    CardStore.isLoading = true;
    let isUpdated = await CartStore.fetchCart2();

    CardStore.isLoading = false;

    if(isUpdated)
    {
      Alert.alert(
        'Hairfolio',
        "Cart Updated.",
        [
          { text: "OK", onPress: () => {
            this.props.navigator.pop({animated:false})
            this.props.navigator.pop({animated:false})
            this.props.navigator.pop({animated:false})
          } },
         
        ],
        { cancelable: false }
      );
            
    }
    else
    {
      //When products are not updated
      this.addNewCard()
    }

  }



  addNewCard(){
   
    let exp_mnth = this.state.month
    
    // exp_mnth = exp_mnth.slice()
    if(exp_mnth.charAt(0) == "0")
    {
      exp_mnth = exp_mnth.slice(1,exp_mnth.length)
    }

    let post_data = {
      "card": {
          "number": this.state.card_Number,
          "expiry_month": exp_mnth,
          "expiry_year": this.state.year,
          "cvc": this.state.cvv,
      }
    }

    CardStore.addCard(post_data,this.props.navigator)
  }

  onPressViewAll(){

    this.props.navigator.push({
      screen: 'hairfolio.CardList',
      navigatorStyle: NavigatorStyles.tab,
    });


  }

  render() {

    if (CardStore.isLoading) {
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
          title='Checkout' />
        <KeyboardAwareScrollView>
          <View style={styles.mainContainer}>
            <View>
              <Text style={styles.labelText}>Total Payable Amount</Text>
              <View style={styles.flexHor}>
                <Text style={styles.priceText}>${CartStore.totalPayableAmount.toFixed(2)}</Text>
                {/* <Text style={styles.viewOrderText} onPress={() => {
                  this.props.navigator.push({
                    screen: 'hairfolio.Wallet',
                    title: 'Wallet',
                    navigatorStyle: NavigatorStyles.tab,
                  });
                }}>View order</Text> */}
              </View>
              {/* <Text style={styles.labelPayment}>Payment Method</Text> */}
            </View>

            {/* <View style={{ height: 100, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={[styles.cardStyleTextInput, { width: windowWidth / 3 - 20, alignItems: "center" }]}>
                <Image source={require("img/paypal_icon.png")} style={styles.imgView2} />
              </View>

              <View style={[styles.cardStyleTextInput, { width: windowWidth / 3 - 20, alignItems: "center" }]}>
                <Image source={require("img/visa_icon.png")} style={styles.imgView2} />
              </View>

              <View style={[styles.cardStyleTextInput, { width: windowWidth / 3 - 20, alignItems: "center" }]}>
                <Image source={require("img/master_card_icon.png")} style={styles.imgView2} />
              </View>

            </View> */}


            <View>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <View style={[styles.flexHor, { justifyContent: "flex-start", alignItems: "center",marginTop:10 }]}>
                  {/* <Image source={require("img/add_wallet_icon.png")} style={styles.imgView} /> */}
                  {/* <Text style={[styles.viewOrderText, { marginLeft: 10 }]}>Add Card</Text> */}
                </View>

               {/* <View style={{justifyContent:'center'}}>
                  <Text style={[styles.viewAllText]}
                        onPress={()=>{
                          this.onPressViewAll()
                        }}
                  >View All</Text>
               </View> */}

              </View>


              <View style={[styles.cardStyleTextInput,{marginTop:10}]}>
                <TextInput style={styles.textInputStyle} 
                          placeholder="Card Number" 
                          placeholderTextColor={COLORS.DARK}
                          maxLength={16}
                          keyboardType={'number-pad'}
                          onChangeText={(text)=>{
                            this.setState({card_Number:text})
                          }}
                          value = {this.state.card_Number}
                          />
              </View>
              {/* <View style={styles.cardStyleTextInput}>
                <TextInput style={styles.textInputStyle} 
                           placeholder="Card Holder Name"
                           keyboardType={'default'} 
                           placeholderTextColor={COLORS.DARK} 
                           onChangeText={(text)=>{
                            this.setState({card_Holder_Name:text})
                           }}
                           value = {this.state.card_Holder_Name}
                           />
              </View> */}

              <View style={styles.flexHor}>
                <View style={[styles.cardStyleTextInput, { width: windowWidth / 2 - 20 }]}>
                  <TextInput style={[styles.textInputStyle, { width: windowWidth / 2 - 20 }]} 
                             placeholder="Months"
                             maxLength={2}
                             keyboardType={'number-pad'} 
                             placeholderTextColor={COLORS.DARK} 
                             onChangeText={(text)=>{
                              this.setState({month:text})
                             }}
                             value = {this.state.month}
                             />
                            
                </View>
                <View style={[styles.cardStyleTextInput, { width: windowWidth / 2 - 20 }]}>
                  <TextInput style={[styles.textInputStyle, { width: windowWidth / 2 - 20 }]} 
                             placeholder="Year"
                             maxLength={4}
                             keyboardType={'number-pad'} 
                             placeholderTextColor={COLORS.DARK} 
                             onChangeText={(text)=>{
                              this.setState({year:text})
                             }}
                             value = {this.state.year}/>
                </View>
              </View>


              <View style={styles.flexHor}>
                {/* <View style={[styles.cardStyleTextInput, { width: windowWidth / 2 - 20 }]}>
                  <TextInput style={[styles.textInputStyle, { width: windowWidth / 2 - 20 }]} 
                             placeholder="Expire Date" 
                             placeholderTextColor={COLORS.DARK} />
                </View> */}
                <View style={[styles.cardStyleTextInput, { width: windowWidth / 2 - 20 }]}>
                  <TextInput style={[styles.textInputStyle, { width: windowWidth / 2 - 20 }]} 
                             placeholder="CVV" 
                             placeholderTextColor={COLORS.DARK}
                             maxLength={3}
                             keyboardType={'number-pad'} 
                             onChangeText={(text)=>{
                              this.setState({cvv:text})
                             }}
                             value = {this.state.cvv}/>
                </View>
              </View>

            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              backgroundColor: COLORS.DARK,
              width: windowWidth - 60,
              height: 35,
              justifyContent: "center",
              alignSelf: "center",
              alignItems: "center"
            }}
            onPress={()=>{
            
              internetCheck.testMethod((o)=>{
                if(o==true)
                {
                   this.checkIfCartUpdated()
                }
                else
                {
                  showAlert("No Internet Connection!")
                }
              })
              
             
              // this.addNewCard()
            }}
          >
            {/* <Text style={styles.btnText}>Submit</Text>
           */}
           <Text style={styles.btnText}>Pay</Text>
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

});
