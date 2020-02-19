import { observer } from 'Hairfolio/src/helpers';
import React from 'react';
import { View } from 'react-native';
import ActivityFollowingStore from '../mobx/stores/ActivityFollowingStore';
import ActivityYouStore from '../mobx/stores/ActivityYouStore';
import Favourites from './Favourites';


@observer
export default class ActivityTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.profile,
            from: this.props.from
        }

    }

    componentWillMount() {
        ActivityYouStore.load();
        ActivityFollowingStore.load();
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Favourites navigator={this.props.navigator}></Favourites>
            </View>
        );
    }

}
