import React from 'react';
import { StyleSheet } from 'react-native';
import { Image, Text, View, windowWidth, moment } from '../helpers';
import { COLORS, FONTS } from '../style';

export default class NotificationRow extends React.Component {

  getOrderDate(date) {
    if(date)
    {
      return moment(date).format("DD MMMM YYYY, hh:mm a")
    }
    else
    {
      return "";
    }
  }

  render() {
    return (
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          <Image
            style={styles.imageStyle}
            source={(this.props.item.image) ?  this.props.item.image : require('img/logo.png') }
          />

          <View style={styles.textContainer}>
            <Text style={styles.textTitle}>{this.props.item.title}</Text>
            <Text style={styles.textDescription}>
              {this.props.item.message}
            </Text>            
          </View>
        </View>

            <Text style={styles.textDate}>
              {this.getOrderDate(this.props.item.push_notification_sent_at)}
            </Text>
        <View style={[styles.dividerStyle]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parentContainer: {
    width: windowWidth - 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20
  },
  container: {
    flexDirection: "row",
    marginLeft: 5,
    width: windowWidth - 45
  },
  imageStyle: {
    height: 55,
    width: 55,
    borderRadius: 2,
    resizeMode:'center'
    
  },
  textTitle: {
    fontFamily: FONTS.BLACK,
    fontSize:18,
    color: COLORS.BOTTOMBAR_SELECTED
  },
  textBlueTitle: {
    fontFamily: FONTS.BLACK,
    fontSize: 18,
    color: COLORS.LIGHT2
  },
  textDescription: {
    marginTop:5,
    color: COLORS.PLACEHOLDER_SEARCH_FIELD,
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    width:windowWidth - 150
  },
  textDate: {
    // marginTop:5,
    color: COLORS.PLACEHOLDER_SEARCH_FIELD,
    fontFamily: FONTS.MEDIUM,
    fontSize: 14,
    marginTop:5,
    alignSelf: 'flex-end'
  },
  textContainer: {
    marginLeft: 15,
    width:windowWidth - 60
  },
  dividerStyle: {
    backgroundColor: COLORS.LIGHT4,
    height: 1,
    marginTop: 10
  }
});