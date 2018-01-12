import React from 'react';
import _ from 'lodash';
import PureComponent from '../components/PureComponent';
import Communications from 'react-native-communications';
import {View, Text} from 'react-native';
import {autobind} from 'core-decorators';
import {Map, OrderedMap} from 'immutable';
import {COLORS, FONTS, SCALE} from '../style';
import SearchList from '../components/SearchList';
import LoadingContainer from '../components/LoadingContainer';
import NavigationSetting from '../navigation/NavigationSetting';
import Contacts from 'react-native-contacts';

import utils from '../utils';

import {NAVBAR_HEIGHT, READY, LOADING, LOADING_ERROR} from '../constants';

export default class SalonStylist extends PureComponent {
  static propTypes = {
    backTo: React.PropTypes.object.isRequired,
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  state = {};

  loadContacts() {
    Contacts.getAll((err, contacts) => {
      if (err)
        return this.loadContactsError();

      this.setState({
        contactsStates: READY,
        contacts: new OrderedMap(
          _.filter(contacts, contact => contact.emailAddresses.length)
            .map(contact =>
              [contact.recordID, new Map({
                id: contact.recordID,
                name: contact.givenName,
                email: _.first(contact.emailAddresses).email
              })])
        )
      });
    });
  }

  loadContactsError() {
    this.setState({contactsStates: LOADING_ERROR});
  }

  @autobind
  onWillFocus() {
    if (utils.isReady(this.state.contactsStates) || utils.isLoading(this.state.contactsStates))
      return;

    this.setState({
      contactsStates: LOADING
    });

    Contacts.checkPermission((err, permission) => {
      if (err)
        return this.loadContactsError();

      if (permission === Contacts.PERMISSION_UNDEFINED)
        Contacts.requestPermission((err, permission) => {
          if (err)
            return this.loadContactsError();
          this.loadContacts();
        });

      if (permission === Contacts.PERMISSION_AUTHORIZED)
        this.loadContacts();

      if (permission === Contacts.PERMISSION_DENIED)
        this.loadContactsError();
    });
  }

  render() {
    return (<NavigationSetting
      leftAction={() => {
        _.last(this.context.navigators).jumpTo(this.props.backTo);
      }}
      leftIcon="back"
      onWillBlur={this.onWillBlur}
      onWillFocus={this.onWillFocus}
      rightAction={() => {
        var contacts = this._searchList.getValue();

        if (!contacts.length)
          return;

        Communications.email(
          null,
          [],
          _.map(
            this.state.contacts.filter(contact => contacts.indexOf(contact.get('id')) !== -1).toJS(),
            'email'
          ),
          'I\’d like to add you on Hairfolio',
          `
I’d like to add you as a stylist
https://hairfolio.com/diverseawarenes

-----
Don’t have Hairfolio?
Get it from the App Store:
https://itunes.apple.com/us/app/hairfolio/id672…
          `
        );
      }}
      rightLabel="Invite"
      style={{
        flex: 1,
        backgroundColor: COLORS.LIGHT,
        paddingTop: NAVBAR_HEIGHT
      }}
      title="Stylists"
    >
      <LoadingContainer state={[this.state.contactsStates]}>
        {() => this.state.contacts.count() ?
          <SearchList
            items={this.state.contacts}
            placeholder="Search for Stylists"
            ref={sL => this._searchList = sL}
            style={{
              flex: 1
            }}
          />
        :
          <Text>No email contact on this phone</Text>
        }
      </LoadingContainer>
    </NavigationSetting>);
  }
};
