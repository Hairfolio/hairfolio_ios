import ModalPicker from 'Hairfolio/react-native-modal-picker';
import { ActivityIndicator, FONTS, h, Image, observer, React, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'Hairfolio/src/helpers';
import NavigatorStyles from '../common/NavigatorStyles';
import AddBlackBookStore from '../mobx/stores/AddBlackBookStore';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import ShareStore from '../mobx/stores/ShareStore';
import MultilineTextInput from '../components/Form/MultilineTextInput';
import { COLORS, Share, windowWidth, windowHeight } from '../helpers';
import { SCALE } from '../style';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

let styles = {
 
  headerStyleLeftN: {
    fontSize: h(30),
    color: COLORS.BLACK,
    left: h(26),
    fontFamily: FONTS.MEDIUM,
    alignSelf:'center',
    flex: 1,
  },
  headerStyleLeft: {
    fontSize: h(30),
    color: COLORS.BLACK,
    left: h(26),
    fontFamily: FONTS.MEDIUM,
    alignSelf:'center',
    flex: 1,
    
  },
  headerStyleRight: {
    fontSize: h(30),
    color: COLORS.GRAY3,
    left: h(21),
    marginBottom: h(15),
    marginTop: h(44),
    fontFamily: FONTS.ROMAN,
    marginRight: h(40),
  },
  headerStyleAddRight: {
    fontSize: h(30),
    color: COLORS.RED,
    left: h(21),
    fontFamily: FONTS.MEDIUM,
    marginRight: h(40),
    alignSelf:'center',
  },
  headerDisabledStyleAddRight: {
    fontSize: h(30),
    color: COLORS.GRAY2,
    left: h(21),
    fontFamily: FONTS.MEDIUM,
    marginRight: h(40),
    alignSelf:'center',
  }
};

const Hairfolio  = observer(({store}) => {
  if (store.isInEdit) {
    return (
      <TextInput
        ref={input => ShareStore.input = input}
        value={store.name}
        onChangeText={t => store.name = t}
        onEndEditing={() => {
          ShareStore.saveHairfolio(store)}}
        style = {{
          backgroundColor: COLORS.WHITE,
          height: h(86),
          marginBottom: 3,
          
          alignItems: 'center',
          paddingLeft: h(21),
          fontSize: h(30),
          
        }}
      />
    );
  }
  let checkImage;
  if (store.isSelected) {
    checkImage = (
      <Image
        style={{height: h(34), width: h(48), marginRight: h(30)}}
        source={require('img/share_check.png')}
      />
    );
  }
  return (
    <TouchableWithoutFeedback
      onPress={
        () => { store.isSelected = !store.isSelected}
      }
    >
      <View
        style = {{
          flexDirection: 'row',
          backgroundColor: COLORS.WHITE,
          height: h(86),
          marginBottom: 10,
          alignItems: 'center'
        }}
      >
        <Text
          style = {{
            marginLeft: h(21),
            fontSize: h(30),
            fontFamily: FONTS.ROMAN,
            flex: 1
          }}
        >
          {store.name == 'Inspiration' ? 'Inspo' : store.name}
        </Text>
        {checkImage}
      </View>
    </TouchableWithoutFeedback>
  );
});

const Hairfolios = observer(() => {

  let store = ShareStore.hairfolioStore;

  if (store.isLoading) {
    return <View>
      <ActivityIndicator size='large' />
    </View>
  }
  return (
    <View>
      {
        store.hairfolios.map(
          el => <Hairfolio key={el.key} store={el} />
        )
      }
    </View>

  );
});

const ShareExternally = observer(() => {
  return (
    <View>
       <Text style={styles.headerStyleLeft}
             onPress={()=>{
              // ShareStore.toDataURL(CreatePostStore.gallery.selectedPicture.source.uri,
              // function(dataUrl) {

              // })
              ShareStore.shareLink(CreatePostStore.gallery.selectedPicture.source.uri)
             }}
       >Share Externally</Text>
    </View>

  );
})

const ShareHairfolio = observer(() => {
  return (
    <View>
      <View
        style = {{
          backgroundColor: COLORS.WHITEBG,
          flexDirection: 'row',
          // paddingTop:10,
          paddingBottom:10,
          
        }}
      >
      
        <Text style = {styles.headerStyleLeftN}>
          Add to Hairfolio
        </Text>
        <TouchableOpacity
          disabled = {(ShareStore.hairfolioStore.isLoading) ? true : false}
          
          onPress={
            () => ShareStore.newHairfolio()
          }
        >
          <Text 
          style = {(ShareStore.hairfolioStore.isLoading) ? 
                              styles.headerDisabledStyleAddRight : styles.headerStyleAddRight}>
            + CREATE NEW
          </Text>
        </TouchableOpacity>
      </View>
      <Hairfolios />
    </View>

  );
});

const ShareBlackBook = observer(({navigator}) => {
  return (
    <View>
      <View
        style = {{
          backgroundColor: COLORS.WHITE5,
          flexDirection: 'row',
          paddingTop:10,
          paddingBottom:10
        }}
      >
        <Text style = {styles.headerStyleLeft}>
          Add to ClientBook
        </Text>
      </View>
      <TouchableOpacity
        onPress={
          () => {
            AddBlackBookStore.select(ShareStore.contacts);
            navigator.push({
              screen: 'hairfolio.AddBlackBook',
              navigatorStyle: NavigatorStyles.tab,
            })
          }
        }
        style = {{
          height: h(86),
          flexDirection: 'row',
          paddingLeft: h(21),
          backgroundColor: COLORS.DARK3,
          alignItems: 'center'
        }}
      >
        <Image
          style={{height: h(49), width: h(37)}}
          source={require('img/black_book_white.png')}
        />
        <Text
          style = {{
            fontSize: h(30),
            color: COLORS.WHITE,
            marginLeft: h(30),
            fontFamily: FONTS.MEDIUM,
            flex: 1
          }}
        >
          {ShareStore.blackBookHeader}
        </Text>
        <Image
          // style={{marginRight: h(30), height: 1.3 * h(13), width: 1.3 * h(27)}}
          style={{marginRight: h(30), height: 10, width: 10}}
          source={require('img/white_arrow.png')}
        />
      </TouchableOpacity>
    </View>
  );
});

const ShareSummary = observer(() => {
  let img = <View />;
  if (CreatePostStore.gallery.selectedPicture) {
    img = (
      <Image
        style={{
          // height: h(120),
          // width: h(120),
          height: windowWidth/1.5,
          width: windowWidth,
          // margin: h(14),
          marginTop:h(10)

        }}
        defaultSource={require('img/medium_placeholder_icon.png')}
        source={CreatePostStore.gallery.selectedPicture.source}
      />
    )
  }

  return (
    <View
      style={{
        marginVertical: h(20),
        // height: h(150),
        flex:1,
        backgroundColor: COLORS.WHITE,
        // flexDirection: 'row'
      }}
    >
      <View>
        {img}
      </View>
      <View
        style={{
          // flex: 1
          marginTop:10,
        }}
      >
       <MultilineTextInput
        autoCapitalize="none"
        autoCorrect={false}
        // max={300}
        placeholder="Add post description"
        value={CreatePostStore.gallery.description}
        // validation={(v) => !v || validator.isLength(v, { max: 300 })}
        onChangeText={(value) => {
        
          CreatePostStore.gallery.description = value
        }}
      />
     
      
     <Text
          style={{
            fontFamily: 'Avenir-Medium',
            color: COLORS.DARK3,
            marginBottom:2,
            paddingLeft: SCALE.w(26),
            paddingRight: SCALE.w(26),
          }}
        >
          {/* Nimisha */}
          {CreatePostStore.hashTagsText}
        </Text>
       {/* <TextInput
        // key='description'
        // onFocus={(element) => this.scrollToElement(element.target)}
        // onEndEditing={() => this.refs.scrollView.scrollTo({ y: 0 })}
        style={{
          // height: 40,
          backgroundColor: 'white',
          paddingLeft: h(30),
          fontSize: h(28),
          color: COLORS.DARK,
        }}
        numberOfLines={3}
        // multiline={true}
        placeholder='Add post description'
        value={CreatePostStore.gallery.description}
        onChangeText={(text) => CreatePostStore.gallery.description = text}
      /> */}
        {/* {CreatePostStore.gallery.description} */}

        {/* <Text
          style={{
            fontFamily: 'Avenir-Medium',
            color: COLORS.DARK3
          }}
        >
          {CreatePostStore.hashTagsText}
        </Text> */}

      {/* </TextInput> */}
      </View>
    </View>
  );
});

const ShareButton = observer(({color, hide, store, isLeft = true, imageSource, text}) => {
  if (hide) { return <View style={{flex: 1 }} />}
  return (
    <TouchableWithoutFeedback
      onPress={() => store.enableDisable()}
    >
      <View
        style={{
          opacity: store.opacity,
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: color,
            flex: 1,
            // marginRight: isLeft ? 1 : 0,
            marginRight:  0,
            marginBottom: 0,
            height: h(100),
            flexDirection: 'row'
          }}
        >
        <View
          style={{
            width: h(100),
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image
            source={imageSource}
          />
        </View>
        <View
          style={{
            justifyContent: 'center'
          }}
        >
          <Text
            style={{
              fontSize: h(34),
              color: COLORS.WHITE,
              fontFamily: 'Avenir-Medium'
            }}
          >
            {text}
          </Text>
        </View>
      </View>
    </View>
  </TouchableWithoutFeedback>
  );
});

const ShareNetworks = observer(() => {
  return (
    <View>
      <View
        style = {{
          backgroundColor: COLORS.WHITE5,
          flexDirection: 'row',
          paddingBottom:10,
          paddingTop:10
        }}
      >
        <Text style = {styles.headerStyleLeft}>
          Share on
        </Text>
      </View>
      <View
        style={{
          // flexDirection: 'row'
        }}
      >
        <ShareButton
          store={ShareStore.shareTwitterStore}
          text='Twitter'
          color={COLORS.LIGHT_BLUE}
          imageSource={require('img/share_twitter.png')} />

        <ShareButton
          text='Facebook'
          store={ShareStore.shareFacebookStore}
          isLeft={false}
          color={COLORS.BLUE1}
          imageSource={require('img/share_facebook.png')} />

        <ShareButton
          text='Instagram'
          store={ShareStore.shareInstagramStore}
          isLeft={false}
          color={COLORS.PINKNEW}
          imageSource={require('img/instagram.png')} />
      {/* </View>
      <View
        style={{
          flexDirection: 'row'
        }}
      > */}
       
        {/* <ShareButton
          text='Pinterest'
          store={ShareStore.sharePinterestStore}
          color={COLORS.RED1}
          hide
          imageSource={require('img/share_pinterest.png')} /> */}
      </View>
    </View>
  );
});

const BoardPicker = observer(() => {
  if (ShareStore.showBoard) {
    return (
      <ModalPicker
        ref = {res => ShareStore.pinterestSelector = res}
        data={ShareStore.boardData}
        initValue="SelectsharePinterestStore something yummy!"
        onChange={(option)=>{
          ShareStore.sharePinterestStore.setBoardName(option.label);
        }}
      >
        <View />
      </ModalPicker>
    );
  } else {
    return <View />;
  }
});

const ShareFollowers = observer(({navigator}) => {
  return (
    <KeyboardAwareScrollView
      style = {{
        backgroundColor: COLORS.WHITE5,
        
      }}
      extraHeight={200}
      scrollEnabled
      resetScrollToCoords={{ x: 0, y: 0 }}
    >
      <View style={{flex: 1}}>
        <BoardPicker />
        <ShareSummary />
        {/* <ShareExternally /> */}
        
        <ShareHairfolio />
        <ShareBlackBook navigator={navigator} />
        <ShareNetworks />
      </View>
    </KeyboardAwareScrollView>
  );
});

export default ShareFollowers;
