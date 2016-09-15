import React from 'react';
import _ from 'lodash';
import {autobind} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, Text, ScrollView, TouchableOpacity, Linking, Image} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import appEmitter from '../appEmitter';

import CollapsableContainer from '../components/CollapsableContainer';
import Icon from '../components/Icon';

import {editCustomerStack} from '../routes';

@connect(app, user)
export default class UserAbout extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    profile: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  componentWillMount() {
    this.listeners = [
      appEmitter.addListener('login', this.onLogin)
    ];
  }

  componentWillUnmount() {
    _.each(this.listeners, l => l.remove());
  }

  @autobind
  onLogin() {
    this.refs.scrollView.scrollToTop();
  }

  renderEmpty() {
    if (this.props.profile !== this.props.user)
      return (<Text style={{
        fontFamily: FONTS.OBLIQUE,
        fontSize: SCALE.h(26),
        color: COLORS.BOTTOMBAR_NOTSELECTED
      }}>Nothing added yet</Text>);

    return (<TouchableOpacity
      onPress={() => {
        _.first(this.context.navigators).jumpTo(editCustomerStack);
      }}
      style={{
        height: SCALE.h(36),
        width: SCALE.h(36),
        borderRadius: SCALE.h(36) / 2,
        borderWidth: 1,
        borderColor: COLORS.BOTTOMBAR_NOTSELECTED,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Icon
        color={COLORS.BOTTOMBAR_NOTSELECTED}
        name="collapsable-cross"
        size={SCALE.h(20)}
      />
    </TouchableOpacity>);
  }

  renderProfessionalDescription() {
    return (<CollapsableContainer label="PROFESSIONAL_DESCRIPTION">
      {!this.props.profile.get('business_info') ?
        this.renderEmpty()
      :
        <Text style={{
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(28),
          color: COLORS.BOTTOMBAR_SELECTED
        }}>{this.props.profile.get('business_info')}</Text>
      }
    </CollapsableContainer>);
  }

  hasAddress() {
    return _.every(['business_address', 'business_city', 'business_state', 'business_zip'], (ppte) =>
      !!this.props.profile.get(ppte)
    );
  }

  renderAddressFooter() {
    if (!this.props.profile.get('business_website') && !this.hasAddress())
      return this.renderEmpty();

    return (<View style={{
      flexDirection: 'row'
    }}>
      <TouchableOpacity
        onPress={() => {
          var url = this.props.profile.get('business_website');
          if (this.props.profile.get('business_website').indexOf('http://') !== 0)
            url = 'http://' + url;

          Linking.openURL(url);
        }}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        <Icon
          color={COLORS[this.props.profile.get('account_type').toUpperCase()]}
          name="back"
          size={SCALE.h(20)}
          style={{
            transform: [
              {rotate: '180deg'}
            ]
          }}
        />

        <Text style={{
          fontFamily: FONTS.HEAVY,
          fontSize: SCALE.h(28),
          color: COLORS.BOTTOMBAR_SELECTED,
          marginLeft: 8
        }}>Go to website</Text>
      </TouchableOpacity>

      {this.props.profile.get('business_website') && this.hasAddress() &&
        <View style={{width: 1, backgroundColor: COLORS.ABOUT_SEPARATOR}} />
      }

      <TouchableOpacity
        onPress={() => {
          var address = this.getSinglelineAddress();
          var url = 'http://maps.apple.com/?address=' + address;

          Linking.openURL(url);
        }}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        <Icon
          color={COLORS[this.props.profile.get('account_type').toUpperCase()]}
          name="navigation"
          size={SCALE.h(24)}
        />

        <Text style={{
          fontFamily: FONTS.HEAVY,
          fontSize: SCALE.h(28),
          color: COLORS.BOTTOMBAR_SELECTED,
          marginLeft: 8
        }}>Get directions</Text>
      </TouchableOpacity>
    </View>);
  }

  getSinglelineAddress() {
    return _.map(['business_address', 'business_city', 'business_state', 'business_zip'], (ppte) =>
      this.props.profile.get(ppte)
    ).join(' - ');
  }

  renderAddress() {
    if (!this.hasAddress())
      return this.renderEmpty();

    return (<View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <View style={{justifyContent: 'center'}}>
        <Text style={{
          fontFamily: FONTS.HEAVY,
          fontSize: SCALE.h(30),
          color: COLORS.BOTTOMBAR_SELECTED
        }}>{this.props.profile.get('business_name')}</Text>
        <Text style={{
          color: COLORS.ADDRESS,
          fontFamily: FONTS.BOOK,
          fontSize: SCALE.h(30)
        }}>{this.props.profile.get('business_address')}</Text>
        <Text style={{
          color: COLORS.ADDRESS,
          fontFamily: FONTS.BOOK,
          fontSize: SCALE.h(30)
        }}>{this.props.profile.get('business_city')}, {this.props.profile.get('business_state')} {this.props.profile.get('business_zip')}</Text>
        <Text style={{
          color: COLORS.ADDRESS,
          fontFamily: FONTS.BOOK,
          fontSize: SCALE.h(30)
        }}>{this.props.profile.get('business_phone')}</Text>
      </View>

      <Image
        key={this.getSinglelineAddress()}
        source={{uri: `https://maps.googleapis.com/maps/api/staticmap?zoom=16&size=${SCALE.h(182) * 3}x${SCALE.h(182) * 3}&markers=color:red|${this.getSinglelineAddress()}`}}
        style={{
          marginLeft: 10,
          height: SCALE.h(182),
          width: SCALE.h(182)
        }}
      />
    </View>);
  }

  renderStylist() {
    return (<View>
      <CollapsableContainer
        label="EMPLOYMENT"
        renderFooter={() => this.renderAddressFooter()}
      >
        {this.renderAddress()}
      </CollapsableContainer>
      <CollapsableContainer label="CERTIFICATES">
        <Text style={{
          fontFamily: FONTS.MEDIUM,
          fontSize: SCALE.h(26),
          color: COLORS.TEXT
        }}>User About</Text>
      </CollapsableContainer>
      <CollapsableContainer label="PRODUCT EXPERIENCE">
        <Text style={{
          fontFamily: FONTS.MEDIUM,
          fontSize: SCALE.h(26),
          color: COLORS.TEXT
        }}>User About</Text>
      </CollapsableContainer>
      {this.renderProfessionalDescription()}
    </View>);
  }

  render() {
    return (<NavigationSetting
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE
      }}
    >
      <ScrollView
        ref="scrollView"
        style={{
          flex: 1
        }}
      >
        {this.props.profile.get('account_type') === 'stylist' && this.renderStylist()}
      </ScrollView>
    </NavigationSetting>);
  }
};
