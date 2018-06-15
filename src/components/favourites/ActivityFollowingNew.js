import React from 'react';
import _ from 'lodash';
import PureComponent from '../../components/PureComponent';
import {List, OrderedMap} from 'immutable';
import {View, Text, StyleSheet, TouchableOpacity,ActivityIndicator} from 'react-native';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import UserStore from '../../mobx/stores/UserStore';
import {COLORS, FONTS, SCALE} from '../../style';
import SafeList from '../../components/SafeList';
import LoadingContainer from '../../components/LoadingContainer';
import whiteBack from '../../../resources/img/nav_white_back.png';
import NavigatorStyles from '../../common/NavigatorStyles';
import ServiceBackend from '../../backend/ServiceBackend';
import Activity from '../../mobx/stores/Activity';
import ActivityItem from './ActivityItem';


@observer
export default class ActivityFollowing extends PureComponent {
  state = {
    singleItem: {},
    next_page: null,
    nextPage: 1,
    isLoadingNextPage: false
  };

  constructor(props) {
    super(props);
    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
  }

  componentWillMount(){
    console.log("componentWillMount ==>");
    this.fetchNextData()
  }

  componentWillUnmount(){
    console.log("componentWillUnmount ==>")
  }


  async fetchNextData() {


    if (!this.state.isLoadingNextPage && this.state.nextPage != null) {

      this.setState({
        isLoadingNextPage: true
      });

      var meta_obj = {}


      // let arr = (await ServiceBackend.get(`notifications?following=true&page=${this.state.nextPage}`));

      ServiceBackend.get(`notifications?following=true&page=${this.state.nextPage}`).then(
        (result) => {

          for(key in result){
            console.log("key ==>" + key)
          }

          arr = result.notifications;
          meta_obj = result.meta;
          console.log("meta_obj ==>" + JSON.stringify(meta_obj))

          arr = arr.filter(e => e.notifiable_type != 'NilClass');

          Promise.all(
            arr.map(
              async e => {
                let a = new Activity();
                return await a.init(e);
              }
            )
          ).then(
            (res)=>{

              this.setState({
                singleItem: res,
                nextPage: meta_obj.next_page,
                isLoadingNextPage: false
              });

            },
            (error2)=>{
              alert(error2)
            }
          )

        },
        (error) => {
          alert(error)
        }
      );


      let result = (await ServiceBackend.get(`notifications?following=true&page=${this.state.nextPage}`));
      
      arr = result.notifications;
      meta = result.meta;
      arr = arr.filter(e => e.notifiable_type != 'NilClass');

      let res = await Promise.all(
      arr.map(
        async e => {
          let a = new Activity();
          return await a.init(e);
        }
      )
      )
      if(res){
        this.setState({
          singleItem: res,
          nextPage: meta_obj.next_page,
          isLoadingNextPage: false
        });
      }




    }
  }

  onNavigatorEvent(event) {
    if (event.id == 'willAppear') {
      this.fetchNextData();
    }
  }  

  

  render(){
    return(
      <View style={{ flex:1, backgroundColor:'red' }}>
        <SafeList
        pageSize={10}
        dataSource={this.state.singleItem}
        renderRow={(p) => <ActivityItem isMe={false} key={p.key} store={p} navigator={navigator} />}
        />
      </View>
    )
  }

  
};
