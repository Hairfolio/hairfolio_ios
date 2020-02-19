import { ActivityIndicator, AlertIOS, autobind, Component, FONTS, h, Image, observer, React, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';
import ReactNative, { Dimensions, NativeModules, StyleSheet } from 'react-native';
import Triangle from 'react-native-triangle';
import NavigatorStyles from '../common/NavigatorStyles';
import LoadingScreen from '../components/LoadingScreen';
import AddTagModal from '../components/post/AddTagModal';
import SlimHeader from '../components/SlimHeader';
import VideoPreview from '../components/VideoPreview';
import { COLORS, showLog, showAlert } from '../helpers';
import AddServiceStore from '../mobx/stores/AddServiceStore';
import AddTagStore from '../mobx/stores/AddTagStore';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import ProductTagStore from '../mobx/stores/ProductTagStore';
import ShareStore from '../mobx/stores/ShareStore';
import PostDetailStore from '../mobx/stores/PostDetailStore';


const RCTUIManager = NativeModules.UIManager;
const ImageFilter = NativeModules.ImageFilter;


let count = 0;

var { height, width } = Dimensions.get('window');

let currentStore = CreatePostStore;
// let currentStore = null;



let data = {
  "id": 4,
  "name": "Hair Repair kit",
  "position": 0,
  "created_at": "2018-11-21T12:08:31.093Z",
  "updated_at": "2018-11-22T06:22:46.578Z",
  "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
}

class ProductTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      top: null,
      left: null,
      width: null,
    };

  }

  goToProductDetail() {
    // this.props.navigator.push({
    //   screen: 'hairfolio.ProductDetail',
    //   navigatorStyle: NavigatorStyles.tab,
    //   passProps: {
    //     prod_id: data.id,
    //     categoryTitle: "conditioner"
    //   }
    // });
  }

  async displayPicData(response) {
    for (key in response) {
      showLog("displayPicData ==>" + key + " value ==>" + response[key]);
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.displayPicData(this.props.pic);
      this.refs.hashView2.measure((a, b, width, height, px, py) => {

        // this.setState({

        //   width: width + 10,
        //   left: (this.props.pic.x < 60) ?
        //     this.props.pic.x + width / 12 :
        //     (this.props.pic.x > 300) ?
        //       (windowHeight > 650) ?
        //         (windowHeight > 800) ?
        //           this.props.pic.x - width :
        //           this.props.pic.x - width / 1.8
        //         :
        //         this.props.pic.x - width / 0.85
        //       :
        //       this.props.pic.x - width / 3.5,
        //   top: this.props.pic.y - h(25)
        // });

        this.setState({

          width: width + 10,
          left: this.props.pic.x, //- width / 2 - 5,
          top: this.props.pic.y //- h(25)
        });
      });
    });
  }

  render() {
    // alert(JSON.stringify(this.props))
    const placeholder_icon = require('img/medium_placeholder_icon.png');
    return (
      <View
        ref='hashView2'
        style={{
          position: 'absolute',
          top: this.state.top,
          left: this.state.left,
          width: this.state.width,
          height: windowHeight / 13,
          width: (windowHeight > 600) ? width / 1.5 : width / 1.8,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          backgroundColor: 'red',
          alignItems: 'center',
          flexDirection: 'row',
          borderRadius: 5,
          backgroundColor: COLORS.WHITE,
        }}
      >

        <View style={styles.tagImageParentView}>
          <Image style={styles.tagImageView} defaultSource={placeholder_icon} source={(this.props.pic.product_image) ? { uri: this.props.pic.product_image } : placeholder_icon} />
        </View>
        <TouchableOpacity style={styles.textParentView}
          onPress={() => {
            this.goToProductDetail()
          }}>
          <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">{this.props.pic.name}</Text>

          {(this.props.pic.discount_percentage) ? 
            <View style={{flexDirection:'row'}}>
              <Text style={styles.priceView}>${this.props.pic.price}</Text>
              <Text style={[styles.finalPriceView,{marginLeft:10}]}>${this.props.pic.final_price}</Text>
            </View>
          :
          <Text style={styles.finalPriceView}>${this.props.pic.final_price}</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageGoParentView}
          onPress={() => {
            this.goToProductDetail()
          }}>
          <Image style={styles.imageGoView} source={require('img/next_icon.png')} />
        </TouchableOpacity>

      </View>
    );
  }
}

class HashTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      top: -100,
      left: -100,
      width: null,
    };
  }

  async displayPicData(response) {
    for (key in response) {
      showLog("displayPicData ==>" + key + " value ==>" + response[key]);
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.displayPicData(this.props.pic);
      this.refs.hashView.measure((a, b, width, height, px, py) => {
        this.setState({
          width: width + 10,
          left: this.props.pic.x - width / 2 - 5,
          top: this.props.pic.y - h(25)
        });
      });
    });
  }

  render() {

    return (
      <View
        ref='hashView'
        style={{
          position: 'absolute',
          top: this.state.top,
          left: this.state.left,
          width: this.state.width,
          height: 25,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <Triangle
          width={10}
          height={25}
          color={COLORS.DARK}
          direction={'left'}
        />

        <Text style={{ paddingLeft: 5, paddingTop: 3, paddingRight: 5, backgroundColor: '#3E3E3E', fontSize: 15, height: 25, color: 'white' }}>#{this.props.pic.hashtag}</Text>
      </View>
    );
  }
}


const ImagePreview = observer(({ gallery, navigator }) => {

  if (currentStore.loadGallery) {
    return (
      <View
        style={{
          width: windowWidth,
          height: windowWidth * (4 / 3),
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size='large' />
      </View>
    );
  }


  if (gallery.selectedPicture == null) {

    return (
      <View
        style={{
          width: windowWidth,
          height: windowWidth * (4 / 3),
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 30,
            textAlign: 'center'
          }}
        >
          No picture
        </Text>
      </View>
    );
  }

  let deletePicture = () => {
    AlertIOS.alert(
      gallery.selectedPicture.isVideo ? 'Delete Video' : 'Delete Picture',
      'Are you sure you want to delete this item from the gallery?',
      [
        { text: 'Yes', onPress: () => gallery.deleteSelectedPicture() },

        { text: 'No', onPress: () => showLog('Cancel Pressed') },
      ],
    );

  };

  let filterPicture = () => {
    currentStore.gallery.filterStore.reset();
    setTimeout(() => 

    currentStore.gallery.filterStore.setMainImage(currentStore.gallery.selectedPicture)
    , 500);
    navigator.push({
      screen: 'hairfolio.FilterPage',
      navigatorStyle: NavigatorStyles.tab,
    });
  };

  window.picture = gallery.selectedPicture;

  let closeBtn = (
    <TouchableOpacity
      onPress={deletePicture}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: h(14)
      }}
    >
      <View>
        <Image
          source={require('img/post_close.png')}
        />
      </View>
    </TouchableOpacity>
  );
  if (gallery.selectedPicture.isVideo) {
    return (
      <View>
        
        <VideoPreview picture={gallery.selectedPicture} />
        {closeBtn}
      </View>
    );
  }

  return (
    <View
      style={{
        width: windowWidth,
        height: windowWidth * (4 / 3),
      }}
    >
      <TouchableWithoutFeedback
        onPress={(a, b) => {
          gallery.position.x = a.nativeEvent.locationX;
          gallery.position.y = a.nativeEvent.locationY;
          if (gallery.serviceTagSelected) {
            AddServiceStore.reset();
            AddServiceStore.posX = a.nativeEvent.locationX;
            AddServiceStore.posY = a.nativeEvent.locationY;
            AddServiceStore.save = (obj) => {
              currentStore.gallery.addServicePicture(
                AddServiceStore.posX,
                AddServiceStore.posY,
                obj
              );
              navigator.dismissModal({ animationType: 'slide-down' });
            };
            navigator.showModal({
              screen: 'hairfolio.AddServicePageOne',
              navigatorStyle: NavigatorStyles.tab,
              passProps: { goBack: this.props }
            });
          } else if (gallery.linkTagSelected) {
            navigator.push({
              screen: 'hairfolio.AddLink',
              navigatorStyle: NavigatorStyles.tab,
            })
          } else if (gallery.hashTagSelected) {
            StatusBar.setHidden(true);
            AddTagStore.show();
          }
          else if (gallery.productTagSelected) {
            // StatusBar.setHidden(true);
            // ProductTagStore.show();
            if(currentStore.productCounter < 6)
            {
              ProductTagStore.reset();
              ProductTagStore.posX = a.nativeEvent.locationX;
              ProductTagStore.posY = a.nativeEvent.locationY;
              ProductTagStore.save = (obj) => {
                currentStore.gallery.addProductToPicture(
                  ProductTagStore.posX,
                  ProductTagStore.posY,
                  obj
                );

                if (ProductTagStore.isDone) {
                  currentStore.productCounter = currentStore.productCounter + 1  
                  navigator.dismissModal({ animationType: 'slide-down' });
                }

              };
              ProductTagStore.loadMenu();
              navigator.showModal({
                screen: 'hairfolio.FilterProductForProductTag',
                // screen: 'hairfolio.ProductTagModal',
                navigatorStyle: NavigatorStyles.tab,
                passProps: { goBack: this.props }
              });

            }
            else
            {
              showAlert("You already selected 6 products!")
            }
          }

        }}>
        {/* thisImagefor preview */}
        <Image
          ref={(el) => window.img = el}
          defaultSource={require('img/medium_placeholder_icon.png')}
          style={{ width: windowWidth,flex:1 }}
          onError={(e) => alert(e.nativeEvent.error)}
          source={gallery.selectedPicture.source}
        />
      </TouchableWithoutFeedback>
      {closeBtn}
      {gallery.selectedPicture.isVideo ? <View /> :
        <TouchableOpacity
          onPress={filterPicture}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            padding: h(14)
          }}
        >
          <View>
            <Image
              style={{ height: 35, width: 35 }}
              source={require('img/post_filter.png')}
            />
          </View>
        </TouchableOpacity>
      }
      {gallery.selectedPicture.tags.map((pic, index) => {
        showLog("g page ==>" + JSON.stringify(gallery.selectedPicture))
        let style = {
          position: 'absolute',
          top: pic.y - 13,
          left: pic.x - 13,
          height: 26,
          width: 26,
          backgroundColor: COLORS.DARK,
          borderRadius: 13,
          justifyContent: 'center',
          alignItems: 'center'
        };
        if (pic.type == 'hashtag') {
          return (
            <HashTag key={
              (pic.key) ? pic.key : count++
            } pic={pic} />

          );
        }
        if (pic.type == 'producttag') {
          return (
            <ProductTag key={
              (pic.key) ? pic.key : count++
            } pic={pic}
              navigator={navigator} />
          );
        }
        if (pic.imageSource) {

          if (pic.type == 'producttag') {
            return (
              <ProductTag key={
                (pic.key) ? pic.key : count++
              } pic={pic}
                navigator={navigator} />
            );
          }
          else {
            return (
              <Image
                style={style}
                key={pic.key}
                source={pic.imageSource}
              />
            );
          }

        }
        return (
          <View
            key={pic.key}
            style={style}>
            <Text style={{ fontSize: 15, backgroundColor: 'transparent', color: 'white' }}>{pic.abbrev}</Text>
          </View>
        );
      })}
    </View>
  );
});

