import { observer } from 'Hairfolio/src/helpers';
import React from 'react';
import { View } from 'react-native';
import FavouritesGrid from '../components/favourites/FavouritesGrid';
import WhiteHeader from '../components/WhiteHeader';
import FavoriteStore from '../mobx/stores/FavoriteStore';
import { COLORS } from '../style';


@observer
export default class FavouritesGridList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      from: this.props.from
    }

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillMount() {

    // FavoriteStore.load();
  }

  onNavigatorEvent(event) {
    if (event.id == 'willAppear') {
      // this.fetchNextData();
    }
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: COLORS.WHITE
      }}>
        <WhiteHeader title='Favourite Posts'

          onLeft={() => {

            this.props.navigator.pop({ animated: true });
          }}
        />
        <FavouritesGrid tabLabel="Favorites" navigator={this.props.navigator} from={'from_star'} />
      </View>
    );
  }
}
