import { observer, React, View,Text } from 'Hairfolio/src/helpers';
import { StatusBar } from 'react-native';
import NavigatorStyles from '../common/NavigatorStyles';
import SimpleButton from '../components/Buttons/Simple';
import PureComponent from '../components/PureComponent';
import SearchElement from '../components/search/SearchElement';
import SearchStore from '../mobx/stores/SearchStore';
import { COLORS } from '../style';
import { showLog, h } from '../helpers';


const SampleActions = observer(() => {
  return (
    <View>

    <SimpleButton
      color={COLORS.DARK}
      label="Go to a consumer profile"
      onPress={() => {
        navigator.push({
          screen: 'hairfolio.Profile',
          navigatorStyle: NavigatorStyles.tab,
          passProps: {
            userId: 118,
          }
        });
      }}
    />

    <View style={{height: 20}} />

    <SimpleButton
      color={COLORS.DARK}
      label="Go to a stylist profile"
      onPress={() => {
        navigator.push({
          screen: 'hairfolio.Profile',
          navigatorStyle: NavigatorStyles.tab,
          passProps: {
            userId: 120,
          }
        });
      }}
    />

    <View style={{height: 20}} />

    <SimpleButton
      color={COLORS.DARK}
      label="Go to a salon profile"
      onPress={() => {
        navigator.push({
          screen: 'hairfolio.Profile',
          navigatorStyle: NavigatorStyles.tab,
          passProps: {
            userId: 121,
          }
        });
      }}
    />

    <View style={{height: 20}} />

    <SimpleButton
      color={COLORS.DARK}
      label="Go to a brand profile"
      onPress={() => {
        navigator.push({
          screen: 'hairfolio.Profile',
          navigatorStyle: NavigatorStyles.tab,
          passProps: {
            userId: 122,
          }
        });
      }} />

    </View>
  );
});

@observer
export default class Search extends PureComponent {
  constructor(props) {
    super(props);
    // SearchStore.load();
    // SearchStore.stylistsList.getUserLocation(this.props.navigator)
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.state = {
      is_loaded : false
    };
  }

  onNavigatorEvent(event) {
    showLog("Search js ==>" + event.id);
    switch (event.id) {
      case 'willAppear':
        this.setState({ is_loaded: true});
        showLog("Search js ==>" + event.id);
        StatusBar.setBarStyle('dark-content', true);
        this.props.navigator.toggleTabs({
          to: 'shown',
        });
        this.loadScreenOnAppear();
        break;
        case 'bottomTabSelected':
        showLog("bottomTabSelected ==>");
        SearchStore.topTags.resetTags();
        SearchStore.hashtagPosts.hashtagPostsList = [];
        SearchStore.hashtagPosts.selectedTags = [];
        SearchStore.hashtagPostDataSource;
        SearchStore.searchString = "";
        // SearchStore.accountType = 'stylist';
        // SearchStore.accountDisplayText = 'Hair Stylist';
        SearchStore.accountType = 'all_tags';
        SearchStore.accountDisplayText = 'All Tags';
        SearchStore.updateValues();
        SearchStore.load();
        this.props.navigator.resetTo({
          screen: 'hairfolio.Search',
          animationType: 'fade',
          navigatorStyle: NavigatorStyles.tab
        });
        break;
      case 'bottomTabReselected':
        showLog("bottomTabReselected ==>");
        SearchStore.topTags.resetTags();
        SearchStore.hashtagPosts.hashtagPostsList = [];
        SearchStore.hashtagPosts.selectedTags = [];
        SearchStore.hashtagPostDataSource;
        SearchStore.searchString = "";
        SearchStore.accountType = 'stylist';
        SearchStore.accountDisplayText = 'Hair Stylist';
        SearchStore.updateValues();
        SearchStore.load();
        this.props.navigator.resetTo({
          screen: 'hairfolio.Search',
          animationType: 'fade',
          navigatorStyle: NavigatorStyles.tab
        });
        break;
      default:
        break;
    }
  }

  loadScreenOnAppear() {
    StatusBar.setBarStyle('dark-content', true);
  }

  render() {    
    if(this.state.is_loaded){
      return this.render2();
    }else{
      return null;
    }    
  }

  render2() {
    let store = SearchStore;
    showLog("SEARCH JS ==>");
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
          // justifyContent: 'center',
          // alignItems: 'center'
        }}
      >
        {/* <SearchElement navigator={this.props.navigator}/> */}
        {/* <Text style={{fontSize: h(30), color: COLORS.DARK}}>Work in progress</Text> */}
             <SearchElement navigator={this.props.navigator} store={store} isHashtagSearched={store.hashtagPosts.hashtagPostsList.length > 0}/>
      </View>
    );
  }
};