const ActionRow = observer(({ tagMenu, imageStyle }) => {
  let backgroundColor = tagMenu.selected ? COLORS.DARK : COLORS.WHITE;
  let fontColor = tagMenu.selected ? COLORS.WHITE : COLORS.DARK;

  return (
    <TouchableWithoutFeedback
      onPress={() => tagMenu.select()}
    >
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', 
                    alignItems: 'center', backgroundColor: backgroundColor, 
                    borderWidth: 0.005,borderColor: COLORS.RED }}>
        <Image
          style={{ height: h(34), width: h(28), marginRight: 5, ...imageStyle }}
          source={tagMenu.source}
        />
        <Text
          style={{
            fontSize: h(24),
            color: fontColor
          }}
        >
          {tagMenu.title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
});

const ActionRow2 = observer(({ tagMenu, imageStyle }) => {
  let backgroundColor = tagMenu.selected ? COLORS.DARK : COLORS.WHITE;
  let fontColor = tagMenu.selected ? COLORS.WHITE : COLORS.DARK4;

  return (
    <TouchableWithoutFeedback
      onPress={() => tagMenu.select()}
    >
      <View style={{
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColor,
      }}>
        <Image
          style={{ height: h(34), width: h(28), marginRight: 3, ...imageStyle }}
          source={tagMenu.source}
        />
        <Text
          style={{
            fontSize: (height > 650) ? h(24) : (height < 600) ? h(24) : h(22),
            color: fontColor
          }}
        >
          {tagMenu.title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
});

const ActionMenu = observer(({ gallery }) => {

  if (gallery.selectedPicture == null) {
    return <View />;
  }

  if (gallery.selectedPicture.isVideo) {
    return (
      <View
        style={{ height: h(82), backgroundColor: 'white', flexDirection: 'row' }}
      />
    );
  }

  return (

    <View>
      <View style={{flexDirection: 'row', height: h(82) }}>
      <ActionRow
        imageStyle={{
          width: h(19),
          height: h(27),
        }}
        tagMenu={gallery.hashTagMenu}
      />
      <ActionRow
        imageStyle={{
          width: h(26),
          height: h(27)
        }}
        tagMenu={gallery.productTagMenu}
      />
    </View>

    <View style={{flexDirection: 'row', height: h(82) }}>
    <ActionRow
        imageStyle={{
          width: h(33),
          height: h(34)
        }}
        tagMenu={gallery.serviceTagMenu}
      />
      <ActionRow
        imageStyle={{
          width: h(26),
          height: h(27)
        }}
        tagMenu={gallery.linkTagMenu}
      />
    </View>


    </View>
    )

    {/* <View style={{ height: h(82), flexDirection: 'row' }} >
      <ActionRow
        imageStyle={{
          width: h(19),
          height: h(27),
        }}
        tagMenu={gallery.hashTagMenu}
      />

      <ActionRow
        imageStyle={{
          width: h(26),
          height: h(27)
        }}
        tagMenu={gallery.productTagMenu}
      />

      <ActionRow
        imageStyle={{
          width: h(33),
          height: h(34)
        }}
        tagMenu={gallery.serviceTagMenu}
      />
      <ActionRow
        imageStyle={{
          width: h(26),
          height: h(27)
        }}
        tagMenu={gallery.linkTagMenu}
      />
    </View> */}

  // );
});

const PlusPicture = observer(({ onPress }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: h(30) }}>
      <TouchableOpacity onPress={onPress} >
        <View
          style={{
            height: h(134),
            width: h(134),
            borderWidth: 1,
            borderColor: COLORS.GRAY_BORDER,
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontSize: h(100),
              color: COLORS.GRAY_BORDER,
              fontFamily: FONTS.SF_MEDIUM
            }}
          >+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const Picture = observer(({ picture }) => {
  let selectedBox;
  const placeholder_icon = require('img/medium_placeholder_icon.png');
  if (picture.selected) {
    selectedBox = (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: h(134),
          height: h(134),
          borderWidth: h(7),
          borderColor: COLORS.DARK
        }} />
    );
  }


  return (

    <TouchableWithoutFeedback onPress={() =>
      picture.select()
    }>
      <View
        style={{
          height: h(134),
          width: h(134),
          marginLeft: h(30),
        }}
      >

        <Image
          style={{ height: h(134), width: h(134), flex:1 }}
          defaultSource={placeholder_icon}
          source={(picture.source) ? picture.source : placeholder_icon}
        />
        {selectedBox}
      </View>
    </TouchableWithoutFeedback>


  );

});

