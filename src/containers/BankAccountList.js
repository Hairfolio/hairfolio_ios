import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { ListView, StatusBar, StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import BlackHeader from "../components/BlackHeader";

import { COLORS, FONTS, SCALE } from '../style';
import BankListRow from '../components/BankListRow';
import BankAccountListStore from '../mobx/stores/hfStore/BankAccountStore';
import CartStore from '../mobx/stores/hfStore/CartStore';
import { h, windowHeight, windowWidth } from '../helpers';
import NavigatorStyles from '../common/NavigatorStyles';

@observer
export default class BankAccountList extends Component { 

    constructor(props) {
        super(props);
        this.state={
            selectedId : 0,
        }

    }   

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    BankAccountListStore.selectedID = "";
    BankAccountListStore.load();
  }

  render() {
    let store = BankAccountListStore;
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
    } else  if (store.accountList.length == 0) {
        content =  (
            <View style={{flex: 1}}>
                <Text
                    style= {{
                    paddingTop: h(38),
                    fontSize: h(34),
                    textAlign: 'center',
                    fontFamily: FONTS.BOOK_OBLIQUE
                    }}>
                    There are no accounts yet.
                </Text>
            </View>
        );
    } else {
        content = (
            <ListView
                dataSource={store.dataSource}
                renderRow={(rowData,index) =>  
                                        <BankListRow
                                            store={store}
                                            selectedId={this.state.selectedId} 
                                            item={rowData} 
                onPressItem={()=>{

                    this.setState({selectedId:rowData.id})
                    store.selectedID = rowData.id
                    store.selectedData = rowData
                    let post_data = 
                    {
                        "bank_account": {
                            "account_holder_name": BankAccountListStore.selectedData.account_holder_name,
                            "account_holder_type": BankAccountListStore.selectedData.account_holder_type,
                            "default_for_currency": true
                        }
                    }

                    BankAccountListStore.updateBankAccount(post_data,this.props.navigator,rowData.id,rowData)
                }}/>
             }
                renderFooter={
                    () => {
                    if (store.isLoadingNextPage == true) {
                        return (
                        <View style={{flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
                            <ActivityIndicator size='large' />
                        </View>
                        )
                    } else {
                        return <View/>;
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
        <View style={styles.mainContainer}>

            <BlackHeader
                onLeft={() => this.props.navigator.pop({ animated: true })}
                title="Bank Accounts" />
            <View style={{width:windowWidth,backgroundColor:COLORS.LIGHT4}}>
                <Text style={styles.textSave}
                      onPress={()=>{
                        BankAccountListStore.isFromListScreen = true;
                        this.props.navigator.push({
                            screen: 'hairfolio.WithDrawAmount',
                            navigatorStyle: NavigatorStyles.tab,
                         }); 
                      }}>ADD ACCOUNT</Text>
            </View>    

            {content}
            <TouchableOpacity style={(store.selectedID == "") ? 
                                            styles.btnApply : 
                                                styles.btnApplyDisabled}
                               disabled={(store.selectedID == "") ? true : false }           
                               onPress={()=>{

                                  BankAccountListStore.callPayOutApi(BankAccountListStore.selectedID,this.props.navigator)

                               }} 
                                    
                          >
                <Text style={(store.selectedID == "") ? 
                                styles.btnTextDisabled : styles.btnText}> Payout </Text>                      
            </TouchableOpacity>

        </View>

    )
}
}

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        backgroundColor: COLORS.WHITE
    },
    container:{
        flex:1,
        backgroundColor:COLORS.WHITE,
        flexDirection:'column'
    },
    imageContainer:{
        flex:0.4,
        backgroundColor:'transparent',
        alignItems:'center',
        justifyContent:'center',
    },
    tabContainer:{
        flex:0.6,
        elevation: 1,
        shadowOpacity: 0.10,
        shadowOffset: {
        height: 1.8,
        // width: 1.2
        } 
    },
    title:{
        fontFamily:FONTS.LIGHT,
        fontSize:SCALE.h(25),
        color:COLORS.DARK,
        marginTop:15
    },
    priceStyle:{
        fontFamily:FONTS.BLACK,
        fontSize:SCALE.h(70),
        color:COLORS.DARK,
    },
    btnText: {
        fontSize: SCALE.h(30),
        fontFamily: FONTS.BLACK,
        color: COLORS.LIGHT
      },
      btnTextDisabled: {
        fontSize: SCALE.h(30),
        fontFamily: FONTS.BLACK,
        color: COLORS.DARK
      },
      btnApply:{
        width: windowWidth - 80,
        height: 40,
        backgroundColor:COLORS.LIGHT,
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
        marginBottom : 30
     },
     btnApplyDisabled:{
        width: windowWidth - 80,
        height: 40,
        backgroundColor:COLORS.DARK,
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
        marginBottom : 30
     },
     textSave: {
        fontFamily: FONTS.BLACK,
        fontSize: h(30),
        color: COLORS.BLACK,
        paddingTop:10,
        paddingBottom:10,
        // marginTop: 15,
        textAlignVertical:'center',
        alignSelf:'flex-end',
        marginRight:10
      },

});
