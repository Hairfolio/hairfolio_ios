import { FONTS, h } from 'Hairfolio/src/style';
import { observer } from 'mobx-react';
import React from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import NavigatorStyles from '../common/NavigatorStyles';
import BlackHeader from '../components/BlackHeader';
import PureComponent from '../components/PureComponent';
import ContactDetailsStore from '../mobx/stores/ContactDetailsStore';
import PostDetailStore from '../mobx/stores/PostDetailStore';
import { COLORS, windowWidth, windowHeight } from '../helpers';
import ImageCropPicker from 'react-native-image-crop-picker';

const ContactsDetailsHeader = observer(({store, navigator,fromScreen}) => {

  let renderLeft = null;

  if (store.mode != 'view') {
    renderLeft = () =>
      <View
        style = {{
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            flex: 1,
            fontFamily: FONTS.Regular,
            fontSize: h(34),
            color: 'white',
            alignSelf: 'center'
          }}
        >
          Cancel
        </Text>
      </View>;
  }


  return (
    <BlackHeader
      onLeft={() => {
        ContactDetailsStore.isScreenPop = false;
        if (fromScreen == "ClientDetails") {
          navigator.pop({ animated: true })
        }
        else {
          navigator.pop({ animated: true })
          ContactDetailsStore.reset()
        }
        
      }}
      title= { <View style={{width:150,height:25,marginTop:5}}><Text numberOfLines={1}  style={{flex: 1,
        fontFamily: FONTS.Regular,
        fontSize: h(34),
        color: COLORS.WHITE,
        alignSelf: 'center'
      }}>{store.title}</Text></View>}
      onRenderLeft={renderLeft} 
      onRenderRight={() =>
        <TouchableOpacity
          style = {{
            flexDirection: 'row',
            alignItems: 'center'
          }}
          onPress={() => store.rightHeaderClick(navigator)}
        >
          <Text
            style={{
              flex: 1,
              fontFamily: FONTS.Regular,
              fontSize: h(34),
              color: COLORS.WHITE,
              textAlign: 'right',
              paddingRight: 10,
            }}
          >
            {store.rightHeaderText}
          </Text>
        </TouchableOpacity>
      }
    />
  );
});

const Input = observer(({placeholder, keyboardType = 'default', autoCapitalize = 'words', value}) => {
  let store = ContactDetailsStore;
  return (
    <View>
      <TextInput
        // maxLength={15}
        value={store[value]}
        onChangeText={t => store[value] = t}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        placeholder={placeholder}
        onFocus={(element) => ContactDetailsStore.scrollToElement(element.target)}
        style={{height: h(66), fontSize: h(34)}} />
      <View style={{height: 1, backgroundColor: COLORS.LIGHT2, marginBottom: h(22)}} />
    </View>
  );
});

const InfoText = observer(({value, style = {}}) => {
  let store = ContactDetailsStore;
  return (
    <Text
      style = {{
        fontSize: h(34),
        color: COLORS.BLACK,
        fontFamily: FONTS.BOOK,
        ...style
      }}
      numberOfLines={1}
    >
      {value}
    </Text>
  );
});

const GeneralInfo = observer(({store}) => {


  let profileImage = (
    <View style={{height: h(120), width: h(120), alignItems: 'center', justifyContent: 'center', paddingLeft: h(10), paddingTop: h(5), backgroundColor: COLORS.WHITE, borderRadius: h(60)}}>
      <ActivityIndicator color={COLORS.LIGHT2} size='large' />
    </View>
  );

  if (!store.isUploadingPicture) {
    profileImage = (
      <TouchableOpacity
        onPress={
          () => {
            ImagePicker.showImagePicker({
              noData: true
            }, (response) => {
              if (response.error) {
                alert(response.error);
              }
              if (response.uri) {
                ImageCropPicker.openCropper({
                  path: response.uri,
                  // width: windowWidth,
                  // height: windowWidth + 100,
                  // width: windowWidth*2,
                  // height: (windowWidth + 100)*2,
                  width: windowWidth + (windowWidth/2),
                  height: windowHeight,
                  compressImageQuality:1
                }).then(response => {
                  if (response.error) {
                    alert(response.error);
                  }
                  if (response.path) {
                    response.uri = response.path;
                    ContactDetailsStore.sendPicture(response);
                  }

                });
              }
            });

            



          }
        }
      >
        <Image
          style={{height: h(120), width: h(120), borderRadius: h(60)}}
          source={store.profileImage}
        />
      </TouchableOpacity>
    );
  }

  let rightChild;

  if (store.mode != 'view') {
    rightChild = (
      <View style={{flex: 1}}>
        <Input value='firstName' placeholder='First Name' />
        <Input value='lastName' placeholder='Last Name' />
        <Input value='companyName' placeholder='Company Name' />
      </View>
    );
  } else {
    rightChild = (
      <View style={{flex: 1, marginTop: h(20)}}>
        <InfoText style={{fontFamily: FONTS.MEDIUM}} value={store.firstName + ' ' + store.lastName} />
        <InfoText style={{fontSize: h(30)}} value={store.companyName} />
      </View>
    );


    profileImage = (
      <Image
        style={{height: h(120), width: h(120), borderRadius: h(60), marginBottom: h(20)}}
        source={store.profileImage}
      />
    );
  }

  return (
    <View
      style = {{
        flexDirection: 'row',
        marginTop: h(30)
      }}
    >
      <View
        style = {{
          width: h(200),
          paddingLeft: h(30)
        }}
      >
        {profileImage}
      </View>
      {rightChild}
          </View>
  );
});


