import _ from 'lodash';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Communications from 'react-native-communications';
import NavigatorStyles from '../common/NavigatorStyles';
import CollapsableContainer from '../components/AboutCollapsableContainer';
import Icon from '../components/Icon';
import UserStore from '../mobx/stores/UserStore';
import { COLORS, FONTS, SCALE } from '../style';
import { showLog } from '../helpers';

@observer
export default class UserAbout extends React.Component {
  static propTypes = {
    profile: React.PropTypes.object.isRequired,
  };

  renderEmpty() {
    if (this.props.profile.id !== UserStore.user.id)
      return (<Text style={{
        fontFamily: FONTS.OBLIQUE,
        fontSize: SCALE.h(26),
        color: COLORS.BOTTOMBAR_NOTSELECTED
      }}>Nothing added yet</Text>);

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigator.push({
            screen: 'hairfolio.EditCustomer',
            title: 'Settings',
            navigatorStyle: NavigatorStyles.basicInfo,
          });
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
      </TouchableOpacity>
    );
  }

  renderProfessionalDescription() {
    let description;
    if (this.props.profile.account_type === 'stylist') {
      description = this.props.profile.description;
    } else {
      description = this.getBusiness().info;
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
      {!this.props.profile.career_opportunity ?
        this.renderEmpty()
      :
        <Text style={{
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(28),
          color: COLORS.BOTTOMBAR_SELECTED
        }}>{this.props.profile.career_opportunity}</Text>
      }
    </CollapsableContainer>);
  }

  hasAddress() {
    let element;

    if (this.props.profile.account_type === 'ambassador') {
      element = this.props.profile.brand;
    } else {
      if(this.props.profile.workplace)
      {
        element = this.props.profile.workplace;
      }
      else
      {
        element = this.props.profile.salon;
      }
      
    }

    if (element == null) {
      return false;
    }

    for (let key of ['address', 'city', 'state', 'zip']) {
      let el = element[key];
      if (!el || el.length == 0) {
        return false;
      }
    }

    return true;
  }

  getBusiness() {
    if (this.props.profile.account_type === 'ambassador') {
      if(this.props.profile.brand){
        return this.props.profile.brand;
      }
      return '';
    } else {
      if(this.props.profile.workplace)
      {
        return this.props.profile.workplace
      }
      else{
       if(this.props.profile.salon){
        return this.props.profile.salon
        }
      }
   
      return '';
    }
  }

  hasWebsite() {
    let website;

    let business = this.getBusiness();

    if (business == null) {
      return false;
    }

    website = business.website;

    return website && website.length > 0;
  }

  renderAddressFooter() {
    if (!this.hasWebsite() && !this.hasAddress()) {
      return this.renderEmpty();
    }

    let seperator;

    let business = this.getBusiness();

    if (business.website && this.hasAddress()) {
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
          var url = business.website;
          if (business.website.indexOf('http://') !== 0)
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
          color={COLORS[this.props.profile.account_type.toUpperCase()]}
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
          color={COLORS[this.props.profile.account_type.toUpperCase()]}
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
      business[ppte]
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
        }}>{business.name}</Text>
        <Text style={{
          color: COLORS.ADDRESS,
          fontFamily: FONTS.BOOK,
          fontSize: SCALE.h(30)
        }}>{business.address}</Text>
        <Text style={{
          color: COLORS.ADDRESS,
          fontFamily: FONTS.BOOK,
          fontSize: SCALE.h(30)
        }}>{business.city}, {business.state} {business.zip}</Text>

        <TouchableOpacity
          onPress={() => {
            Communications.phonecall(business.phone, true);
          }}
          style={{
            alignSelf: 'flex-start',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: COLORS.BLUE3
          }}
        >
          <Text style={{
            color: COLORS.BLUE3,
            fontFamily: FONTS.BOOK,
            fontSize: SCALE.h(30)
          }}>{business.phone}</Text>
        </TouchableOpacity>
      </View>

      <Image
        key={this.getSinglelineAddress()}
        
        source={{uri: `https://maps.googleapis.com/maps/api/staticmap?zoom=16&size=${SCALE.h(182) * 3}x${SCALE.h(182) * 3}&markers=color:red|${this.getSinglelineAddress()}&key=AIzaSyDLKw5itFgFJkspaHDfMuZumhJzudLORek`}}
        style={{
          marginLeft: 10,
          height: SCALE.h(182),
          width: SCALE.h(182),
          
        }}
      />
    </View>);
  }

  renderCartouches(list) {
    if (!list.length)
      return this.renderEmpty();

    return list.map(item =>
      <View key={item.id} style={{alignItems: 'flex-start', marginBottom: 5, marginTop: 5}}>
        <View style={{
          borderWidth: 1,
          borderColor: COLORS[this.props.profile.account_type.toUpperCase()],
          padding: 2,
          paddingLeft: 10,
          paddingRight: 10,
          alignItems: 'center'
        }}>
          <Text style={{
            fontFamily: FONTS.ROMAN,
            fontSize: SCALE.h(28),
            color: COLORS.SEARCH_LIST_ITEM_COLOR
          }}>{item.name}</Text>
        </View>
      </View>
    );
  }

  renderStylist() {
    window.profile = this.props.profile;
    return (
      <View>
        {this.renderProfessionalDescription()}
        <CollapsableContainer
          label="EMPLOYMENT"
          renderFooter={() => this.renderAddressFooter()}
        >
          {this.renderAddress()}
        </CollapsableContainer>
        <CollapsableContainer
          label="SERVICES"
        >
          {this.renderServices()}
        </CollapsableContainer>
        <CollapsableContainer label="CERTIFICATES">
          {this.renderCartouches(this.props.profile.certificates)}
        </CollapsableContainer>
        <CollapsableContainer label="PRODUCT EXPERIENCE">
          {this.renderCartouches(this.props.profile.experiences)}
        </CollapsableContainer>
        <CollapsableContainer label="EDUCATION">
          {this.renderEducation()}
        </CollapsableContainer>
      </View>
    );
  }

  renderBrand() {
    window.profile = this.props.profile;
    return (
      <View>
        <CollapsableContainer
          label="CONTACT"
          renderFooter={() => this.renderAddressFooter()}
        >
          {this.renderAddress()}
        </CollapsableContainer>
        {this.renderProfessionalDescription()}
      </View>
    );
  }

  renderServices() {
    if (!this.props.profile.offerings || this.props.profile.offerings.length === 0)
      return this.renderEmpty();

    return this.props.profile.offerings.map((offer, i) =>
      <View
        key={offer.id}
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
        }}>{offer.service.name}<Text style={{fontFamily: FONTS.ROMAN}}> - {offer.category.name}</Text></Text>
        <Text style={{
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(30),
          color: COLORS.DARK2
        }}>${offer.price}</Text>
      </View>
    );
  }

  renderEducation() {
    if (!this.props.profile.educations || this.props.profile.educations.length === 0)
      return this.renderEmpty();

    return this.props.profile.educations.map((education, i) =>
      <View
        key={education.id}
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
        }}>{education.name}</Text>
      {/*   <Text style={{fontFamily: FONTS.ROMAN}}>{education.website}</Text> */}
        <Text style={{
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(30),
          color: COLORS.DARK2
        }}>{education.year_from}<Text style={{fontFamily: FONTS.ROMAN}}> - {education.year_to}</Text></Text>
      </View>
    );
  }

  renderSalon() {
    return (
      <View>        
        {this.renderProfessionalDescription()}
        <CollapsableContainer
          label="CONTACT"
          renderFooter={() => this.renderAddressFooter()}
        >
          {this.renderAddress()}
        </CollapsableContainer>
        <CollapsableContainer label="PRODUCTS">
          {this.renderCartouches(this.props.profile.experiences)}
        </CollapsableContainer>

        <CollapsableContainer
          label="SERVICES"
          noPadding
        >
          {this.renderServices()}
        </CollapsableContainer>
        {this.renderCareerOpportunity()}
      </View>
    );
  }

  render() {
    // comme profile n'est pas updaté lorsqu'il y a une modification interne
    // alors qu'on est deja sur la page,
    // on switche sur user qui de toute façon est le seul qui risque d'etre updaté
    this.props.profile = this.props.profile.id === UserStore.user.id ? toJS(UserStore.user) : this.props.profile;
    return (
      <View
        style={{
          backgroundColor: COLORS.WHITE,
          flex: 1
        }}
      >
        {this.props.profile.account_type === 'stylist' && this.renderStylist()}
        {this.props.profile.account_type === 'ambassador' && this.renderBrand()}
        {this.props.profile.account_type === 'owner' && this.renderSalon()}
      </View>
    );
  }
};
