import React, { Component } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationActions } from 'react-native-navigation';
import { COLORS } from '../helpers';

export default class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  constructor(props){
     super(props)

     this.state={
      selectedDrawer : 1,
      userId: "",
      userImage: null,
      userName: "",
     }
  }

  render () {
    return (
      
      <Container>          
          <View style={styles.container}>
            <View style={styles.imgViewStyle}> 
              <ImageBackground source={{uri: 'nav_img'}} style={styles.imgStyle} >
                <View style={styles.userViewStyle}>
                  <View style={styles.userIconContainer}>
                    <Image 
                    source={{ uri: (userDetailsStore.userPic) ? userDetailsStore.userPic : 'placeholder' }}
                    style={styles.userIcon}/>
                  </View>
                  <Text style={styles.textStyle}>{userDetailsStore.userName}</Text>
                </View>
              </ImageBackground>
            </View>

            <ScrollView>

            <TouchableOpacity style={styles.container2}>
                         
                         <View style={styles.container}>
                            <Image style={styles.iconStyle} />

                                <Text style={styles.textStyle}>Test1</Text> 
                       
                         </View>
                    
                        <View style={styles.notificationIcon}> 
                            <Text style={styles.notificationTextStyle}>28</Text>
                    </View>
                    <View style={styles.divider} />
                    </TouchableOpacity>
                          
            </ScrollView>
          </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
    container2:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    container:{
        flexDirection:'row',
        height:50,
        alignItems:'center',
        marginLeft:10,
        marginRight:10,
    },
    iconStyle:{
        padding:10,
        margin:10,
        resizeMode:'contain'
    },
    iconStyle2:{
        padding:10,
        margin:10,
        resizeMode:'contain',
        alignSelf:'flex-end'
    },
    textStyle:{
        marginLeft:10,
        color:'gray'
    },
    textStyleSelected:{
        marginLeft:10,
        color:'blue'
    },
    divider:{
        height:1,
        backgroundColor:'black'
    },
    notificationIcon:{
         height:20,
         width:20,
         backgroundColor:'orange',
         borderRadius:5,
         alignSelf:'center',
         position:'absolute',
         right:20,
         alignItems:'center',
         justifyContent:'center'

    },
    notificationTextStyle:{
        color:COLORS.LABEL_BLACK,
        fontSize:12,
        alignSelf:'center',
        textAlign:'center',
        textAlignVertical:'center',
    
    }
})