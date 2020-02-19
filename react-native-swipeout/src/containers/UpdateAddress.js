import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NavigatorStyles from '../common/NavigatorStyles';
import BlackHeader from '../components/BlackHeader';
import { windowWidth, showLog, showAlert } from '../helpers';
import { COLORS, FONTS, h, SCALE } from '../style';
import CartAddressStore from "../mobx/stores/hfStore/CartAddressStore";
import CartAddress_Text_Input from '../components/cart/CartAddress_Text_Input';



@observer
// @autobind
export default class UpdateAddress extends Component {

  constructor(props) {
    super(props);
    this.state = {
      first_name:"",
      email:"",
      first_name:"",
      last_name:"",
      phone:"",
      city:"",
      landmark:"",
      zip_code:"",
      default_address:"true",
      user_address:"",

    }

  }

  componentDidMount(){

    CartAddressStore.addresses = []
    CartAddressStore.updateAddress = false;
    this.onEditAddressClick()
  }

  gotoNext() {
    // alert("gotoNext")
  }


  gotoPreviewOrderScreen() {
    this.props.navigator.push({
      screen: 'hairfolio.PreviewOrder',
      navigatorStyle: NavigatorStyles.tab,
    });
  }


  updateAddress(){

    let post_data =  { 
      "email": this.state.email, 
      "first_name":this.state.first_name,
      "last_name":this.state.last_name,
      "phone":this.state.phone,
      "city":this.state.city,
      "landmark":this.state.landmark,
      "zip_code":this.state.zip_code,
      "default_address":this.state.default_address,
      "user_address" : this.state.user_address
    }



    showLog("CART UPDATE Address ==> "+JSON.stringify(post_data))

    CartAddressStore.checkValidation(post_data).then((result)=>{

      // alert("CHECK VALIDATION RESULT"+result)
      if(result)
      {
        CartAddressStore.editAddress(post_data,CartAddressStore.default_address.id,this.props.navigator)
      }

    },
    error=>{
      showAlert(error)
    })
    
    // CartAddressStore.editAddress(post_data,CartAddressStore.default_address.id,this.props.navigator)

  }


  onEditAddressClick() {

    this.setState({ first_name: CartAddressStore.default_address.first_name })
    this.setState({ last_name: CartAddressStore.default_address.last_name })
    this.setState({ email: CartAddressStore.default_address.email })
    this.setState({ phone: CartAddressStore.default_address.phone })
    this.setState({ user_address: CartAddressStore.default_address.user_address })
    this.setState({ landmark: CartAddressStore.default_address.landmark })
    this.setState({ city: CartAddressStore.default_address.city })
    this.setState({ zip_code: CartAddressStore.default_address.zip_code })

    CartAddressStore.isLoading = true
    setTimeout(() => {
      CartAddressStore.isLoading = false
      CartAddressStore.updateAddress = true
    }, 100)
  }

  onCancelClick(){
    CartAddressStore.updateAddress = false
  }

  addAddressView(){
    return(
      <View>
          <View style={styles.addressStyle}>
              <Text style={styles.titleText}>New Address</Text>
             <Text style={styles.textSave}onPress={() => {this.saveAddress() }}>SAVE</Text>
          </View>

            <CartAddress_Text_Input  
                        placeholder={"First Name"}
                         onChangeText={(text)=> 
                          //  CartAddressStore.first_name = text
                          this.setState({first_name:text})
                         } 
                         keyboardType={'default'} 
                         maxLength={20}
                         value={this.state.first_name}/>

            <CartAddress_Text_Input  
                        placeholder={"Last Name"}
                         onChangeText={(text)=> {
                          this.setState({last_name:text})
                         }} 
                         keyboardType={'default'}
                         maxLength={20}
                         value={this.state.last_name}/>                         

            <CartAddress_Text_Input  
                        placeholder={"Email"}
                         onChangeText={(text)=> {
                          this.setState({email:text})
                         }} 
                         keyboardType={'email-address'}
                         maxLength={50}
                         value={this.state.email}/>  

            <CartAddress_Text_Input  
                        placeholder={"Phone"}
                         onChangeText={(text)=> {
                          this.setState({phone:text})
                         }} 
                         keyboardType={'phone-pad'}
                         maxLength={16}
                         value={this.state.phone}/>               

            <CartAddress_Text_Input  
                        placeholder={"Flat/Street Name"}
                         onChangeText={(text)=> {
                          this.setState({user_address:text})
                         }} 
                         keyboardType={'default'}
                         maxLength={150}
                         value={this.state.user_address}/> 

           <CartAddress_Text_Input  
                        placeholder={"Near Famous Place"}
                         onChangeText={(text)=> {
                          this.setState({landmark:text})
                         }} 
                         keyboardType={'default'}
                         maxLength={50}
                         value={this.state.landmark}/>


            <CartAddress_Text_Input  
                        placeholder={"City/State"}
                         onChangeText={(text)=> {
                          this.setState({city:text})
                         }} 
                         keyboardType={'default'}
                         maxLength={50}
                         value={this.state.city}/>  

            <CartAddress_Text_Input  
                        placeholder={"ZipCode"}
                         onChangeText={(text)=> {
                          this.setState({zip_code:text})
                         }} 
                         maxLength={6}
                         keyboardType={'number-pad'}
                         value={this.state.zip_code}/>                                              

      </View>
    );
  }



