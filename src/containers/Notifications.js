import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { ListView, StatusBar, StyleSheet, View, Text } from 'react-native';
import BlackHeader from "../components/BlackHeader";
import NotificationRow from '../components/NotificationRow';
import { COLORS, FONTS, SCALE } from '../style';
import NotificationsStore from '../mobx/stores/hfStore/NotificationsStore';
import { ActivityIndicator, h } from '../helpers';
import FB from '../firebaseMethod';

@observer
export default class Notifications extends Component {

    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
            ProductList: ds.cloneWithRows([

                {
                    "title": "Mad Titan",
                    "image": require('img/hair_dryer_image_1.png'),
                    "description": "Your product has been dispatched",
                    "isfav": false
                },
                {
                    "title": "Supergiant",
                    "image": require('img/hair_dryer_image_3.png'),
                    "description": "Your order was successfully delivered",
                    "isfav": true
                },
                {
                    "title": "corvus",
                    "image": require('img/hair_stainger_image_2.png'),
                    "description": "You purchased product is shipped",
                    "isfav": false
                },
                {
                    "title": "Proxima Midnight",
                    "image": require('img/hair_stainger_image_3.png'),
                    "description": "Your product is on the way",
                    "isfav": false
                },
                {
                    "title": "Mad Titan",
                    "image": require('img/hair_dryer_image_2.png'),
                    "description": "Your order of Mad Titan delivered successfully",
                    "isfav": false
                },


            ]),

        };
    }

    componentDidMount() {
        StatusBar.setBarStyle('light-content');
        NotificationsStore.load();
        setTimeout(()=>{
            FB.clearBadge();
        },150);

    }

    componentWillUnmount(){
        StatusBar.setBarStyle('dark-content')
    }

    render() {
        let store = NotificationsStore;
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
        } else  if (store.notification.length == 0) {
            content =  (
                <View style={{flex: 1}}>
                    <Text
                        style= {{
                        paddingTop: h(38),
                        fontSize: h(34),
                        textAlign: 'center',
                        fontFamily: FONTS.BOOK_OBLIQUE
                        }}>
                        There are no notifications yet.
                    </Text>
                </View>
            );
        } else {
            content = (
                <ListView
                    dataSource={store.dataSource}
                    renderRow={(rowData) =>  <NotificationRow item={rowData} /> }
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
                    onLeft={() => {this.props.navigator.pop({ animated: true })
                    StatusBar.setBarStyle('dark-content')
                    }}
                    title="Notifications" />

                {content}

                {/* <ListView
                    bounces={false}
                    enableEmptySections={true}
                    initialListSize={3}
                    dataSource={this.state.ProductList}
                    renderRow={(rowData) => {
                        return (
                            <NotificationRow item={rowData} />
                        );
                    }}
                /> */}

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
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      },
});
