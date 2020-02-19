import { h } from 'Hairfolio/src/style';
import { observer } from 'mobx-react';
import React from 'react';
import { Image, StatusBar, TouchableOpacity, View } from 'react-native';
import NavigatorStyles from '../common/NavigatorStyles';
import BlackBookContent from '../components/blackbook/BlackBookContent';
import BlackHeader from '../components/BlackHeader';
import LoadingPage from '../components/LoadingPage';
import PureComponent from '../components/PureComponent';
import BlackBookStore from '../mobx/stores/BlackBookStore';
import ContactDetailsStore from '../mobx/stores/ContactDetailsStore';
import { COLORS } from '../helpers';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

@observer
export default class BlackBook extends PureComponent {
  constructor(props) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    console.log('nimisha event==>'+event.id)
    switch(event.id) {
      case 'willAppear':
        ContactDetailsStore.isScreenPop = true;
        StatusBar.setBarStyle('light-content');
        BlackBookStore.reset();
        break;
      case 'bottomTabSelected':
        // alert('bottomTabSelected')
        // this.props.navigator.resetTo({
        //   screen: 'hairfolio.Profile',
        //   animationType: 'fade',
        //   navigatorStyle: NavigatorStyles.tab
        // });     
        break;
      case 'willDisappear':
        // alert('willDisappear=> ' + ContactDetailsStore.isScreenPop)
        // if (ContactDetailsStore.isScreenPop) {
        //   this.props.navigator.pop({ animated: true })
        // }
          
        break;
      default:
        break;
    }
  }

  LoadingPage(props) {
    return(
      <KeyboardAwareScrollView>
        <BlackBookContent
          store={BlackBookStore} {...props} />
      </KeyboardAwareScrollView>
    )
  }

  render() {
    let store = BlackBookStore;
    if (!store.show) {
      return false;
    }
    let Content = this.LoadingPage(
      { navigator: this.props.navigator }
    );
    return (
      <View style={{flex: 1}}>
        <BlackHeader
          onLeft={() => { this.props.navigator.pop({ animated: true }) }}
          // title='My Black Book'
          title='My Client Book'
          onRenderLeft = {() => (
            <View
              style = {{
                height: h(60),
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Image
                style={{height: h(18), width: h(30)}}
                source={require('img/white_x.png')}
              />
            </View>
          )}
          // onRenderRight={() =>
          //   <TouchableOpacity
          //     onPress={
          //       () => {
          //         ContactDetailsStore.reset();
          //         this.props.navigator.push({
          //           screen: 'hairfolio.ContactDetails',
          //           navigatorStyle: NavigatorStyles.tab,
          //         });
          //       }
          //     }
          //   >
          //     <Image
          //       style = {{
          //         width: h(28),
          //         height: h(28),
          //         alignSelf: 'flex-end',
          //         marginRight: 10
          //       }}
          //       source={require('img/message_plus.png')}
          //     />
          //   </TouchableOpacity>
          // }
        />
        <TouchableOpacity onPress={() => {
          ContactDetailsStore.reset();
          this.props.navigator.push({
            screen: 'hairfolio.ContactDetails',
            navigatorStyle: NavigatorStyles.tab,
          });
        }} style={{ position: 'absolute', bottom: 15, right: 15,backgroundColor:COLORS.WHITE,borderRadius:20,alignItems:'center',justifyContent:'center',zIndex:1 }}>
          <Image source={require('img/add.png')} style={{width:40,height:40,}}/>
        </TouchableOpacity>
        {/* <Content /> */}
        { this.LoadingPage({ navigator: this.props.navigator }) }
      </View>
    );
  }
};
