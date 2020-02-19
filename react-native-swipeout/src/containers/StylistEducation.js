import { OrderedMap } from 'immutable';
import { observer } from 'mobx-react';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import whiteBack from '../../resources/img/nav_white_back.png';
import ServiceBackend from '../backend/ServiceBackend';
import NavigatorStyles from '../common/NavigatorStyles';
import LoadingContainer from '../components/LoadingContainer';
import PureComponent from '../components/PureComponent';
import SafeList from '../components/SafeList';
import UserStore from '../mobx/stores/UserStore';
import { COLORS, FONTS, SCALE } from '../style';
import { showLog } from '../helpers';


@observer
export default class StylistEducation extends PureComponent {
  state = {
    objEdu:[],
    singleItem:{},
    flag_firstTime:false,
    next_page:null,
    nextPage:1,
    isLoadingNextPage:false
  };

  constructor(props) {
    super(props);

    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
    showLog("user ==>"+JSON.stringify(UserStore.user))
  }

  static navigatorButtons = {
    leftButtons: [
      {
        id: 'back',
        icon: whiteBack,
      }
    ],
    rightButtons: [
      {
        id: 'add',
        title: 'Add',
        buttonFontSize: SCALE.h(30),
        buttonColor: COLORS.WHITE,
      }
    ]
  };    

    async callApi() {
      const response = await ServiceBackend.get(`users/${UserStore.user.id}/educations`);
      showLog("callApi result==>"+JSON.stringify(response.educations))
      this.setState({
        objEdu : response.educations
      })
      var educations = new OrderedMap(this.state.objEdu.map(education => [education.id, education]));
    this.setState({
      singleItem : educations.toObject()
    })
    }


    async fetchNextData() {
      if (!this.state.isLoadingNextPage && this.state.nextPage != null) {
        
        this.setState({
          isLoadingNextPage:true
        });

        let myId = UserStore.user.id;
  
        let res = await ServiceBackend.get(`/users/${UserStore.user.id}/educations?page=${this.state.nextPage}`);
  
        let {educations, meta} = res;
  
        var arr = [];

        arr = this.state.objEdu;
  
        for (let a = 0; a < educations.length; a++)  {
          /* let tagItem = new TagItem();
          await tagItem.init(tags[a]);
          this.elements.push(tagItem); */
          arr.push(educations[a]);
        }
        var educations2 = new OrderedMap(
          arr.map(
            education => [education.id, education]
          )
        );

        this.setState({
          singleItem:educations2.toObject(),
          nextPage:meta.next_page,
          isLoadingNextPage:false
        });

      }
    }


  onNavigatorEvent(event) {

    showLog("StylistAddEducation ==>"+event.id);

    if (event.id == 'bottomTabSelected') {
      this.props.navigator.resetTo({
        screen: 'hairfolio.Profile',
        animationType: 'fade',
        navigatorStyle: NavigatorStyles.tab
      });
    }
    if (event.id == 'willAppear') {
      this.fetchNextData();         
    }

    if (event.id == 'didAppear') {
      this.callApi();
        
    }
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'back') {
        this.props.navigator.pop({
          animated: true,
          animationStyle: 'fade',
        });
      } else if (event.id == 'add') {

        // this.props.navigation.navigate('EditSubCommunity', { updateSubCommunity: this.updateSubCommunity.bind(this), subCommunity: this.state.userSubCommunity })

        this.props.navigator.push({
          screen: 'hairfolio.StylistAddEducation',
          title: 'Add Education',
          navigatorStyle: NavigatorStyles.basicInfo
        });
      }
    }
  }

  getValue() {
    return null;
  }

  clear() {
  }

  renderEducation(education) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigator.push({
            screen: 'hairfolio.StylistAddEducation',
            navigatorStyle: NavigatorStyles.basicInfo,
            passProps: {
              education: education,
            },
          });
        }}
        style={{
          backgroundColor: COLORS.WHITE,
          padding: SCALE.w(25)
        }}
      >
        <Text style={{
          fontFamily: FONTS.HEAVY,
          fontSize: SCALE.h(30),
          color: COLORS.DARK
        }}>{education.name}</Text>
        <Text style={{
          fontFamily: FONTS.ROMAN,
          fontSize: SCALE.h(30),
          color: COLORS.DARK2
        }}>{(education.degree) ?education.degree.name:''}</Text>
        <Text style={{
          fontFamily: FONTS.BOOK,
          fontSize: SCALE.h(30),
          color: COLORS.LIGHT3
        }}>{education.year_from} - {education.year_to}</Text>
      </TouchableOpacity>
    );
  }

  renderContent() {
    
    return (<View style={{
      flex: 1
    }}>
      {(this.state.objEdu.length <= 0) ?
        <Text style={{
          marginTop: SCALE.h(35),
          marginLeft: SCALE.w(25),
          marginRight: SCALE.w(25),
          fontFamily: FONTS.MEDIUM,
          fontSize: SCALE.h(26),
          color: COLORS.TEXT
        }}>No Education added</Text>
      :
      <SafeList
      dataSource={{education: this.state.singleItem}}
        pageSize={10}
        renderRow={(education) => this.renderEducation(education)}
        renderSeparator={(sId, rId) => <View key={`sep_${sId}_${rId}`} style={{height: StyleSheet.hairlineWidth, backgroundColor: 'transparent'}} />}
        style={{
          flex: 1,
          backgroundColor: COLORS.TRANSPARENT
        }}
        onEndReached={()=>{ 
          this.fetchNextData()
        }}
        renderFooter={
            () => {
              if (this.state.nextPage != null) {
                return (
                  <View style={{flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large' />
                  </View>
                )
              } else {
                return <View />;
              }
            }
          }
      />
       
      }
    </View>);
  }

  render() {
    return (
      <LoadingContainer state={[UserStore.userState]}>
        {() => this.renderContent()}
      </LoadingContainer>
    );
  }
};
