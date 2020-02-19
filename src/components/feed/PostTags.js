import { FONTS, h, Image, observer, React, Text, TouchableOpacity, TouchableWithoutFeedback, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';
import { StyleSheet } from 'react-native';
import Triangle from 'react-native-triangle';
import { COLORS, showLog } from '../../helpers';
import NavigatorStyles from '../../common/NavigatorStyles';
let count = 0;

class ProductTagMain extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      top: null,
      left: null,
      width: null,
    };
  }

  componentDidMount() {
    
    setTimeout(() => {
      this.refs.hashView.measure((a, b, width, getheight, px, py) => {
        showLog("POST TAGS width ==>"+width)
        showLog("POST TAGS POSITION ==>"+getheight)

        showLog("POST TAGS X ==>"+this.props.pic.x)
        showLog("POST TAGS Y ==>"+this.props.pic.y)
        this.setState({
          width: width,
          left: this.props.pic.x - width/windowWidth/3.5,
          top : this.props.pic.y - windowHeight/13
        });
      });
    });
  }

  render() {
    return (
      <TouchableWithoutFeedback

        onPress={() => {
          this.props.store.selectTag(this.props.pic.id);
          this.props.navigator.push({
            screen: 'hairfolio.ProductDetail',
            navigatorStyle: NavigatorStyles.tab,
            passProps: {
              prod_id: this.props.pic.new_prod_id,
              categoryTitle: this.props.pic.name,
              isFromFeed:true
            }
          });

        }}
      >
        <View
          ref='hashView'
          style={{
            top : this.props.pic.y - windowHeight/13,
            left : this.state.left,
            alignItems: 'center',
            flexDirection: 'row',
            borderRadius: 5,
            backgroundColor: COLORS.WHITE,
            height: windowHeight / 13,
            width: (windowHeight > 600) ? windowWidth / 1.5 : windowWidth / 1.8, //windowWidth / 1.5,
          }}>

          <View style={styles.tagImageParentView}>
            <Image style={styles.tagImageView} source={{ uri: this.props.pic.cloudinary_url }} />
          </View>
          <View style={styles.textParentView}>
            <Text style={styles.productName} numberOfLines={1}>{this.props.pic.name}</Text>
            {/* <Text style={styles.priceView}>${this.props.pic.price}</Text>
           */}
             {(this.props.obj.product.discount_percentage != null) ?
            
            <View style={{flexDirection:'row'}}>
            <Text style={styles.priceView}> ${this.props.pic.price}</Text>
            <Text style={styles.finalPriceView}> ${this.props.pic.final_price}</Text>
            <Text style={styles.finalPriceView}> ${this.props.pic.discount_percentage}</Text> 
            </View>

            :
            <Text style={styles.finalPriceView}> ${this.props.obj.product.final_price}</Text>
            }
          </View>

            <Image style={styles.imageGoView} source={require('img/next_icon.png')} />
        
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

class ProductTag extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      top: -100,
      left: -100,
      width: null,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.refs.productView.measure((a, b, width, height, px, py) => {
        this.setState({
          width: width + 10,
          left: (windowHeight > 700 )?
                       this.props.pic.x - width/windowWidth/3.5
                          : this.props.pic.x - width/windowWidth/5.5 ,
          top: (windowHeight > 700 )? 
                  this.props.pic.y : this.props.pic.y - h(100)
        });
      });
    });
  }
  render() {
    const placeholder_icon = require('img/medium_placeholder_icon.png');
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.store.selectTag(this.props.pic.id);
          // alert("POST TAGS ==> "+JSON.stringify(this.props.pic.uniqueCode))
         
          this.props.navigator.push({
            screen: 'hairfolio.ProductDetail',
            navigatorStyle: NavigatorStyles.tab,
            passProps: {
              prod_id: this.props.pic.new_prod_id,
              categoryTitle: this.props.pic.name,
              uniqueCode:this.props.pic.uniqueCode,
              isFromFeed:true
            }
          });
          
        }}
      >
        <View
          ref='productView'
          style={{
            top: this.state.top,
            left: this.state.left,
            height: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>

          <View style={{height: (windowHeight > 600) ? 55 : 35,
                        width:(windowHeight > 600)?windowWidth/1.8:windowWidth/2,backgroundColor:COLORS.WHITE,
                        flexDirection:'row',borderRadius: 5, justifyContent:'center'}}>

              <Image style={{marginTop:2,
                              height: (windowHeight>600) ?
                                            windowHeight/16:windowHeight/18,
                              width:(windowHeight>600) ?
                                            windowHeight/16:windowHeight/18,
                              resizeMode:'contain'}}
                     defaultSource={placeholder_icon}
                     source={(this.props.pic.product_thumb) ? { uri: this.props.pic.product_thumb} : placeholder_icon} />
              <View style={{height:"100%",width:'55%'}}>
                   <Text style={styles.productName} numberOfLines={1}>{this.props.pic.name}</Text>
                   {(this.props.pic.discount_percentage != null) ?
            
            <View style={{flexDirection:'row'}}>
            <Text style={styles.priceView}> ${(this.props.pic.price) ? (this.props.pic.price).toFixed(2) : 0}</Text>
            <Text style={styles.finalPriceView}> ${this.props.pic.final_price}</Text>
            </View>

            :
            (this.props.pic.final_price) ? 
              
              <Text style={styles.finalPriceView}> ${this.props.pic.final_price}</Text>
              :
              <Text style={styles.finalPriceView}> ${this.props.pic.price}</Text>
            
            }
              </View>       
              <Image style={{height:'100%',width:'15%',alignSelf:'center',resizeMode:'center'}} source={require('img/next_icon.png')} />  
            </View>
        </View>
      </TouchableWithoutFeedback>
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

  componentDidMount() {
    setTimeout(() => {
      this.refs.hashView.measure((a, b, width, height, px, py) => {
        this.setState({
          width: width + 10,
          left: this.props.pic.x - width / 3.5 - 5,
          top: this.props.pic.y - h(25)
        });
      });
    });
  }
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.store.selectTag(this.props.pic);
        }}
      >
        <View
          ref='hashView'
          style={{
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
      </TouchableWithoutFeedback>
    );
  }
}

