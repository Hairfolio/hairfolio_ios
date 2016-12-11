import React from 'react';
import PureComponent from '../components/PureComponent';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {post} from '../selectors/post';
import {postActions} from '../actions/post';
import {COLORS, FONTS, h, SCALE} from 'hairfolio/src/style';
import NavigationSetting from '../navigation/NavigationSetting';
import {observer} from 'mobx-react/native';
import autobind from 'autobind-decorator'
import _ from 'lodash';
import ImagePicker from 'react-native-image-picker'

import FollowButton from 'components/FollowButton.js'


import {appStack, gallery, postFilter, albumPage} from '../routes';

import * as routes from 'hairfolio/src/routes.js'

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import LoadingScreen from 'components/LoadingScreen.js'
import BlackHeader from 'components/BlackHeader.js'

import BlackBookStore from 'stores/BlackBookStore.js'

import Swipeout from 'hairfolio/react-native-swipeout/index.js';

import ContactDetailsStore from 'stores/ContactDetailsStore.js'

import LoadingPage from 'components/LoadingPage'

import BlackBookContent from 'components/blackbook/BlackBookContent.js'

const ContactsDetailsHeader = observer(({store}) => {

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
      onLeft={() => store.leftHeaderClick()}
      title={store.title}
      onRenderLeft={renderLeft}
      onRenderRight={() =>
        <TouchableOpacity
          style = {{
            flexDirection: 'row',
            alignItems: 'center'
          }}
          onPress={() => store.rightHeaderClick()}
        >
          <Text
            style={{
              flex: 1,
              fontFamily: FONTS.Regular,
              fontSize: h(34),
              color: 'white',
              textAlign: 'right'
            }}
          >
            {store.rightHeaderText}
          </Text>
        </TouchableOpacity>
      }
    />
  );
});

const Input = observer(({placeholder, keyboardType = 'default', value}) => {
  let store = ContactDetailsStore;
  return (
    <View>
      <TextInput
        value={store[value]}
        onChangeText={t => store[value] = t}
        keyboardType={keyboardType}
        placeholder={placeholder}
        onFocus={(element) => ContactDetailsStore.scrollToElement(element.target)}
        style={{height: h(66), fontSize: h(34)}} />
      <View style={{height: 1, backgroundColor: '#D5D5D5', marginBottom: h(22)}} />
    </View>
  );
});

const GeneralInfo = observer(({store}) => {



  let profileImage = (
    <View style={{height: h(120), width: h(120), alignItems: 'center', justifyContent: 'center', paddingLeft: h(10), paddingTop: h(5), backgroundColor: 'white', borderRadius: h(60)}}>
      <ActivityIndicator color='#D5D5D5' size='large' />
    </View>
  );

  if (!store.isUploadingPicture) {
    profileImage = (
      <TouchableOpacity
        onPress={
          () => {
            ImagePicker.showImagePicker({
              noData: true,
              allowsEditing: true
            }, (response) => {
              if (response.error) {
                alert(response.error);
              }
              if (response.uri) {
                ContactDetailsStore.sendPicture(response);
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

  /*
      */

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
      <View style={{flex: 1}}>
        <Input value='firstName' placeholder='First Name' />
        <Input value='lastName' placeholder='Last Name' />
        <Input value='companyName' placeholder='Company Name' />
      </View>
    </View>
  );
});

const PhoneInfo = observer(() => {
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
      <Input value='phoneMobile' keyboardType='phone-pad' placeholder='mobile' />
      <Input value='phoneHome' keyboardType='phone-pad' placeholder='home' />
      <Input value='phoneWork' keyboardType='phone-pad' placeholder='work' />
    </View>
  );
});


const EmailInfo = observer(() => {
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
      <Input value='emailPrimary' keyboardType='email-address' placeholder='primary' />
      <Input value='emailSecondary' keyboardType='email-address' placeholder='secondary' />
    </View>
  );
});

const AddressInfo = observer(() => {
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
      <Input value='addressStreet1' placeholder='Street Line 1' />
      <Input value='addressStreet2' placeholder='Street Line 2' />
      <Input value='addressPostCode' keyboardType='numeric' placeholder='Postal Code' />
      <Input value='addressPostCode' placeholder='City' />
      <Input  value='addressCountry' placeholder='Country' />
    </View>
  );
});


const ContactDetailsContent = observer(() => {

  let store = ContactDetailsStore;

  return (
    <View style={{flex: 1}}>
      <ContactsDetailsHeader store={store} />
      <ScrollView
        ref={e => store.scrollView = e}
      >
        <GeneralInfo store={store} />
        <PhoneInfo store={store} />
        <EmailInfo store={store} />
        <AddressInfo store={store} />
      </ScrollView>
      <KeyboardSpacer />
    </View>
  );
});


@connect(app)
@observer
export default class ContactDetails extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };


  render() {


    return (<NavigationSetting
      style={{
        flex: 1,
      }}
      onWillFocus={() => {
        StatusBar.setBarStyle('light-content');
      }}
    >
      <View style={{flex: 1}}>
        <ContactDetailsContent />
      </View>
    </NavigationSetting>
    );
  }
};
