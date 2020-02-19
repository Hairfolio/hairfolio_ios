import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import BlackHeader from "../components/BlackHeader";
import { Image, StatusBar, View, windowHeight, Text, windowWidth, h } from '../helpers';
import { COLORS, FONTS, SCALE } from '../style';


const TrackOrderView = observer(({ order, isLast, orderStatusText, isSelected, isLineSelected, source }) => {

    return (
        <View style={styles.trackOrderMainView}>
            <View style={styles.trackOrderRow}>

                <View style={{ flexDirection:"row"}}>

                    <View style={{ height: h(60), width: h(60), alignSelf:"center", alignItems:"center", justifyContent:"center",marginTop:-20,
                    elevation: 1,shadowOpacity: 0.10,shadowOffset: {height: 1.8} }}>
                        
                        <Image
                            style={{ alignSelf:"center"}}
                            source={source}
                            // source={require('img/orderplaced_filled.png')}
                        />
                    </View>

                    <View style={styles.trackingProgressView}>

                        <View style={(isSelected) ?
                            styles.trackingProgressCircleSelected :
                            styles.trackingProgressCircle}>
                        </View>

                        <View style={(isLast) ? styles.trackingProgressWithoutLine :
                            (isLineSelected) ?
                                styles.trackingProgressLineSelected :
                                styles.trackingProgressLine}>
                        </View>
                    </View>

                </View>

                
                <View style={styles.detailView}>
                    <Text style={(isSelected) ?
                        styles.orderStatusTextSelected :
                        styles.orderStatusText}>{orderStatusText}</Text>
                </View>
            </View>
        </View>
    )

});


@observer
export default class TrackMyOrder extends Component {

    constructor(props) {
        super(props);

        this.state = {
            order_id: this.props.order_id,
            shipping_status: this.props.shipping_status,
        };
    }

    componentDidMount() {
        StatusBar.setBarStyle('light-content');
    }