const PictureView = observer(({ gallery, onPlus }) => {


  return (
    <ScrollView
      horizontal
      style={{
        height: h(170)
      }}
    >
      <PlusPicture onPress={onPlus} />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: h(30) }}>
        {gallery.pictures.map((el) =>
          <Picture picture={el} key={el.key} />
        )}
      </View>
    </ScrollView>
  );
});

const TagInfo = observer(({ gallery }) => {
  if (gallery.selectedTag == null) {
    return null;
  }
  return (
    <View
      style={{
        height: h(88),
        width: windowWidth,
        backgroundColor: COLORS.DARK,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: h(35)
        }}
      >Tap where to add tag</Text>
    </View>
  );
});

@observer
@autobind
export default class GalleryPage extends Component {

  constructor(props) {
    super(props);
    this.props.navigator.toggleTabs({
      to: 'shown',
    });

    currentStore.productCounter  = 0;
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }


  static navigatorStyle = {
    drawUnderTabBar: true,
  }

  componentWillMount() {
    PostDetailStore.unique_code = this.props.unique_code
    postDetails = ServiceBackend.get(`posts/${store.post.id}`);
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'bottomTabSelected':
        currentStore.reset();

        this.props.navigator.resetTo({
          screen: 'hairfolio.CreatePost',
          animationType: 'fade',
          navigatorStyle: NavigatorStyles.tab
        });

        break;
      default:
        break;
    }
  }

  scrollToElement(reactNode) {
    RCTUIManager.measure(ReactNative.findNodeHandle(reactNode), (x, y, width, height, pageX, pageY) => {
      RCTUIManager.measure(this.refs.scrollView.getInnerViewNode(), (x2, y2, width2, height2, pageX2, pageY2) => {
        var currentScroll = 64 - pageY2;
        var differenceY = -pageY - 320 + (windowHeight - 20 - h(88));
        if (currentScroll - differenceY > 0) {
          this.refs.scrollView.scrollTo({ y: currentScroll - differenceY });
        }
      });
    });
  }

  render() {

    let line = (key) => (

      <View
        key={key}
        style={{
          flex: 1,
          backgroundColor: COLORS.LIGHT_GRAY1,
          height: h(1)
        }}
      />
    );

    let title = "" //gal.selectedTag.title
    let bottomContent = [
      line('line1'),
      <PictureView
        key='preview'
        onPlus={() => {

          currentStore.reset(false);
          currentStore.gallery.unselectTag();
          StatusBar.setHidden(true)
          this.props.navigator.pop({ animated: true });
        }}
        gallery={currentStore.gallery}
      />,
      line('line2'),
      // <TextInput
      //   key='description'
      //   onFocus={(element) => this.scrollToElement(element.target)}
      //   onEndEditing={() => this.refs.scrollView.scrollTo({ y: 0 })}
      //   style={{
      //     height: 40,
      //     backgroundColor: 'white',
      //     paddingLeft: h(30),
      //     fontSize: h(28),
      //     color: COLORS.DARK
      //   }}
      //   multiline={true}
      //   placeholder='Post description'
      //   value={CreatePostStore.gallery.description}
      //   onChangeText={(text) => CreatePostStore.gallery.description = text}
      // />
    ];

    if (currentStore.gallery.selectedTag != null) {
      title = currentStore.gallery.selectedTag.title

      bottomContent = (
        <View
          style={{
            height: windowHeight - 20 - h(88) - windowWidth - h(82),
            width: windowWidth,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              color: COLORS.DARK4,
              fontSize: h(33),
              fontFamily: FONTS.OBLIQUE,
              fontWeight: '400'
            }}
          >Tap where to add tag</Text>
        </View>
      );
    }

    return (
      <View style={{ paddingTop: 20, paddingBottom: 50, backgroundColor: COLORS.WHITE, marginBottom: 45, }}>
        <SlimHeader
          leftText='Cancel'
          onLeft={() => {
            this.props.navigator.toggleTabs({
              to: 'shown',
            });
            this.props.navigator.popToRoot({ animated: true });
            this.props.navigator.switchToTab({
              tabIndex: 0,
            });
            currentStore.gallery.unselectTag();
            // only reset after view is gone
            setTimeout(() => currentStore.reset(), 1000);
          }}
          title='Gallery'
          titleStyle={{ fontFamily: FONTS.SF_MEDIUM }}
          rightText='Next'
          onRight={() => {

            if(currentStore.gallery.pictures.length > 0)
            {
              // if (!CreatePostStore.gallery.description || CreatePostStore.gallery.description.trim().length == 0) {
              //   CreatePostStore.gallery.description = CreatePostStore.gallery.description.trim()
              //   alert('Post description cannot be blank');
              // } else {
                currentStore.gallery.unselectTag();
                ShareStore.reset();
                this.props.navigator.push({
                screen: 'hairfolio.Share',
                navigatorStyle: NavigatorStyles.tab,
                })
              // }
            }
            else
            {
              alert('Select atleast 1 picture')
            }
           
          }}
        />
        <ScrollView
          ref='scrollView'
          bounces={false}
          scrollEventThrottle={16}
          onScroll={(e) => {
            const offset = e.nativeEvent.contentOffset.y;
          }}
          style={{
            backgroundColor: 'white',
          }}
        >
          {/* {title == "ADD TAG" ?
            <AddTagModal /> :
            <ProductTagModal />
          } */}

          <AddTagModal />

          <ImagePreview
            navigator={this.props.navigator}
            gallery={currentStore.gallery}

          />

          <ActionMenu gallery={currentStore.gallery} />

          {bottomContent}
        </ScrollView>
        <LoadingScreen style={{ opacity: 0.6 }} store={currentStore} />
      </View>
    );
  }
}

