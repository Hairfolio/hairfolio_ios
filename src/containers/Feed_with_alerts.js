import { ActivityIndicator, COLORS, FONTS, h, Image, ListView, React, Text, TouchableOpacity, View, windowWidth } from "Hairfolio/src/helpers";
import { observer } from "mobx-react/native";
import { Alert, Linking, NativeModules, StatusBar } from "react-native";
import DeepLinking from "react-native-deep-linking";
import Toast from "react-native-whc-toast";
import ServiceBackend from "../backend/ServiceBackend";
import NavigatorStyles from "../common/NavigatorStyles";
import Post from "../components/feed/Post";
import PureComponent from "../components/PureComponent";
import { STATUSBAR_HEIGHT } from "../constants";
import FB from "../firebaseMethod";
import { showAlert, showLog, windowHeight } from "../helpers";
import FeedStore from "../mobx/stores/FeedStore";
import NotificationsStore from "../mobx/stores/hfStore/NotificationsStore";
import NewMessageStore from "../mobx/stores/NewMessageStore";
import PostStore from "../mobx/stores/Post";
import PostDetailsStore from "../mobx/stores/PostDetailStore";
import UserStore from "../mobx/stores/UserStore";

let name_route = null;
let cache_id = null;
let timer = null;
let count = 0;
let count2 = 0;
// import QRCodeScanner from 'react-native-qr'

let postDetails;
let QRCodeScanner = NativeModules.QRCodeScanner;
let internetCheck = NativeModules.testInternet;