  nextButtonView(){
    return(
      <TouchableOpacity
      activeOpacity={0.5}
      style={{
        marginTop: 40,
        marginBottom: 30,
        backgroundColor: COLORS.DARK,
        width: windowWidth - 60,
        height: 35,
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center"
      }}
      onPress={() => { this.gotoPreviewOrderScreen() }}
    >
      <Text style={styles.btnText}>Next</Text>
    </TouchableOpacity>
    );
  }

  updateAddressView(){
    return(
      <View>
          <View style={styles.addressStyle}>
              <Text style={styles.titleText}>Update Address</Text>
             
                <View>
                  
                    <Text style={styles.textSave} 
                          onPress={()=>{this.updateAddress()}}>UPDATE</Text>

        </View>          
            </View>
            <CartAddress_Text_Input  
                        placeholder={"First Name"}
                         onChangeText={(text)=> 
                          //  CartAddressStore.first_name = text
                          this.setState({first_name:text})
                         } 
                         keyboardType={'default'} 
                         maxLength={20}
                         value={this.state.first_name}/>

            <CartAddress_Text_Input  
                        placeholder={"Last Name"}
                         onChangeText={(text)=> {
                          this.setState({last_name:text})
                         }} 
                         keyboardType={'default'}
                         maxLength={20}
                         value={this.state.last_name}/>                         

            <CartAddress_Text_Input  
                        placeholder={"Email"}
                         onChangeText={(text)=> {
                          this.setState({email:text})
                         }} 
                         keyboardType={'email-address'}
                         maxLength={50}
                         value={this.state.email}/>  

            <CartAddress_Text_Input  
                        placeholder={"Phone"}
                         onChangeText={(text)=> {
                          this.setState({phone:text})
                         }} 
                         keyboardType={'phone-pad'}
                         maxLength={15}
                         value={this.state.phone}/>               

            <CartAddress_Text_Input  
                        placeholder={"Flat/Street Name"}
                         onChangeText={(text)=> {
                          this.setState({user_address:text})
                         }} 
                         keyboardType={'default'}
                         maxLength={150}
                         value={this.state.user_address}/> 

           <CartAddress_Text_Input  
                        placeholder={"Near Famous Place"}
                         onChangeText={(text)=> {
                          this.setState({landmark:text})
                         }} 
                         keyboardType={'default'}
                         maxLength={50}
                         value={this.state.landmark}/>


            <CartAddress_Text_Input  
                        placeholder={"City/State"}
                         onChangeText={(text)=> {
                          this.setState({city:text})
                         }} 
                         keyboardType={'default'}
                         maxLength={50}
                         value={this.state.city}/>  

            <CartAddress_Text_Input  
                        placeholder={"ZipCode"}
                         onChangeText={(text)=> {
                          this.setState({zip_code:text})
                         }} 
                         maxLength={6}
                         keyboardType={'number-pad'}
                         value={this.state.zip_code}/>                                              

      </View>
    );
  }

  render() {

    if (CartAddressStore.isLoading) {
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
          title='Address' />
        <KeyboardAwareScrollView>
          <View style={styles.mainContainer}>
              

          {CartAddressStore.default_address ?
                      
                        this.updateAddressView() 
                          :
                            this.addAddressView() }
           
          {CartAddressStore.default_address?
                      null
                      :
                       this.nextButtonView()}
          </View>
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
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    backgroundColor: COLORS.WHITE
  },
  titleText: {
    fontFamily: FONTS.ROMAN,
    fontSize: h(30),
    color: COLORS.BLACK,
    marginTop: 15
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
  textStyle: {
    fontFamily: FONTS.LIGHT,
    fontSize: h(25),
    color: COLORS.BLACK,
  },
  addressStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  textInputStyle: {
    width: windowWidth - 40,
    height: SCALE.h(80),
    fontSize: SCALE.h(25),
    fontFamily: FONTS.LIGHT,
    color: COLORS.BLACK,
    paddingLeft: 5,
  },
  btnText: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    color: COLORS.LIGHT
  },

});
