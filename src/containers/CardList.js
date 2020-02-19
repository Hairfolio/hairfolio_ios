import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { ListView, StatusBar, StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import BlackHeader from "../components/BlackHeader";

import { COLORS, FONTS, SCALE } from '../style';
import CardListStore from '../mobx/stores/hfStore/CardAndPlaceOrderStore';
import AddressStore from '../mobx/stores/hfStore/CartAddressStore';
import CouponListStore from '../mobx/stores/hfStore/CouponListStore';
import CartStore from '../mobx/stores/hfStore/CartStore';
import { h, windowHeight, windowWidth } from '../helpers';
import CardListRow from '../components/CardListRow';

@observer
export default class CardList extends Component { 

    constructor(props) {
        super(props);
        this.state={
            selectedId : 0,
           
        }

    }   

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    CardListStore.load();
  }



  render() {
    let store = CardListStore;
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
    } else  if (store.cardList.length == 0) {
        content =  (
            <View style={{flex: 1}}>
                <Text
                    style= {{
                    paddingTop: h(38),
                    fontSize: h(34),
                    textAlign: 'center',
                    fontFamily: FONTS.BOOK_OBLIQUE
                    }}>
                    There are no cards yet.
                </Text>
            </View>
        );
    } else {
        content = (
            <ListView
                dataSource={store.dataSource}
                renderRow={(rowData,index) =>  <CardListRow
                                            store={store}
                                            selectedId={this.state.selectedId} 
                                            item={rowData} 
                onPressItem={()=>{
                    store.selectedID = rowData.id
                }}/>
             }
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
        <View style={styles.mainContainer}>

            <BlackHeader
                onLeft={() => this.props.navigator.pop({ animated: true })}
                title="Apply Card" />

            {content}
            <TouchableOpacity style={(store.selectedID == "") ? 
                                            styles.btnApply : 
                                                styles.btnApplyDisabled}
                               disabled={(store.selectedID == "") ? true : false }           
                               onPress={()=>{
                                  
                                    // this.placeOrder()
                                    // this.props.navigator.pop({animated:true});
                               }}        
                          >
                <Text style={(store.selectedID == "") ? 
                                styles.btnTextDisabled : 
                                        styles.btnText}> Pay </Text>                      
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
     }
});
