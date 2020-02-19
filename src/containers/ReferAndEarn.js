import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { ListView, StatusBar, StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Image, Clipboard, Modal } from 'react-native';
import BlackHeader from "../components/BlackHeader";
import ReferAndEarnRow from '../components/ReferAndEarnRow';
import CouponListStore from '../mobx/stores/hfStore/CouponListStore';
import { COLORS, FONTS, SCALE } from '../style';
import { windowHeight, windowWidth, h, TouchableHighlight } from '../helpers';
import UserStore from '../mobx/stores/UserStore';
import ShareStore from '../mobx/stores/ShareStore';
import Toast from 'react-native-whc-toast';


@observer
export default class ReferAndEarn extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
        };
    }


    componentDidMount() {
        StatusBar.setBarStyle('light-content');
        CouponListStore.load();
    }

    componentWillUnmount() {
        StatusBar.setBarStyle('dark-content')
    }

    async copyCodeToClipboard() {

        Clipboard.setString(UserStore.user.referral_code)
        this.refs.toast.show('Copied To Clipboard', Toast.Duration.long, Toast.Position.bottom);

    }

    render2() {
        let store = CouponListStore;
        let content = (
            <View style={styles.indicator}>
                <ActivityIndicator size='large' />
            </View>
        );

        if (store.isLoading) {
            content = (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size='large' />
                </View>
            );
        } else if (store.couponList.length == 0) {
            content = (
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            paddingTop: h(38),
                            fontSize: h(34),
                            textAlign: 'center',
                            fontFamily: FONTS.BOOK_OBLIQUE
                        }}>
                        There are no coupons yet.
                </Text>
                </View>
            );
        } else {
            content = (
                <ListView
                    dataSource={store.dataSource}
                    renderRow={(rowData, index) =>
                        <ReferAndEarnRow item={rowData} />
                    }
                    renderFooter={
                        () => {
                            if (store.nextPage != null) {
                                return (
                                    <View style={{ flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center' }}>
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
                    title="Refer And Earn" />

                {content}
                <Toast ref="toast" />

                <View style={styles.ReferViewBase}>

                    <Text style={styles.ReferalCodeText}> Referral Code </Text>
                    <Text style={styles.ReferalCodeTextDescription}>Refer a friend and receive discount coupon on your purchase.</Text>
                    <View style={styles.CopyToClipboardBaseView}>

                        <TouchableOpacity style={styles.btnCopyToClipboard}
                            onPress={() => {
                                this.copyCodeToClipboard()

                            }}
                        >
                            <Image style={styles.clipboardImageView}
                                source={require('img/copy.png')}
                            />
                        </TouchableOpacity>


                        <Text style={styles.ReferalCodeTextView}> {UserStore.user.referral_code} </Text>

                        <TouchableOpacity style={styles.RefShareButtonView}
                            onPress={() => {
                                ShareStore.shareReferralCode(UserStore.user.referral_code)
                            }}
                        >
                            <Image style={[styles.clipboardImageView,
                                // {height:20,width:22}
                            ]}
                                source={require('img/share.png')}
                            />
                        </TouchableOpacity>
                    </View>

                </View>

            </View>

        )
    }

    renderModal() {
        return (
            <Modal
                visible={this.state.showModal}
                transparent={true}>

                <TouchableOpacity style={[styles.modalBaseView, { justifyContent: 'center', alignItems: 'center' }]}
                    onPress={() => {
                        this.setState({ showModal: false })
                    }}
                >

                </TouchableOpacity>

                <View style={[styles.cardView,{position:"absolute", top:windowHeight/3}]}>

                    <Text style={styles.ReferalCodeTextViewNew}> {UserStore.user.referral_code}
                    </Text>
                    <Text style={styles.ReferalCodeTextDescriptionNew}>Refer a friend and receive discount coupon on your purchase.
 </Text>

                    <TouchableOpacity style={styles.ReferViewButtonNew}
                        onPress={() => {
                            this.setState({ showModal: false })
                            this.copyCodeToClipboard()
                        }}>
                        <Text style={styles.ReferalCodeButtonText}>Copy To Clipboard</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.ReferViewButtonNew}
                        onPress={() => {

                            setTimeout(() => {
                                ShareStore.shareReferralCode(UserStore.user.referral_code)

                            }, 200)
                            this.setState({ showModal: false })
                        }}>
                        <Text style={styles.ReferalCodeButtonText}>Share Referral Code</Text>
                    </TouchableOpacity>

                </View>
            </Modal>
        );
    }

    render() {
        let store = CouponListStore;
        let content = (
            <View style={styles.indicator}>
                <ActivityIndicator size='large' />
            </View>
        );

        if (store.isLoading) {
            content = (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size='large' />
                </View>
            );
        } else if (store.couponList.length == 0) {
            content = (
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            paddingTop: h(38),
                            fontSize: h(34),
                            textAlign: 'center',
                            fontFamily: FONTS.BOOK_OBLIQUE
                        }}>
                        There are no coupons yet.
                </Text>
                </View>
            );
        } else {
            content = (
                <ListView
                    dataSource={store.dataSource}
                    renderRow={(rowData, index) =>
                        <ReferAndEarnRow item={rowData} />
                    }
                    renderFooter={
                        () => {
                            if (store.nextPage != null) {
                                return (
                                    <View style={{ flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center' }}>
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
                    title="Refer And Earn" />

                {content}
                <Toast ref="toast" />
                {this.renderModal()}

                {/* <View style={styles.ReferViewBase}> */}

                <TouchableOpacity style={styles.ReferViewButton}
                    onPress={() => {
                        // this.setState(previousState => (
                        //     { showModal: !previousState.showModal }
                        //   ))
                        this.setState({ showModal: true })
                    }}
                >
                    <Text style={styles.ReferalCodeButtonText}>REFER A FRIEND</Text>
                </TouchableOpacity>

                {/* </View>                  */}

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
    ReferViewBase: {
        height: windowHeight / 8,
        width: windowWidth,
        // backgroundColor:COLORS.LIGHT4,
        backgroundColor: COLORS.GREEN,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ReferViewButton: {
        height: windowHeight / 18,
        width: windowWidth - 60,
        marginLeft: 30,
        marginBottom: 20,
        // backgroundColor:COLORS.LIGHT4,
        backgroundColor: COLORS.GREEN,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ReferalCodeText: {
        marginTop: 5,
        fontSize: (windowHeight < 700) ? 14 : 16,
        fontFamily: FONTS.BLACK,
        // color:COLORS.BLACK,
        color: COLORS.BLACK,
        textAlignVertical: 'top',
    },


    ReferalCodeButtonText: {
        // marginTop:5,
        fontSize: (windowHeight < 700) ? 14 : 16,
        fontFamily: FONTS.BLACK,
        // color:COLORS.BLACK,
        color: COLORS.WHITE,
        alignSelf: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    ReferalCodeTextDescription: {
        marginTop: 5,
        fontSize: (windowHeight < 700) ? 12 : 14,
        fontFamily: FONTS.MEDIUM,
        color: COLORS.BLACK,
        textAlignVertical: 'top',
    },
    CopyToClipboardBaseView: {
        flexDirection: 'row',
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5
        // backgroundColor:'blue'
    },
    btnCopyToClipboard: {
        // marginLeft:10,
        marginRight: 2,
        height: 20,
        width: 20
    },
    clipboardImageView: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
        tintColor: COLORS.BLACK,
        // backgroundColor:'yellow'
    },
    ReferalCodeTextView: {
        fontSize: (windowHeight < 700) ? 20 : 22,
        fontFamily: FONTS.BLACK,
        color: COLORS.BLACK,
        textAlignVertical: 'center',
        // backgroundColor:'red'
    },
    RefShareButtonView: {
        flexDirection: 'column',
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    RefShareImageView: {
        height: 22,
        width: 20,
        resizeMode: 'contain',
        tintColor: COLORS.BLACK,
        alignSelf: 'center'
    },
    modalBaseView: {
        height: windowHeight,
        width: windowWidth,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    modalCloseButton: {
        height: 25,
        width: 25,
        // backgroundColor:'yellow',
        marginLeft: windowWidth - 50,
        marginTop: 50
    },
    ReferalCodeTextDescriptionNew: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: (windowHeight < 700) ? 12 : 14,
        fontFamily: FONTS.MEDIUM,
        color: COLORS.WHITE,
        textAlignVertical: 'top',
    },
    ReferViewButtonNew: {
        height: windowHeight / 20,
        width: "80%",

        marginBottom: 20,
        // backgroundColor:COLORS.LIGHT4,
        backgroundColor: COLORS.GREEN,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardView: {
        // height:windowHeight/2,
        padding: 30,
        width: windowWidth / 1.2,
        backgroundColor: COLORS.BLACK,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 5
    },
    ReferalCodeTextViewNew: {
        fontSize: (windowHeight < 700) ? 20 : 22,
        fontFamily: FONTS.BLACK,
        color: COLORS.WHITE,
        textAlignVertical: 'center',
        // backgroundColor:'red'
    },
    // modalCloseButton:{

    // }


});
