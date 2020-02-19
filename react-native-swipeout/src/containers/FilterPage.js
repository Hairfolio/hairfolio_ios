import { autobind, Component, FONTS, h, Image, observer, React, ScrollView, Text, TouchableWithoutFeedback, View, windowWidth } from 'Hairfolio/src/helpers';
import { NativeModules } from 'react-native';
import SlimHeader from '../components/SlimHeader';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import { showLog } from '../helpers';
const RCTUIManager = NativeModules.UIManager;
const ImageFilter = NativeModules.ImageFilter;

const FilterImage = observer(({ item }) => {

  showLog("IMAGE SOURCE ==>"+JSON.stringify(item.source))

  return (
    <TouchableWithoutFeedback
      onPress={() => item.select()}
    >
      <View style={{ marginLeft: h(20), paddingTop: h(20) }}>

        <Image
          style={{ height: h(200), width: h(200) }}
          defaultSource={require('img/medium_placeholder_icon.png')}
          source={item.source}
        />
        <Text style={{ paddingTop: h(5), width: h(200), textAlign: 'center' }}>{item.displayName}</Text>
      </View>
    </TouchableWithoutFeedback>

  );
});

const FilterSelector = observer(({ store }) => {
  return (
    <ScrollView
      horizontal
      style={{ height: h(270) }}
    >
      {store.filteredImages.map((el) => <FilterImage key={el.key} item={el} />)}
    </ScrollView>

  );
});

@observer
@autobind
export default class FilterPage extends Component {
  render() {
    let store = CreatePostStore.gallery.filterStore;
    if (!store) {
      return <View />;
    }
    return (
      <View style={{ paddingTop: 20, backgroundColor: 'white', flex: 1 }}>
        <SlimHeader
          leftText='Cancel'
          onLeft={() => {
            this.props.navigator.pop({ animated: true });
          }}
          title='Filter'
          titleStyle={{ fontFamily: FONTS.SF_MEDIUM }}
          rightText='Apply'
          onRight={() => {
            CreatePostStore.gallery.applyFilter();
            this.props.navigator.pop({ animated: true });
          }}
        />
        <Image
          style={{ height: windowWidth, width: windowWidth }}
          source={store.mainPicture && store.mainPicture.source}
        />
        <FilterSelector store={store} />
      </View>
    );
  }
}
