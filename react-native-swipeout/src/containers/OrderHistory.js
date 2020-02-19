import { observer } from "mobx-react";
import React, { Component } from "react";
import { ListView, StatusBar, StyleSheet, View } from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import NavigatorStyles from "../common/NavigatorStyles";
import BlackHeader from "../components/BlackHeader";
import OrderHistoryRow from "../components/Orders/OrderHistoryRow";
import PlaceHolderText from "../components/PlaceHolderText";
import LinkTabBarOrders from "../components/post/LinkTabBarOrders";
import { ActivityIndicator, showLog } from "../helpers";
import OrderStore from "../mobx/stores/hfStore/OrderStore";
import { COLORS } from "../style";

@observer
export default class OrderHistory extends Component {
  constructor(props) {
    super(props);

    // var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      active_index: 0,
      cartProductsArr: null, //[{},{},{}],
      // arrRequestedOrders: ds,
    };
  }

  componentDidMount() {
    StatusBar.setBarStyle("light-content");
    OrderStore.requestedOrders = [];
    OrderStore.pastOrders = [];
    OrderStore.load("delivered", "onPress");
  }

  componentWillUnmount(){
    StatusBar.setBarStyle("dark-content");
  }
  

  pastOrderView() {
    let store = OrderStore;

    return (
      <View style={styles.wrapper}>
        {store.pastOrders && store.pastOrders.length != 0 ? (
          <ListView
            bounces={false}
            enableEmptySections={true}
            dataSource={store.dataSourceForPast}
            renderRow={data => {
              return <OrderHistoryRow product={data} 
                                      isPending={true} 
                                      onPressOrder={()=>{
                                        this.props.navigator.push({
                                          screen: 'hairfolio.OrderDetails',
                                          navigatorStyle: NavigatorStyles.tab,
                                          passProps: {
                                            orderDetail: data,
                                          }
                                        });
                                      }}
                                     />;
            }}
            onEndReached={() => {
              
              OrderStore.loadNextPage("delivered");
            }}
            renderFooter={() => {
              if (store.nextPage != null) {
                return (
                  <View
                    style={{
                      flex: 1,
                      paddingVertical: 20,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <ActivityIndicator size="large" />
                  </View>
                );
              } else {
                return <View />;
              }
            }}
          />
        ) : (
          <PlaceHolderText message="Your past order history is empty" />
        )}
      </View>
    );
  }

  requestOrderView() {
    let store = OrderStore;
    return (
      <View style={styles.wrapper}>
        {store.requestedOrders && store.requestedOrders.length != 0 ? (
          <ListView
            bounces={false}
            enableEmptySections={true}
            dataSource={store.dataSourceForRequested}
            renderRow={data => {
              return (
                <OrderHistoryRow
                  product={data}
                  isPending={false}
                  onPress={() => {
                    showLog("ORDERS ==> " + JSON.stringify(data));
                    this.goToTrackMyOrder(data);
                  }}
                  onPressOrder={()=>{
                    this.props.navigator.push({
                      screen: 'hairfolio.OrderDetails',
                      navigatorStyle: NavigatorStyles.tab,
                      passProps: {
                        orderDetail: data,
                      }
                    });
                  }}
                />
              );
            }}
            onEndReached={() => {
              OrderStore.loadNextPage("pending");
            }}
            renderFooter={() => {
              if (store.nextPage != null) {
                return (
                  <View
                    style={{
                      flex: 1,
                      paddingVertical: 20,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <ActivityIndicator size="large" />
                  </View>
                );
              } else {
                return <View />;
              }
            }}
          />
        ) : (
          <PlaceHolderText message="Your current order history is empty" />
        )}
      </View>
    );
  }

  goToTrackMyOrder(data) {
    this.props.navigator.push({
      screen: "hairfolio.TrackMyOrder",
      navigatorStyle: NavigatorStyles.tab,
      passProps: {
        order_id: data.order_number,
        shipping_status: data.shipping_status
      }
    });
  }
    
  handleChangeScreen(i) {
    this.setState({
      active_index: i
    });
    OrderStore.requestedOrders = [];
    if (i == "1" || i == 1) {
      OrderStore.load("pending", "onPress");
    } else if (i == "0" || i == 0) {
      OrderStore.load("delivered", "onPress");
    }
  }

  render() {
    let store = OrderStore;
    let content = (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" />
      </View>
    );

    if (store.isLoading) {
      content = (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size='large' />
          </View>
      );
    } else {
    content = (
      <ScrollableTabView
        renderTabBar={() => <LinkTabBarOrders />}
        initialPage={this.state.active_index}
        onChangeTab={({ i }) => {
          this.handleChangeScreen(i);
        }}
      >
        <View
          tabLabel="Past Order"
          tabIcon={"test"}
          navigator={this.props.navigator}
        >
          {this.pastOrderView()}
        </View>
        <View
          tabLabel="Request Order"
          tabIcon={"test2"}
          navigator={this.props.navigator}
        >
          {this.requestOrderView()}
        </View>
      </ScrollableTabView>
    );
    }

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE
        }}
      >
        <BlackHeader
          onLeft={() => {this.props.navigator.pop({ animated: true })
          StatusBar.setBarStyle('dark-content')
          }}
          title="Order History"
        />
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 10
  }
});