    render() {
        return (
            <View style={styles.mainContainer}>

                <BlackHeader
                    onLeft={() => this.props.navigator.pop({ animated: true })}
                    title="Track My Order" />

                <View style={styles.orderTextView}>
                    <Text style={styles.orderTitle}>ORDER NUMBER</Text>
                    <Text style={styles.orderNumber}>{this.state.order_id}</Text>
                </View>

                <View style={{ margin: 10, }}>

                    <TrackOrderView orderStatusText="Order confirmed"
                        source={ (this.state.shipping_status == "pending" || this.state.shipping_status == "progress") ? require('img/orderplaced_filled.png') : require('img/orderplaced.png')}
                        isSelected={(this.state.shipping_status == "pending" ||
                            this.state.shipping_status == "progress"
                        ) ?
                            true : false}
                        isLineSelected={(this.state.shipping_status == "progress") ?
                            true : false} />
                    <TrackOrderView orderStatusText="Order shipped and on the way"
                        source={ (this.state.shipping_status == "progress") ? require('img/on_the_way_filled.png') : require('img/on_the_way.png')}
                        isSelected={(this.state.shipping_status == "progress" ||
                            this.state.shipping_status == "delivered"
                        ) ?
                            true : false}
                        isSelected={(this.state.shipping_status == "progress") ?
                            true : false}
                    />

                    <TrackOrderView orderStatusText="Order delivered"
                    source={ (this.state.shipping_status == "delivered") ? require('img/delivered_filled.png') : require('img/delivered.png')}
                        isSelected={((this.state.shipping_status == "delivered") ?
                            true : false)}
                        isLast={true} />
                    {/* <TrackOrderView orderStatusText="Order delivered." 
                                    isLast={true}/> */}

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
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        flexDirection: 'column'
    },
    imageContainer: {
        flex: 0.4,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContainer: {
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
        fontSize: SCALE.h(25),
        color: COLORS.DARK,
        marginTop: 15
    },
    priceStyle: {
        fontFamily: FONTS.BLACK,
        fontSize: SCALE.h(70),
        color: COLORS.DARK,
    },
    trackOrderParentView: {
        height: windowHeight / 8,
        // width:windowWidth-20,
        marginTop: 20,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // backgroundColor:'red'

    },
    trackImageParentView: {
        height: windowHeight / 10,
        width: windowHeight / 15,
        // backgroundColor:'black',
        marginTop: 10,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    trackImageSelectedView: {
        height: windowHeight / 15,
        width: windowHeight / 15,
        borderColor: 'black',
        borderWidth: 1,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    trackImageUnSelectedView: {
        height: windowHeight / 15,
        width: windowHeight / 15,
        borderColor: COLORS.BOTTOMBAR_NOTSELECTED,
        borderWidth: 1,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    viewSelectedSeparator: {
        height: 2,
        width: windowHeight / 14,
        backgroundColor: 'black',
        marginLeft: 5
    },
    viewUnselectedSeparator: {
        height: 2,
        width: windowHeight / 14,
        backgroundColor: COLORS.BOTTOMBAR_NOTSELECTED,
        marginLeft: 5
    },
    selectedText: {
        alignSelf: 'center',
        color: COLORS.BLACK,
        backgroundColor: 'red',
        textAlignVertical: 'center'

    },
    unselectedText: {
        color: COLORS.BLACK,

    },
    orderTextView: {
        // backgroundColor:'red',
        backgroundColor: COLORS.LIGHT_GRAY1,
        height: windowHeight / 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    orderTitle: {
        fontFamily: FONTS.LIGHT,
        fontSize: SCALE.h(34),
        color: COLORS.DARK,
        marginTop: 2
    },
    orderNumber: {
        fontFamily: FONTS.LIGHT,
        fontSize: SCALE.h(28),
        color: COLORS.DARK,
        marginTop: 5
    },
    trackOrderMainView: {
        marginLeft: 5,
        marginRight: 5,
        height: windowHeight / 8
    },
    trackOrderMainView1: {
        marginLeft: 5,
        marginRight: 5,
        // height:windowHeight/4,
        backgroundColor: 'pink'
    },
    trackOrderRow: {
        // backgroundColor:'blue',
        margin: 5,
        height: windowHeight / 8,
        flexDirection: 'row'
    },
    trackingProgressView: {
        // backgroundColor:'pink', 
        width: windowWidth / 8,
        alignItems: 'center',
        marginTop: 20

    },
    trackingProgressCircleSelected: {
        backgroundColor: COLORS.BLACK,
        height: 22,
        width: 22,
        borderRadius: 22,
        marginTop: 0,
        marginBottom: 0,
        alignSelf: 'center'
    },
    trackingProgressCircle: {
        backgroundColor: COLORS.LIGHT_GRAY1,
        height: 22,
        width: 22,
        borderRadius: 22,
        marginTop: 0,
        marginBottom: 0,
        alignSelf: 'center'
    },
    trackingProgressLineSelected: {
        backgroundColor: COLORS.BLACK,
        height: windowHeight / 10,
        width: 3,
        marginTop: 0,
        marginBottom: 0,
        alignSelf: 'center'
    },
    trackingProgressLine: {
        backgroundColor: COLORS.LIGHT_GRAY1,
        height: windowHeight / 10,
        width: 3,
        marginTop: 0,
        marginBottom: 0,
        alignSelf: 'center'
    },
    trackingProgressWithoutLine: {
        backgroundColor: 'black',
        height: 0,
        width: 0,
        margin: 2,
        alignSelf: 'center'
    },
    detailView: {
        // backgroundColor:'yellow',
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
        marginTop: (windowHeight > 800) ? -2 :
            (windowHeight < 600) ? 5 : 0,
        width: windowWidth / 1.35,
        height: windowHeight / 12,
        justifyContent: 'center'
    },
    orderStatusText: {
        fontFamily: FONTS.LIGHT,
        fontSize: SCALE.h(32),
        color: COLORS.DARK,
        // marginTop: 5,
        alignSelf: 'flex-start'
    },
    orderStatusTextSelected: {
        fontFamily: FONTS.LIGHT,
        fontSize: SCALE.h(32),
        color: COLORS.BLACK,
        // marginTop: 5,
        alignSelf: 'flex-start'
    },


});
