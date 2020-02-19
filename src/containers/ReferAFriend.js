import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BlackHeader from "../components/BlackHeader";
import { COLORS, FONTS, h, SCALE } from '../style';

@observer
@autobind
export default class ReferAFriend extends Component { 

  constructor(props) {
    super(props);
    this.state = {    
    };
  }


  render(){
    return(
      <View style={styles.mainContainer}>

        <BlackHeader
            onLeft={() => this.props.navigator.pop({ animated: true })}
            title="Refer a Friend"
            onRenderLeft={() => (
                <View
                style={{
                    height: h(60),
                    flexDirection: "row",
                    alignItems: "center"
                }}
                >
                <Image
                    style={{ height: h(18), width: h(30) }}
                    source={require("img/nav_white_back.png")}
                />
                </View>
            )}
            />

            <View style={styles.container}>
                <View style={styles.imageView}>
                    <Image source={require("img/gift_card_image.png")} />
                    <Text style={styles.titleText}>HAIRFOLIO50</Text>
                </View>                
                <Text style={[styles.textStyle,{marginTop:7}]}>Share your code with your friends</Text>
                <Text style={styles.textStyle}>and get bonus point</Text>
                <View style={styles.appView}>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.btnStyle}>
                            <Image source={require("img/face_book_icon.png")} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnStyle}>
                            <Image source={require("img/instagram_icon.png")} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnStyle}>
                            <Image source={require("img/whatsup_icon.png")} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.btnStyle}>
                            <Image source={require("img/google_plus_icon.png")} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnStyle}>
                            <Image source={require("img/messenger_icon.png")} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnStyle}>
                            <Image source={require("img/twitter_icon.png")} />
                        </TouchableOpacity>
                    </View>                   
                </View>
            </View>
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
        alignItems:'center',
        justifyContent:'center'
    },
    appView:{
        backgroundColor:COLORS.WHITE,
        marginTop:10
    },
    row:{
        // backgroundColor:'green',
        flexDirection:'row',
        marginTop:15

    },
    btnStyle:{
        padding:7,
        elevation: 1,
        shadowOpacity: 0.12,
        shadowOffset: {
            height: 1.2,
            width: 1.2
        },
        marginLeft:7,
        marginRight:7,
        borderRadius:5
    },
    textStyle:{
        fontFamily:FONTS.LIGHT,
        fontSize:SCALE.h(25),
        color:COLORS.DARK
    },
    titleText:{
        position:'absolute',
        bottom:0,
        fontFamily:FONTS.MEDIUM,
        fontSize:SCALE.h(30),
        color:COLORS.DARK
    },
    imageView:{
        alignItems:'center'
    }
    
});
