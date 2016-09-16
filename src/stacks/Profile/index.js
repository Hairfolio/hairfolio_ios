import React from 'React';
import _ from 'lodash';
import {View} from 'react-native';

import Navigator from '../../navigation/Navigator';

import NavigationBar from '../../components/UserProfile/Bar';

import PureComponent from '../../components/PureComponent';

import {COLORS} from '../../style';
import {USERPROFILEBAR_HEIGHT} from '../../constants';

export default class BrandProfileStack extends PureComponent {
  static propTypes = {
    color: React.PropTypes.string.isRequired,
    routes: React.PropTypes.array.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  componentWillMount() {
    //
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT
      }}>
        <Navigator
          backgroundStyle={{
            paddingTop: USERPROFILEBAR_HEIGHT
          }}
          initialRoute={_.first(this.props.routes)}
          initialRouteStack={this.props.routes}
          navigationBar={<NavigationBar color={this.props.color} />}
          ref={(navigator) => this._nav = navigator && navigator.navigator()}
        />
      </View>
    );
  }
}
