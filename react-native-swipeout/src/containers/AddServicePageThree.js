import {COLORS, autobind, Component, convertFraction, FONTS, h, observer, React, ScrollView, Text, View, windowHeight, windowWidth } from '../helpers';
import { NativeModules } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Picker from 'react-native-wheel-picker';
import LoadingScreen from '../components/LoadingScreen';
import MyPicker from '../components/MyPicker';
import SlimHeader from '../components/SlimHeader';
import AddServiceStore from '../mobx/stores/AddServiceStore';
const RCTUIManager = NativeModules.UIManager;

const ServiceRow = observer(({selector}) => {
  return (
    <View style={{flexDirection: 'row', paddingLeft: h(30), marginBottom: h(10)}}>
      <View >
        <Text
          style={{
            fontFamily: FONTS.HEAVY,
            fontSize: h(32)
          }}
        >
          {selector.title + ': '}
        </Text>
      </View>
      <View style={{flex: 1}}>
        <Text
          style={{
            fontFamily: FONTS.BOOK,
            fontSize: h(32)
          }}
        >
          {selector.value}
        </Text>
      </View>
    </View>
  );
});

const Summary = observer(({store}) => {
  return (
    <View style={{marginTop: h(32)}}>
      <ServiceRow selector={store.serviceSelector} />
      <ServiceRow selector={store.brandSelector } />
      <ServiceRow selector={store.colorNameSelector } />
    </View>
  );
});

const ColorInfo = observer(({color}) => {
  return (
    <View style={{
      paddingLeft: h(15),
      width: (windowWidth - h(15)) / 2,
      height: h(175),
      marginTop: h(12),
      flexDirection: 'row'
    }}>

    <LinearGradient
      colors={color.gradientColors}
      style={{
        width: (windowWidth - h(15)) / 4 - h(15),
        height: h(175),
        justifyContent: 'center',
        alignItems: 'center',
        ...color.borderStyle
      }}
    >
      <Text
        style={{
          color: color.textColor,
          fontFamily: FONTS.BOOK_OBLIQUE,
          fontSize: h(42),
          backgroundColor: COLORS.TRANSPARENT
        }}
      >
        {color.name}
      </Text>
    </LinearGradient>
    <PickerBox
      selector={color.amountSelector2} />
  </View>
  );
});

const ColorSummary = observer(({store}) => {

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: COLORS.WHITE,
        marginTop: h(36),
        paddingRight: h(15),
        flexWrap: 'wrap',
        width: windowWidth
      }}
    >
      {
        store.selectedColors.map((el) => <ColorInfo key={el.key} color={el} />)
      }
    </View>
  );
});

const PickerPageThree = observer(({store}) => {

  if (store.pageThreeSelector == null) {
    return <View />;
  }

  return (
    <MyPicker
      onValueChange={(val) => store.pageThreeSelector.value = val}
      title={store.pageThreeSelector.title}
      value={store.pageThreeSelector.value}
      data={store.pageThreeSelector.data}
      isShown={store.pageThreeSelector.isOpen}
      onConfirm={() => store.confirmSelectorPageThree()}
      onCancel={() => store.cancelSelectorPageThree()}
    />
  );
});

const PickerBox = observer(({selector, style, pickerStyle, itemStyle}) => {
  return (
    <View
      style={{
        height: h(175),
        borderWidth: 1 / 2,
        borderColor: COLORS.BLACK,
        overflow: 'hidden',
        marginLeft: h(15),
        ...style
      }}>
      <Picker
        selectedValue={selector.selectedValue}
        style={{
          marginTop: -65,
          width: (windowWidth - h(30)) / 4 - h(15),
          ...pickerStyle
        }}
        itemStyle={{
          color:COLORS.BLACK,
          fontSize: h(30),
          fontFamily: FONTS.ROMAN,
          ...itemStyle
        }}
        onValueChange={(val) => selector.selectedValue = val}>
        { selector.data.map((val) => <Picker.Item key={val[0] + val[1]} label={val} value={val} />) }

      </Picker>
    </View>
  );
});

const LastRowColor = observer(({store}) => {
  return (
    <View style={{flexDirection: 'row', backgroundColor: COLORS.WHITE,  marginTop: h(36), paddingRight: h(15)}}>
      <View
        style={{
          flex: 1,
          height: h(175),
          flexDirection: 'row',
        }}>

        <PickerBox
          style={{backgroundColor:COLORS.BOTTOMBAR_BORDER}}
          itemStyle={{color: COLORS.WHITE}}
          selector={store.vlSelector}
        />
        <PickerBox selector={store.vlWeightSelector} />
      </View>
      <View
        style={{
          marginLeft: h(15),
          flex: 1,
          height: h(175),
          borderWidth: 1 / 2,
          borderColor: COLORS.BLACK,
          alignItems:'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: COLORS.BLACK
        }}>
        <Picker
          selectedValue={store.selectedMinutes}
          style={{ height: h(175), marginTop: -100, width: (windowWidth - h(30)) / 2 - h(15) }}
          itemStyle={{
            color: COLORS.WHITE,
            backgroundColor: COLORS.BLACK,
            fontSize: h(40),
            marginTop: -13,
            fontFamily: FONTS.ROMAN
          }}
          onValueChange={(val) => store.selectedMinutes = val}>
          { store.minData.map((val) => <Picker.Item key={val[0] + val[1]} label={val} value={val} />) }
        </Picker>
      </View>
    </View>
  );
});


@observer
@autobind
export default class AddServicePageThree extends Component {
  render() {
    let store = AddServiceStore;
    return (
      <View style={{paddingTop: 20, backgroundColor: COLORS.WHITE, flex: 1}}>
        <SlimHeader
          leftText='Back'
          titleWidth={140}
          onLeft={() => {
            this.props.navigator.pop({ animated: true });
          }}
          title='Add Service (3/3)'
          titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
          rightText='Done'
          onRight={() => {

            let unit = AddServiceStore.colorNameSelector.selectedData.unit;
            let developerWeight =  convertFraction(unit, AddServiceStore.vlWeightSelector.selectedValue);
            let storeObj = {
              unit: AddServiceStore.colorNameSelector.selectedData.unit,
              service_id: AddServiceStore.serviceSelector.selectedData.id,
              service_name: AddServiceStore.serviceSelector.selectedData.name,
              line_id: AddServiceStore.colorNameSelector.selectedData.id,
              line_name: AddServiceStore.colorNameSelector.selectedData.name,
              brand_name: AddServiceStore.brandSelector.selectedData.name,
              post_item_tag_colors: AddServiceStore.selectedColors,
              developer_volume: parseInt(AddServiceStore.vlSelector.selectedValue.split(' ')[0], 10),
              developer_amount: developerWeight,
              developer_time: parseInt(AddServiceStore.selectedMinutes.split(' ')[0], 10)
            }
            
            AddServiceStore.isLoading = true;
            AddServiceStore.save(storeObj);
          }}
        />
      <View style={{flex: 1}}>
        <ScrollView style={{height: windowHeight - store.pageThreePickerHeight - 20 - h(88)}}>
          <Text
            style={{fontSize: h(40), textAlign: 'center', marginVertical: h(30), fontFamily: FONTS.SF_MEDIUM}}
          > Add Color formula </Text>
          <Summary store={AddServiceStore} />
          <ColorSummary store={AddServiceStore} />
          <LastRowColor store={AddServiceStore} />
        </ScrollView>
        <PickerPageThree store={AddServiceStore} />
        <LoadingScreen store={AddServiceStore} />
      </View>
    </View>
    );
  }
}
