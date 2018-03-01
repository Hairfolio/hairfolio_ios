import {
  _, // lodash
  observer, // mobx
  h,
  FONTS,
  autobind,
  React, // react
  Component,
  windowWidth,
  windowHeight,
  // react-native components
  AlertIOS,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
  Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'Hairfolio/src/helpers';
import SlimHeader from '../components/SlimHeader';
import AlbumStore from '../mobx/stores/AlbumStore';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MyPicker from '../components/MyPicker';
import AddServiceStore from '../mobx/stores/AddServiceStore';
import ReactNative, { NativeModules } from 'react-native';
var RCTUIManager = NativeModules.UIManager;
import LoadingScreen from '../components/LoadingScreen';
import NavigatorStyles from '../common/NavigatorStyles';

const BoxSelector = observer(({selector}) => {
  let picker;
  if (selector.isHidden) {
    return null;
  }
  if (selector.isOpen) {
    if (selector.isLoaded) {
      picker = (
        <Picker
          selectedValue={selector.value}
          style={{marginTop: h(20), backgroundColor: 'white'}}
          itemStyle={{fontSize: h(32)}}
          onValueChange={val => selector.setValue(val)}>
          {selector.data.map(data =>
            <Picker.Item key={data.id} label={data.name} value={data.name} />
          )}
        </Picker>
      );
    } else {
      picker = (
          <View style={{
            marginTop: h(20),
            height: 200,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ActivityIndicator size="large" />
        </View>
      );
    }
  }
  return (
    <View>
      <TouchableWithoutFeedback
        onPress={
          () => {
            if (selector.isEnabled) {
              if (!selector.isOpen) {
                selector.open();
              } else {
                selector.close()
              }
            }
          }
        }
      >
        <View
          style={{
            height: h(88),
            backgroundColor: 'white',
            marginHorizontal: h(20),
            marginTop: h(20),
            flexDirection: 'row',
          }}>
          <View style={{flex: 1, paddingLeft: h(40), justifyContent: 'center' }}>
            <Text
              style={{
                fontSize: h(28),
                opacity: selector.opacity
              }}
            >{selector.value}</Text>
          </View>
          <View style={{width: h(81), flexDirection: 'row'}}>
            <View style={{width: h(1), height: h(80), backgroundColor: '#C5C5C5'}} />
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={{opacity: selector.opacity}}
                source={selector.arrowImage}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {picker}
    </View>
  );
});

@observer
@autobind
export default class AddServicePageOne extends Component {
  render() {
    let store = AddServiceStore;
    let content = <View />;
    if (!store.isLoading) {
      content = (
        <View>
          <BoxSelector selector={store.serviceSelector} />
          <BoxSelector selector={store.brandSelector} />
          <BoxSelector selector={store.colorNameSelector} />
        </View>
      );
    }

    return (
        <View style={{paddingTop: 20, flex: 1, backgroundColor: 'white'}}>
          <SlimHeader
            titleWidth={140}
            leftText='Back'
            onLeft={() => {
              this.props.navigator.pop({ anmiated: true });
            }}
            title='Add Service (1/3)'
            titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
            rightText={'Next'}
            rightStyle={{opacity: store.nextOpacity}}
            onRight={async () => {
              if (store.canGoNext) {
                if (store.colorNameSelector.hasValue) {
                  store.isLoading = true;
                  let res;
                  try {
                    res = await store.loadColors();
                  } catch(err) {
                    Alert.alert('Error', 'The data could not be loaded. Please check your internet connection');
                    store.isLoading = false;
                    return;
                  }

                  if (res.length > 0) {
                    this.props.navigator.push({
                      screen: 'hairfolio.AddServicePageTwo',
                      navigatorStyle: NavigatorStyles.tab,
                    });
                    setTimeout(() => store.isLoading = false, 500);
                  } else {
                    let storeObj = {
                      service_id: AddServiceStore.serviceSelector.selectedData.id,
                      service_name: AddServiceStore.serviceSelector.selectedData.name,
                      line_id: AddServiceStore.colorNameSelector.selectedData.id,
                      line_name: AddServiceStore.colorNameSelector.selectedData.name,
                      brand_name: AddServiceStore.brandSelector.selectedData.name
                    };

                    AddServiceStore.isLoading = true;
                    AddServiceStore.save(storeObj);
                  }
                } else {
                  // no brand
                  let data = {
                    service_id: AddServiceStore.serviceSelector.selectedData.id
                  }

                  AddServiceStore.save(data);
                }
              } else {
                alert('Please fill out all the fields first');
              }
            }}
          />
          <View style={{flex: 1, backgroundColor: '#F3F3F3'}}>
            {content}
          </View>

          <LoadingScreen store={store} />

        </View>
    );
  }
}