const ContactInfoRow = observer(({title, children, onMessage, onPhone}) => {

  let messageElement, phoneElement;

  if (onMessage) {
    messageElement = (
      <TouchableOpacity onPress={onMessage}>
        <Image
          style={{height: h(38), width: h(42), marginRight: h(30)}}
          source={require('img/contact_message.png')}
        />
      </TouchableOpacity>
    )
  }

  if (onPhone) {
    phoneElement = (
      <TouchableOpacity onPress={onPhone}>
        <Image
          style={{height: h(44), width: h(44), marginRight: h(30)}}
          source={require('img/contact_phone.png')}
        />
      </TouchableOpacity>
    )
  }


  return (
    <View>
      <View
        style = {{
          flexDirection: 'row',
          paddingLeft: h(30),
          marginTop: h(10)
        }}
      >
        <View
          style = {{
            flex: 1
          }}
        >
          <Text
            style = {{
              fontSize: h(30),
              fontFamily: FONTS.BOOK,
              color: COLORS.STYLIST,
              marginBottom: h(5)
            }}
          >{title}</Text>
          {children}
        </View>
        <View
          style = {{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {messageElement}
          {phoneElement}
      </View>
      </View>
      <View
        style = {{
          height: h(1),
          backgroundColor: COLORS.LIGHT3,
          marginTop: h(12)
        }}
      />
    </View>

  );
});

const PhoneInfo = observer(({store}) => {

  if (store.mode == 'view') {
    let elements = [];
    if (store.hasMobilePhoneNumber) {
      elements.push(
        <ContactInfoRow
          key='mobile-phone'
          title='mobile phone'
          onPhone={
            () => {
              store.call(store.phoneMobile)
            }
          }
          onMessage={
            () => {
              store.message(store.phoneMobile)
            }
          }
        >
          <InfoText value={store.phoneMobile} />
        </ContactInfoRow>
      );
    }
    if (store.hasHomePhoneNumber) {
      elements.push(
        <ContactInfoRow
          key='home-phone'
          title='home phone'
          onPhone={
            () => {
              store.call(store.phoneHome)
            }
          }
          onMessage={
            () => {
              store.message(store.phoneHome)
            }
          }
        >
          <InfoText value={store.phoneHome} />
        </ContactInfoRow>
      );
    }
    if (store.hasWorkPhoneNumber) {
      elements.push(
        <ContactInfoRow
          key='work-phone'
          title='work phone'
          onPhone={
            () => {
              store.call(store.phoneWork)
            }
          }
          onMessage={
            () => {
              store.message(store.phoneWork)
            }
          }
        >
          <InfoText value={store.phoneWork} />
        </ContactInfoRow>
      );
    }
    return (
      <View>
        {elements}
      </View>
    );
  }
  return (
    <View style = {{marginLeft: h(30), marginTop: h(10)}}>
      <Text
        style = {{
          fontSize: h(38),
          fontFamily: FONTS.MEDIUM,
          marginBottom: h(10)
        }}
      >
        Phone
      </Text>
      <Input value='phoneMobile' keyboardType="phone-pad" max={15} placeholder='Mobile' />
      <Input value='phoneHome' keyboardType="phone-pad" max={15} placeholder='Home' />
      <Input value='phoneWork' keyboardType="phone-pad" max={15} placeholder='Work' />
    </View>
  );
});


const EmailInfo = observer(({store}) => {

  if (store.mode == 'view') {

    let elements = [];

    if (store.hasPrimaryEmail) {
      elements.push(
        <ContactInfoRow
          key='primary-email'
          title='primary email'
          onMessage={
            () => {
              store.sendEmail(store.emailPrimary)
            }
          }
        >
          <InfoText value={store.emailPrimary} />
        </ContactInfoRow>
      );
    }

    if (store.hasSecondaryEmail) {
      elements.push(
        <ContactInfoRow
          key='secondary-email'
          title='secondary email'
          onMessage={
            () => {
              store.sendEmail(store.emailSecondary)
            }
          }
        >
          <InfoText value={store.emailSecondary} />
        </ContactInfoRow>
      );
    }

    return (
      <View>
        {elements}
      </View>
    );
  }

  return (
    <View style = {{marginLeft: h(30), marginTop: h(10)}}>
      <Text
        style = {{
          fontSize: h(38),
          fontFamily: FONTS.MEDIUM,
          marginBottom: h(10)
        }}
      >
        Email
      </Text>
      <Input value='emailPrimary' autoCapitalize='none' keyboardType='email-address' placeholder='Primary' />
      <Input value='emailSecondary' autoCapitalize='none' keyboardType='email-address' placeholder='Secondary' />
    </View>
  );
});

const AddressInfo = observer(({store}) => {

  if (store.mode == 'view') {
    let elements = [];

    if (!store.hasAddress) {
      return null;
    }

    return (
      <ContactInfoRow
        title='address'
      >
        <InfoText value={store.addressStreet1} />
        <InfoText value={store.addressCity} />
        <InfoText value={store.addressState + ' ' + store.addressPostCode} />
        {/* <InfoText value={store.addressCountry} /> */}
      </ContactInfoRow>
    );
  }
  return (
    <View style = {{marginLeft: h(30), marginTop: h(10)}}>
      <Text
        style = {{
          fontSize: h(38),
          fontFamily: FONTS.MEDIUM,
          marginBottom: h(10)
        }}
      >
       Address
      </Text>
      <Input value='addressStreet1' placeholder='Street' />
      <Input value='addressCity' placeholder='City' />
      <Input value='addressState' placeholder='State' />
      <Input value='addressPostCode' keyboardType='numeric' placeholder='Postal Code' />
      {/* <Input value='addressCountry' placeholder='Country' /> */}
    </View>
  );
});

const NoteItem = observer(({store, navigator}) => {
  return (
    <TouchableOpacity
      onPress={
        () => {
          PostDetailStore.jump(
            false,
            store,
            navigator,
          )
        }
      }
    >
      <Image
        style={{height: h(120), width: h(120), marginRight: h(20)}}
        source={store.pictures[0].getSource(120, 120)}
      />
    </TouchableOpacity>
  );
});

const NotesInfo = observer(({store, navigator}) => {

  if (store.mode == 'view') {
    let elements = [];

    if (!store.hasNotes) {
      return <View />;
    }
    return (
      <ContactInfoRow title='Notes' >
        <View
          style={{
            height: h(140),
            marginRight: h(20),
            marginTop: h(20)
          }}
        >
          <FlatList
            horizontal
            data={store.notes}
            renderItem={({item, index}) => <NoteItem key={Math.random()} store={item} navigator={navigator} />}
          />
        </View>
      </ContactInfoRow>
    );
  }

  return <View />;
});

const ContactDetailsContent = observer(({navigator, store}) => {

  if (store.isLoading) {
    return (
      <View style={{marginTop: 20}}>
        <ActivityIndicator size='large' />
      </View>
    );
  } else {
    return(
        <ScrollView
          keyboardShouldPersistTaps="always"
          ref={e => store.scrollView = e}
        >
          <GeneralInfo store={store} />
          <PhoneInfo store={store} />
          <EmailInfo store={store} />
          <AddressInfo store={store} />
          <NotesInfo store={store} navigator={navigator}/>
        </ScrollView>
    );
  }
});

@observer
export default class ContactDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    
    switch(event.id) {      
      case 'bottomTabSelected':
        // this.props.navigator.resetTo({
        //   screen: 'hairfolio.Profile',
        //   animationType: 'fade',
        //   navigatorStyle: NavigatorStyles.tab
        // });     
        break;
      case 'willAppear':          
        if (this.props.fromScreen == "ClientDetails") {
          ContactDetailsStore.rightHeaderClick();
        }
        if (this.props.fromScreen == "BlackBook" || this.props.fromScreen == "ClientDetails") {
          // ContactDetailsStore.isScreenPop = true;
        }
        break;
      case 'willDisappear':
        if (ContactDetailsStore.isScreenPop) {    
          this.props.navigator.popToRoot({ animated: true });
        }
          // this.props.navigator.switchToTab({
          //   tabIndex: 4,
          // });
              
        break;
      default:
        break;
    }
  }

  render() {
    
    let store = ContactDetailsStore;
    if (store.isLoading) {
      return (
        <View style={{marginTop: 20}}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    return (
      <View style={{flex: 1}}>
        <ContactsDetailsHeader store={store} navigator={this.props.navigator} fromScreen={this.props.fromScreen}/>
        <ScrollView
          keyboardShouldPersistTaps="always"
          ref={e => store.scrollView = e}
        >
          <ContactDetailsContent navigator={this.props.navigator} store={store}/>
        </ScrollView>
        <KeyboardSpacer topSpacing = {-80}/>
      </View>
    );
  }
};
