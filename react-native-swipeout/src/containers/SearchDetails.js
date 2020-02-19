import { observer, React, StatusBar, View } from 'Hairfolio/src/helpers';
import SimpleButton from '../components/Buttons/Simple';
import PureComponent from '../components/PureComponent';
import SearchDetailsElement from '../components/search/SearchDetailsElement';
import SearchDetailsStore from '../mobx/stores/search/SearchDetailsStore';
import { COLORS } from '../style';
import { showLog } from '../helpers';


const SampleActions = observer(() => {
  return (
    <View>
    <SimpleButton
      color={COLORS.DARK}
      label="Go to a consumer profile"
      onPress={() => {
       
      }}
    />
    <View style={{height: 20}} />
    <SimpleButton
      color={COLORS.DARK}
      label="Go to a stylist profile"
      onPress={() => {
      }}
    />
    <View style={{height: 20}} />
    <SimpleButton
      color={COLORS.DARK}
      label="Go to a salon profile"
      onPress={() => {
      }}
    />
    <View style={{height: 20}} />
    <SimpleButton
      color={COLORS.DARK}
      label="Go to a brand profile"
      onPress={() => {
      }} />

    </View>
  );
});

export default class SearchDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    StatusBar.setBarStyle('light-content')
    if (SearchDetailsStore.dontReset) {
      // SearchDetailsStore.dontReset = true;
    } else {
      SearchDetailsStore.reset();
    }
  }

  onNavigatorEvent(event) {
    showLog("event ==>"+event.id)
    switch(event.id) {      
        case 'didDisappear':
        // this.props.navigator.pop({animated: true})
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    if (SearchDetailsStore.dontReset) {
      SearchDetailsStore.dontReset = false;
    } else {
      setTimeout(() => SearchDetailsStore.input.focus());
    }
  }

  componentWillUnmount(){
    this.props.navigator.pop({animated: true})
  }


  render() {
    return (
      <View style={{
        flex: 1
      }}>
        <SearchDetailsElement navigator={this.props.navigator}/>
      </View>
    );
  }
};