const PostTags = observer(({ store, navigator }) => {

  let count = 0;

  if (!store.showTags) {
    return null;
  }
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >

      {store.selectedPicture.tags.map((pic) => {


        for (key in pic) {
          showLog("POST TAG ==>" + key + " value ==> " + JSON.stringify(pic[key]))
        }


        if (pic.x < 0) {
          if (!pic.key) {
            pic.key = count++;
          }
          return <View key={pic.key} />;
        }

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

        if (pic.type == 'producttag') {

          return (
            <ProductTag store={store}
              key={pic.key} pic={pic}
              navigator = {navigator}
            />
          );
        }

        if (pic.type == 'hashtag') {
          return (
            <HashTag store={store} key={pic.key} pic={pic} />
          );
        }


        if (pic.imageSource) {
          return (
            <TouchableWithoutFeedback
              onPress={() => {
                store.navigator = navigator;
                store.selectTag(pic);
              }}
              key={pic.key}>
              <Image
                style={style}
                source={pic.imageSource}
              />
            </TouchableWithoutFeedback>
          );
        }

        return (
          <TouchableWithoutFeedback
            key={pic.key}
            onPress={() => {
              store.navigator = navigator;
              store.selectTag(pic);
            }}
          >
            <View
              key={pic.key}
              style={style}>
              <Text style={{ fontSize: 15, backgroundColor: 'transparent', color: 'white' }}>{pic.abbrev}</Text>
            </View>
          </TouchableWithoutFeedback>
        );

      })}
    </View>
  );
});

const styles = StyleSheet.create({

  tagImageParentView: {
    marginBottom: 2,
    height:(windowHeight > 600) ? windowWidth / 8 : windowWidth / 10,
    width: (windowHeight > 600) ? windowWidth / 8 : windowWidth / 10,
  },
  tagImageView: {
    height: "100%",
    width: "100%",
    alignSelf: 'center',
  },
  textParentView: {
    height: (windowHeight > 600) ? windowWidth / 12 : windowWidth / 14,
    width: "40%",

  },
  imageGoParentView: {
    marginLeft: 0,
    marginBottom: 4,
    height:(windowHeight > 600) ? windowWidth / 8 : windowWidth / 10,
    width: "15%",
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE
  },
  imageGoView: {
    height:(windowHeight > 600) ? windowWidth / 8 : windowWidth / 10,
    width: "15%",
    resizeMode: 'center',
    alignSelf: 'center',
    backgroundColor:COLORS.WHITE
  },
  productName: {
    fontSize: (windowHeight > 700) ? 16 : 14,
    color: COLORS.BLACK,
    fontFamily: FONTS.MEDIUM
  },
  priceView: {
    fontSize: (windowHeight>700)?15:10,
    color: COLORS.GRAY2,
    fontFamily: FONTS.BLACK,
    textDecorationLine: 'line-through'
  },
  finalPriceView: {
    fontSize: (windowHeight>700)?15:10,
    color: COLORS.BLUE,
    fontFamily: FONTS.BLACK
  }

});


export default PostTags;
