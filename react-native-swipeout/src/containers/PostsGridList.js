import { observer } from 'Hairfolio/src/helpers';
import React from 'react';
import { View } from 'react-native';
import WhiteHeader from '../components/WhiteHeader';
import { COLORS } from '../style';
import UserPosts from './UserPosts';

@observer
export default class PostsGridList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.profile,
      from: this.props.from
    }

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
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
        <WhiteHeader title='Posts'
          onLeft={() => {
            this.props.navigator.pop({ animated: true });
          }
          }
        />

        <UserPosts
          tabLabel="Posts"
          navigator={this.props.navigator}
          profile={this.state.profile}
          isFrom="PostGridList" />

      </View>
    );
  }
}