const NewMessageNumber = observer(() => {
  const store = NewMessageStore;

  if (store.newMessageNumber == 0) return null;

  return (
    <View
      style={{
        backgroundColor: "#E62727",
        width: h(26),
        height: h(26),
        borderRadius: h(13),
        position: "absolute",
        top: -2,
        // left: -h(7),
        right: -h(10),
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Text
        style={{
          fontSize: h(16),
          fontFamily: FONTS.HEAVY,
          color: "white",
          backgroundColor: "transparent"
        }}
      >
        {store.newMessageNumber}
      </Text>
    </View>
  );
});

const FeedHeader = observer(props => {
  return (
    <View>
      <View
        style={{
          width: windowWidth,
          height: windowHeight > 800 ? h(102) : h(92),
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: windowHeight > 800 ? 20 : 0,
          zIndex: 9999999999
        }}
      >
        <Image
          style={{
            height: h(25),
            resizeMode: "contain"
          }}
          source={require("img/feed_header.png")}
        />

        <View
          style={{
            flexDirection: "row",
            padding: 20,
            position: "absolute",
            alignSelf: "center",
            alignItems: "center",
            right: 8,
            zIndex: 9999999999
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              props.onPressMethod();
            }}
          >
            <Image
              style={{
                width: h(45),
                height: h(42),
                alignSelf: "flex-end",
                tintColor: COLORS.BLACK
              }}
              source={require("img/scanner.png")}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              props.navigator.push({
                screen: "hairfolio.Messages",
                title: "Messages",
                navigatorStyle: NavigatorStyles.basicInfo
              });
            }}
            style={{ marginLeft: h(28) }}
          >
            <View
              style={{
                marginRight: h(28),
                height: h(32),
                width: h(44)
              }}
            >
              <Image
                style={{ height: h(32), width: h(44) }}
                source={require("img/feed_mail.png")}
              />
              <NewMessageNumber />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

@observer
export default class Feed extends PureComponent {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.state = {
      is_loaded: false
    };

    this.navigateToDetail = this.navigateToDetail.bind(this);
    this.startScanning = this.startScanning.bind(this);
  }

  componentDidMount() {
    StatusBar.setBarStyle("dark-content", true);
    NewMessageStore.load();
    FeedStore.load();
    FeedStore.hasLoaded = true;
    FB.onMessageReceived();
    NotificationsStore.resetNotificationBadgeCount();
    this.linkingRoute();
  }

  showLog2(msg) {
    console.log(msg);
  }

  linkingRoute() {
    // To open post detail from mobile browser url

    DeepLinking.addScheme("hairfolio://"); //this is mandatory to open app from mobile browser link

    Linking.addEventListener("url", event => {
      this.showLog2("linkingRoute event ==>" + JSON.stringify(event));
      Alert.alert(
        "Want to navigate?",
        "url ==>"+event.url,
        [
          {
            text: "YES",
            onPress: () => {
              this.navigateToDetail(event.url);
            }
          }
        ],
        {
          cancelable: false
        }
      );
      
    }); // added listener

    DeepLinking.addRoute("/PostDetails", response => {
      // example://test/100/details
      this.showLog2("DeepLinking.addRoute ==> " + JSON.stringify(response));
    });

    Linking.getInitialURL().then(
      url => {
        if (url) {
          Linking.openURL(url);
        } else {
          this.showLog2("Linking.getInitialURL else ==>" + url);
        }
      },
      err => {
        this.showLog2("Linking.getInitialURL error ==>" + JSON.stringify(err));
      }
    );
  }

  loadScreenOnAppear() {
    FeedStore.reset();
    StatusBar.setBarStyle("dark-content", true);
    NewMessageStore.load();
    FeedStore.load();
    FeedStore.hasLoaded = true;
    FB.onMessageReceived();
    NotificationsStore.resetNotificationBadgeCount();
  }

  startScanning() {
    QRCodeScanner.enableClick();

    QRCodeScanner.scanImage("", o1 => {
      //got scanned information

      setTimeout(() => {
        Alert.alert(
          "We got result",
          "url ==>" + o1,
          [
            {
              text: "OK",
              onPress: () => {
                FeedStore.isQrLoading = false;

                if (o1) {
                  // has value
                  FeedStore.isQrLoading = false;
                  internetCheck.testMethod(o => {
                    FeedStore.isQrLoading = false;
                    if (o == true) {
                      Alert.alert(
                        "Want to navigate?",
                        "",
                        [
                          {
                            text: "YES",
                            onPress: () => {
                              this.navigateToDetail(o1);
                            }
                          }
                        ],
                        {
                          cancelable: false
                        }
                      );
                    } else {
                      FeedStore.isQrLoading = false;
                      setTimeout(() => {
                        showAlert("Please check your Internet Connection.");
                      }, 1000);
                    }
                  });
                } else {
                  // doesn't have value
                  FeedStore.isQrLoading = false;
                  setTimeout(() => {
                    this.refs.toast.show(
                      "Invalid QR",
                      Toast.Duration.long,
                      Toast.Position.bottom
                    );
                  }, 500);
                }
              }
            }
          ],
          {
            cancelable: false
          }
        );
      }, 1000);
    });
  }

  navigateToDetail = url => {
    // call method in the same way

    let url_string = JSON.stringify(url);

    if (url_string.indexOf("hairfolio") > -1) {
      const route = url.replace(/.*?:\/\//g, "");
      const id = route.match(/\/([^\/]+)\/?$/)[1];
      const routeName = route.split("/")[0];

      this.showLog2("navigateToDetail ==> " + url);
      this.showLog2("id ==>" + id + " routeName ==>" + routeName);

      internetCheck.testMethod(o => {
        //check network connectivity before fetching post detail

        FeedStore.isQrLoading = false;

        if (o == true) {
          name_route = routeName; // stored in a global var
          cache_id = id; // stored in a global var

          Alert.alert(
            "Fetching post detail for you ...",
            "post id ==>"+id,
            [
              {
                text: "GO AHEAD",
                onPress: () => {
                  this.callSinglePostApi(routeName, id);
                }
              }
            ],
            {
              cancelable: false
            }
          );

          
        } else {
          FeedStore.isQrLoading = false;
          setTimeout(() => {
            showAlert("Please check your Internet Connection.");
          }, 1000);
        }
      });
    } else {
      FeedStore.isQrLoading = false;
      QRCodeScanner.showAlert();
    }
  };

  async callSinglePostApi(uniqueCode, post_id) {
    this.showLog2("uniqueCode ==> " + uniqueCode + " post_id ==>" + post_id);

    FeedStore.isQrLoading = true; // show loader

    ServiceBackend.getPostDetail(`posts/${post_id}`).then(
      postDetails => {
        FeedStore.isQrLoading = false;

        if (postDetails.status == 404 || postDetails.status == "404") {
          showAlert(postDetails.error); // it returns error message from server
        } else {
          Alert.alert(
            "Api success",
            JSON.stringify(postDetails),
            [
              {
                text: "GREAT !",
                onPress: () => {
                  this.goToPostDetail(postDetails, uniqueCode);
                }
              }
            ],
            {
              cancelable: false
            }
          );
          
          // this.goToPostDetail(postDetails, uniqueCode);
        }
      },
      error => {
        FeedStore.isQrLoading = false;

        Alert.alert(
          "Api failed",
          JSON.stringify(error),
          [
            {
              text: "Retry",
              onPress: () => {

                if (count < 3) {
                  count++;
                  this.showLog2("In Loop ==>" + count);
                  this.callSinglePostApi(name_route, cache_id);
                } else {
                  count = 0;
                  this.showLog2("Loop over ==>" + count);
                }
                
              }
            }
          ],
          {
            cancelable: false
          }
        );


        
      }
    );
  }

  goToPostDetail(postDetails, uniqueCode) {
    let post = new PostStore();

    post.init(postDetails.post, uniqueCode).then(
      () => {
        FeedStore.isQrLoading = false;

        Alert.alert(
          "Redirecting to post detail ...",
          "",
          [
            {
              text: "yippie",
              onPress: () => {
                showLog("OK Pressed");
                setTimeout(() => {
                  PostDetailsStore.jump(
                    // go to product detail screen
                    false,
                    post,
                    this.props.navigator,
                    "from_feed",
                    uniqueCode
                  );
                }, 500);
              }
            }
          ],
          {
            cancelable: false
          }
        );
      },
      error => {
        FeedStore.isQrLoading = false;

        Alert.alert(
          "Redirection failed",
          JSON.stringify(error),
          [
            {
              text: "Retry",
              onPress: () => {

                if (count2 < 3) {
                  count2++;
                  this.showLog2("In Loop2 ==>" + count2);
                  this.goToPostDetail(postDetails, uniqueCode);
                } else {
                  count2 = 0;
                  this.showLog2("Loop2 over ==>" + count2);
                }
                
              }
            }
          ],
          {
            cancelable: false
          }
        );


        // this.showLog2("goToPostDetail error ==>" + JSON.stringify(error));
        
      }
    );
  }

  returnBlank() {
    StatusBar.setBarStyle("dark-content", true);
    return "There are no posts in the feed yet.";
  }

  componentWillUnmount() {
    // Linking.removeEventListener('url', this.handleOpenURL);
  }

  onNavigatorEvent(event) {
    this.showLog2("Main feed navigator ==>" + event.id);
    switch (event.id) {
      case "willAppear":
        this.setState({ is_loaded: true });
        console.log("Feed will appear ==>" + event.id);
        StatusBar.setBarStyle("dark-content", true);
        this.props.navigator.toggleTabs({
          to: "shown"
        });
        break;
      case "didAppear":
        this.showLog2("Feed js ==>" + event.id);
        StatusBar.setBarStyle("dark-content", true);
        break;
      case "bottomTabSelected":
        this.showLog2("Feed js ==>" + event.id);
        StatusBar.setBarStyle("dark-content", true);
        NewMessageStore.load();
        FeedStore.load();
        FeedStore.hasLoaded = true;
        break;
      case "bottomTabReselected":
        this.showLog2("Feed js ==>" + event.id);
        FeedStore.reset();
        NewMessageStore.load();
        FeedStore.load();
        FeedStore.hasLoaded = true;
        break;
      case "willDisappear":
        break;
      default:
        break;
    }
  }

  checkUserName(p) {
    this.showLog2("RB POST DETAIL ==> " + JSON.stringify(p));
    var user = UserStore.user;
    this.showLog2("USER DETAIL ==> " + JSON.stringify(user.id));
    this.showLog2("CREATOR DETAIL ==> " + JSON.stringify(p.creator.id));

    if (user.id == p.creator.id) {
      if (user.account_type == "owner") {
        if (user.salon) {
          if (user.first_name && user.last_name) {
          } else {
            p.creator.name = user.salon.name;
          }
        }
      }
    }
    return <Post key={p.key} post={p} navigator={this.props.navigator} />;
  }

  render() {
    let store = FeedStore;

    let content = (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );

    if (store.isLoading) {
      content = (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    } else if (store.elements.length == 0) {
      content = (
        <View style={{ flex: 1 }}>
          <Text
            style={{
              paddingTop: h(38),
              fontSize: h(34),
              textAlign: "center",
              fontFamily: FONTS.BOOK_OBLIQUE
            }}
          >
            {this.returnBlank()}
          </Text>
        </View>
      );
    } else {
      StatusBar.setBarStyle("dark-content", true);
      content = (
        <ListView
          dataSource={store.dataSource}
          renderRow={(p, i) => this.checkUserName(p)}
          renderFooter={() => {
            if (store.getNextPage()) {
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
              return null;
            }
          }}
          onEndReached={() => {
            store.loadNextPage();
          }}
        />
      );
    }

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
          paddingTop: STATUSBAR_HEIGHT
        }}
      >
        <FeedHeader
          navigator={this.props.navigator}
          onPressMethod={() => {
            this.startScanning();
          }}
        />

        {content}
        <Toast ref="toast" />

        {store.isQrLoading ? (
          <View
            style={{
              position: "absolute",
              backgroundColor: "black",
              opacity: 0.5,
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999999999
            }}
          >
            <ActivityIndicator size="large" />
            <Text style={{ color: COLORS.WHITE, marginTop: 20 }}>
              Loading ...
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}
