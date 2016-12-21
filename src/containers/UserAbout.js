import React from 'react';
import _ from 'lodash';
import {autobind} from 'core-decorators';
import PureComponent from '../components/PureComponent';
import {View, Text, TouchableOpacity, Linking, Image, StyleSheet} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {user} from '../selectors/user';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import Communications from 'react-native-communications';

import appEmitter from '../appEmitter';

import CollapsableContainer from '../components/CollapsableContainer';
import Icon from '../components/Icon';

import {editCustomerStack} from '../routes';

@connect(app, user)
export default class UserAbout extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired,
    onLayout: React.PropTypes.func.isRequired,
    profile: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  renderEmpty() {
    if (this.profile.get('id') !== this.props.user.get('id'))
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

    let description;
    if (this.profile.get('account_type') === 'stylist') {
      description = this.profile.get('description');
    } else {
      description = this.getBusiness().get('info');
    }


    return (<CollapsableContainer label="PROFESSIONAL DESCRIPTION">
      {!description ?
        this.renderEmpty()
      :
        <Text style={{
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(28),
          color: COLORS.BOTTOMBAR_SELECTED
        }}>{description}</Text>
      }
    </CollapsableContainer>);
  }

  renderCareerOpportunity() {
    return (<CollapsableContainer label="CAREER OPPORTUNITIES">
      {!this.profile.get('career_opportunity') ?
        this.renderEmpty()
      :
        <Text style={{
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(28),
          color: COLORS.BOTTOMBAR_SELECTED
        }}>{this.profile.get('career_opportunity')}</Text>
      }
    </CollapsableContainer>);
  }

  hasAddress() {
    let element;

    if (this.profile.get('account_type') === 'ambassador') {
      element = this.profile.get('brand');
    } else {
      element = this.profile.get('salon');
    }

    if (element == null) {
      return false;
    }

    for (let key of ['address', 'city', 'state', 'zip']) {
      let el = element.get(key);
      if (!el || el.length == 0) {
        return false;
      }
    }

    return true;
  }

  getBusiness() {
    if (this.profile.get('account_type') === 'ambassador') {
      return this.profile.get('brand');
    } else {
      return this.profile.get('salon');
    }
  }

  hasWebsite() {
    let website;

    let business = this.getBusiness();

    if (business == null) {
      return false;
    }

    website = business.get('website');

    return website && website.length > 0;
  }

  renderAddressFooter() {
    if (!this.hasWebsite() && !this.hasAddress()) {
      return this.renderEmpty();
    }

    let seperator;

    let business = this.getBusiness();

    if (business.get('website') && this.hasAddress()) {
      seperator = (
        <View
          style={{width: 1, backgroundColor: COLORS.ABOUT_SEPARATOR}} />
      );
    }



    return (<View style={{
      flexDirection: 'row'
    }}>
      <TouchableOpacity
        onPress={() => {
          var url = business.get('website');
          if (business.get('website').indexOf('http://') !== 0)
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
          color={COLORS[this.profile.get('account_type').toUpperCase()]}
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

      {seperator }

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
          color={COLORS[this.profile.get('account_type').toUpperCase()]}
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

    let business = this.getBusiness();

    return _.map(['address', 'city', 'state', 'zip'], (ppte) =>
      business.get(ppte)
    ).join(' - ');
  }

  renderAddress() {

    if (!this.hasAddress()) {
      return this.renderEmpty();
    }

    let business = this.getBusiness();

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
        }}>{business.get('name')}</Text>
        <Text style={{
          color: COLORS.ADDRESS,
          fontFamily: FONTS.BOOK,
          fontSize: SCALE.h(30)
        }}>{business.get('address')}</Text>
        <Text style={{
          color: COLORS.ADDRESS,
          fontFamily: FONTS.BOOK,
          fontSize: SCALE.h(30)
        }}>{business.get('city')}, {business.get('state')} {business.get('zip')}</Text>

        <TouchableOpacity
          onPress={() => {
            Communications.phonecall(business.get('phone'), true);
          }}
          style={{
            alignSelf: 'flex-start',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: 'blue'
          }}
        >
          <Text style={{
            color: 'blue',
            fontFamily: FONTS.BOOK,
            fontSize: SCALE.h(30)
          }}>{business.get('phone')}</Text>
        </TouchableOpacity>
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

  renderCartouches(list) {
    if (!list.count())
      return this.renderEmpty();

    return list.map(item =>
      <View key={item.get('id')} style={{alignItems: 'flex-start', marginBottom: 5, marginTop: 5}}>
        <View style={{
          borderWidth: 1,
          borderColor: COLORS[this.profile.get('account_type').toUpperCase()],
          padding: 2,
          paddingLeft: 10,
          paddingRight: 10,
          alignItems: 'center'
        }}>
          <Text style={{
            fontFamily: FONTS.ROMAN,
            fontSize: SCALE.h(28),
            color: COLORS.SEARCH_LIST_ITEM_COLOR
          }}>{item.get('name')}</Text>
        </View>
      </View>
    );
  }

  renderStylist() {
    window.profile = this.profile;

    return (<View>
      <CollapsableContainer
        label="EMPLOYMENT"
        renderFooter={() => this.renderAddressFooter()}
      >
        {this.renderAddress()}
      </CollapsableContainer>
      <CollapsableContainer
        label="SERVICES"
        noPadding
      >
        {this.renderServices()}
      </CollapsableContainer>
      <CollapsableContainer label="CERTIFICATES">
        {this.renderCartouches(this.profile.get('certificates'))}
      </CollapsableContainer>
      <CollapsableContainer label="PRODUCT EXPERIENCE">
        {this.renderCartouches(this.profile.get('experiences'))}
      </CollapsableContainer>
      {this.renderProfessionalDescription()}
    </View>);
  }

  renderBrand() {

    window.profile = this.profile;
    return (<View>
      <CollapsableContainer
        label="ABOUT"
        renderFooter={() => this.renderAddressFooter()}
      >
        {this.renderAddress()}
      </CollapsableContainer>
      {this.renderProfessionalDescription()}
    </View>);
  }

  renderServices() {
    if (!this.profile.get('offerings').count())
      return this.renderEmpty();

    return this.profile.get('offerings').map((offer, i) =>
      <View
        key={offer.get('offering').get('id')}
        style={{
          backgroundColor: COLORS.WHITE,
          padding: SCALE.w(25),
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderTopWidth: i > 0 ? StyleSheet.hairlineWidth : 0,
          borderTopColor: COLORS.ABOUT_SEPARATOR
        }}
      >
        <Text style={{
          fontFamily: FONTS.HEAVY,
          fontSize: SCALE.h(30),
          color: COLORS.DARK
        }}>{offer.get('offering').get('service').get('name')}<Text style={{fontFamily: FONTS.ROMAN}}> - {offer.get('offering').get('category').get('name')}</Text></Text>
        <Text style={{
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(30),
          color: COLORS.DARK2
        }}>${offer.get('price')}</Text>
      </View>
    );
  }

  renderSalon() {
    return (<View>

      <CollapsableContainer
        label="CONTACT"
        renderFooter={() => this.renderAddressFooter()}
      >
        {this.renderAddress()}
      </CollapsableContainer>
      {this.renderProfessionalDescription()}
      <CollapsableContainer label="PRODUCTS">
        {this.renderCartouches(this.profile.get('experiences'))}
      </CollapsableContainer>

      <CollapsableContainer
        label="SERVICES"
        noPadding
      >
        {this.renderServices()}
      </CollapsableContainer>
      {this.renderCareerOpportunity()}
    </View>);
  }

  render() {
    // comme profile n'est pas updaté lorsqu'il y a une modification interne
    // alors qu'on est deja sur la page,
    // on switche sur user qui de toute façon est le seul qui risque d'etre updaté
    this.profile = this.props.profile.get('id') === this.props.user.get('id') ? this.props.user : this.props.profile;

    return (<NavigationSetting
      forceUpdateEvents={this.profile === this.props.user ? ['user-edited'] : null}
      style={{
        backgroundColor: COLORS.WHITE,
        flex: 1
      }}
    >
      <View
        onLayout={this.props.onLayout}
      >
        {this.profile.get('account_type') === 'stylist' && this.renderStylist()}
        {this.profile.get('account_type') === 'ambassador' && this.renderBrand()}
        {this.profile.get('account_type') === 'owner' && this.renderSalon()}
      </View>
    </NavigationSetting>);
  }
};