const styles = StyleSheet.create({

  tagImageParentView: {
    marginRight: 2,
    marginBottom: 2,
    height: windowHeight / 16,
    width: (windowHeight > 600) ? width / 8 : width / 10,
    marginLeft: 5,
  },
  tagImageView: {
    height: "100%",
    width: "100%",
    alignSelf: 'center',
  },
  textParentView: {
    marginLeft: 5,
    marginBottom: 2,
    marginRight: 2,
    height: (windowHeight > 600) ? windowHeight / 16 : windowHeight / 14,
    width: "60%",
  },
  imageGoParentView: {
    marginLeft: 0,
    marginBottom: 4,
    marginRight: 2,
    height: windowHeight / 16,
    width: "15%",
    justifyContent: 'center'
  },
  imageGoView: {
    height: "80%",
    width: "80%",
    resizeMode: 'center',
    alignSelf: 'center',
  },
  productName: {
    fontSize: 16,
    color: COLORS.BLACK,
    fontFamily: FONTS.MEDIUM
  },
  priceView: {
    fontSize: 15,
    color: COLORS.GRAY2,
    fontFamily: FONTS.BLACK,
    textDecorationLine:'line-through'
  },
  finalPriceView: {
    fontSize: 15,
    color: COLORS.BLUE,
    fontFamily: FONTS.BLACK
  }


});