import React from 'React';
import {Platform, BackAndroid, StatusBar} from 'react-native';
import {autobind} from 'core-decorators';

import Navigator from '../../navigation/Navigator';
import NavigationSetting from '../../navigation/NavigationSetting';

import NavigationBar from '../../components/DarkNavigationBar/Bar';

import PureComponent from '../../components/PureComponent';

import {COLORS} from '../../style';
import {editCustomer, changePassword, salonStylistsEU, salonSPEU, salonAddSPEU, editCustomerAddress, stylistCertificatesEU, stylistPlaceOfWorkEU, stylistProductExperienceEU, stylistEducationEU, stylistAddEducationEU, salonProductExperienceEU} from '../../routes';

export default class EditCustomerStack extends PureComponent {
  static propTypes = {};

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  @autobind
  onWillFocus() {
    StatusBar.setHidden(false, 'fade');
    StatusBar.setBarStyle('light-content', true);
  }

  @autobind
  onWillBlur() {
  }

  @autobind
  onBackAndroid() {
  }

  render() {
    return (
      <NavigationSetting
        onWillBlur={this.onWillBlur}
        onWillFocus={this.onWillFocus}
        style={{
          flex: 1,
          backgroundColor: COLORS.LIGHT
        }}
      >
        <Navigator
          initialRoute={editCustomer}
          initialRouteStack={[
            editCustomer, changePassword, salonStylistsEU, salonSPEU, salonAddSPEU, editCustomerAddress, stylistCertificatesEU, stylistPlaceOfWorkEU, stylistProductExperienceEU, stylistEducationEU, stylistAddEducationEU, salonProductExperienceEU
          ]}
          navigationBar={<NavigationBar />}
          ref={(navigator) => this._nav = navigator && navigator.navigator()}
        />
      </NavigationSetting>
    );
  }
}
