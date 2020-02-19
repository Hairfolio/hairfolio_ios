import { FONTS, h } from 'Hairfolio/src/style';
import { observer } from 'mobx-react';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import BlackHeader from '../components/BlackHeader';
import LoadingPage from '../components/LoadingPage';
import PureComponent from '../components/PureComponent';
import { SelectPeople } from '../components/SelectPeople';
import AddBlackBookStore from '../mobx/stores/AddBlackBookStore';
import ShareStore from '../mobx/stores/ShareStore';
import { COLORS } from '../helpers';

@observer
export default class AddBlackBook extends PureComponent {

  render() {
    let store = AddBlackBookStore;
    let Content = LoadingPage(
      SelectPeople,
      store
    );


    return (
      <View style={{flex: 1}}>
        <BlackHeader
          onRenderLeft= {() => (
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
                  color: COLORS.WHITE,
                  alignSelf: 'center'
                }}
              >
                Cancel
              </Text>
            </View>
          )}

          onLeft={
            () => {
              this.props.navigator.pop({ animated: true });
            }
          }

          title='Black Book'
          onRenderRight={() =>
            <TouchableOpacity
              disabled={(AddBlackBookStore.items && AddBlackBookStore.items.length > 0 ) ? false : true }  
              onPress={
                () => {
                  ShareStore.contacts = AddBlackBookStore.selectedItems.map(e => e);
                  this.props.navigator.pop({ animated: true });
                }
              }
            >
              <Text
                style = {(AddBlackBookStore.items && AddBlackBookStore.items.length > 0) ? {
                  fontSize: h(34),
                  color: COLORS.WHITE,
                  fontFamily: FONTS.MEDIUM,
                  textAlign: 'right',
                  paddingRight: 15,
                } :
                {
                  fontSize: h(34),
                  color: COLORS.WHITE,
                  fontFamily: FONTS.MEDIUM,
                  textAlign: 'right',
                  paddingRight: 15,
                  opacity: 0.5
                }}
              >
                Add
              </Text>
            </TouchableOpacity>
          }
        />
        {/* <ToInput store={store} /> */}
        <Content />
      </View>
    );
  }
};
