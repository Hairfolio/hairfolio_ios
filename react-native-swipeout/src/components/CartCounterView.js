import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS, FONTS } from '../helpers';

export default class CartCounterView extends React.Component {

    render() {
      return (
        <View style={(this.props.numberOfBagItems>0)?
                            [styles.iconBaseView,this.props.cartIconView] 
                                :[styles.iconBaseView,{backgroundColor:'transparent'}]}>
        <Text style={styles.iconText}
              numberOfLines={1}>{(this.props.numberOfBagItems > 10)?
                                this.props.numberOfBagItems
                                    :(this.props.numberOfBagItems < 1) ? "" : " "+this.props.numberOfBagItems+" " }</Text>
        </View>
      );
    }
  }


  const styles = StyleSheet.create({
    iconBaseView:{
        marginTop:-28,
        backgroundColor:COLORS.BADGE_COLOR,
        alignSelf:'flex-end',
        marginRight:-10,
        borderRadius:10,
        padding:2,
        justifyContent:'center',
        alignItems:'center'
    },
    iconText:{
        color:COLORS.WHITE,
        fontSize:10,
        alignSelf:'center',
        fontFamily:FONTS.BLACK,

    }
  });



