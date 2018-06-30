import {
  _, // lodash
  v4,
  observable,
  computed,
  moment,
  action,
  observer, // mobx
  h,
  FONTS,
  autobind,
  React, // react
  Component,
  windowWidth,
  windowHeight,
  // react-native components
  AlertIOS,
  Modal,
  ScrollView,
  ActivityIndicator,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'Hairfolio/src/helpers';
import WriteMessageStore, { SelectableUser } from '../mobx/stores/WriteMessageStore';
import InfiniteScroll from 'react-native-infinite-scroll';
import {ListView} from 'react-native';
import ServiceBackend from '../backend/ServiceBackend';

const PeopleRow = observer(({store}) => {
  let checkElement;

  if (store.isSelected) {
    checkElement = (
      <Image
        style = {{
          marginRight: h(32),
          marginTop: h(12)
        }}
        source={require('img/message_check.png')}
      />
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={
        () => store.flip()
      }
    >
        <View
          style = {{
            flexDirection: 'row',
            paddingTop: h(16),
            backgroundColor: 'white'//store.background()
          }}
        >
          <View
            style = {{
              width: h(121),
              paddingLeft: h(16)
            }}
          >
            <Image
              style={{height: h(80), width: h(80), borderRadius: h(40)}}
              source={store.user.profilePicture ? store.user.profilePicture.getSource(80, 80) : null}
            />
          </View>
          <View
            style = {{
              flexDirection: 'row',
              flex: 1,
              height: h(100),
              paddingTop: h(8),
              borderBottomWidth: h(1),
              borderBottomColor: '#D8D8D8'
            }}
          >
            <View
              style = {{
                flex: 1
              }}
            >
              <Text
                style = {{
                  fontFamily: FONTS.MEDIUM,
                  fontSize: h(28),
                  color: '#393939'
                }}>
                {store.user.name}
              </Text>
            </View>
            {checkElement}
          </View>
        </View>
      </TouchableWithoutFeedback>
  );
});


const ToInput2 = observer(({store}) => {
  return (
    <View
      style = {{
        height: h(95),
        paddingHorizontal: h(28),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: h(1),
        borderBottomColor: '#D8D8D8'
      }}
    >
      <Text
        style = {{
          color: '#393939',
          fontSize: h(30),
          fontFamily: FONTS.MEDIUM,
          marginRight: h(15)
        }}

      >To: </Text>
      <TextInput
        style = {{
          fontSize: h(30),
          fontFamily: FONTS.MEDIUM
        }}
        text={store.inputText}
        onChangeText={
          text => {
            store.inputText = text;
            console.log("search ==>"+JSON.stringify(WriteMessageStore.items))
          }}
        placeholder='Search'
        style={{
          flex: 1
        }}
      />
    </View>

  );
})


@observer
export class SelectPeople extends Component{

  constructor(props){
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      next_page:null,
      nextPage:1,
      isLoadingNextPage:false,
      dataSource: ds,
      dataSource2: null,
      arr_data:[],
      arr_contacts:[],
      pure_contacts :[],
      modified_contacts :[],
    };

    this.fetchNextData = this.fetchNextData.bind(this);
  }

  componentWillMount(){
    arr_data = [];
    this.fetchNextData();
  }

  async fetchNextData(){

    if (!this.state.isLoadingNextPage && this.state.nextPage != null) {

      this.setState({
        isLoadingNextPage: true
      });

      var meta_obj = {};
      var new_arr = [];

      console.log(`api call ==> users?page=${this.state.nextPage}`)

      ServiceBackend.get(`users?page=${this.state.nextPage}`).then(
        (res) => {
          // console.log("response ==>"+JSON.stringify(res))
          new_arr = res.users;
          meta_obj = res.meta;
          
          for(var i =0; i< new_arr.length; i++){
            // arr_data.push.apply(arr_data, new_arr[i]);
            arr_data.push(new_arr[i])      
          }

          Promise.all(arr_data.map(e => {
            let u = new SelectableUser()
            return u.init(e);
          })).then(
            (myUsers)=>{
              WriteMessageStore.users = myUsers;

              this.setState({
                arr_contacts:WriteMessageStore.items,
              });
          
              setTimeout(() =>{
                this.setState({
                  dataSource: this.state.dataSource.cloneWithRows(WriteMessageStore.items )
                });
                
                var a = [];
                var b = [];
                for(var i=0; i< this.state.arr_contacts.length; i++){
                  a.push(JSON.stringify(i));
                  b.push(true)        
                }
                this.state.dataSource._dirtyRows = [b];
                this.state.dataSource._cachedRowCount = this.state.arr_contacts.length;
                this.state.dataSource.rowIdentities = [a];
                // console.log("new data_source ==>"+JSON.stringify(this.state.dataSource))

                this.setState({
                  dataSource: this.state.dataSource
                });
              },500); 
              
              this.setState({
                nextPage: meta_obj.next_page,
                isLoadingNextPage: false
              });

              // this.scrollToBottomList()
            },
            (errr)=>{}
          );
          

        },
        (err) => { 
          this.setState({
            isLoadingNextPage: false
          });
         }
      );

    }
  }

  scrollToBottomList(){
    this.refs.refScrollView.scrollToEnd({animated: true})
  }

  searchListView(){
    this.setState({
      arr_contacts:WriteMessageStore.items,
    });

    setTimeout(() =>{
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(WriteMessageStore.items )
      });
      
      var a = [];
      var b = [];
      for(var i=0; i< this.state.arr_contacts.length; i++){
        a.push(JSON.stringify(i));
        b.push(true)        
      }
      this.state.dataSource._dirtyRows = [b];
      this.state.dataSource._cachedRowCount = this.state.arr_contacts.length;
      this.state.dataSource.rowIdentities = [a];
      // console.log("new data_source ==>"+JSON.stringify(this.state.dataSource))

      this.setState({
        dataSource: this.state.dataSource
      });
    },500); 
  }

  showListView(){       

    return (
      <View
        style={{
          flex: 1,
        }}
      >       
  
        <InfiniteScroll
                  horizontal={false}  //true - if you want in horizontal              
                  distanceFromEnd={20} // distance in density-independent pixels from the right end
                >
                  <ListView
                  ref='refScrollView'
                  style={{ flex: 1,height:windowHeight - 140 }}
                  onContentSizeChange={() => {}}
                    onEndReached={() => { this.fetchNextData() }}
                    onEndReachedThreshold={20}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={(e) => <PeopleRow key={e.key} store={e} />}
                    renderFooter={
                      () => {
                        if (this.state.nextPage != null) {
                          return (
                            <View style={{ flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center' }}>
                              <ActivityIndicator size='large' />
                            </View>
                          )
                        } else {
                          return <View />;
                        }
                      }
                    }
                  />
                </InfiniteScroll>  
      </View>
    );
  }

  render(){
    let store = WriteMessageStore;
    return(
      <View>   
      <ToInput states = { this.state} fetchNextData={ this.fetchNextData()} searchListView={ this.searchListView() }/>   
      { this.showListView() }
      </View>
    )
  }

}

@observer
export class ToInput extends Component{

  constructor(props){
    super(props)
    this.state = {};
  }

  componentWillMount(){
    console.log("ToInput componentWillMount ==>"+JSON.stringify(this.props.states))
    this.setState(this.props.states);
  }

  render(){
    let store = WriteMessageStore;
    return(

      <View
      style = {{
        height: h(95),
        paddingHorizontal: h(28),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: h(1),
        borderBottomColor: '#D8D8D8'
      }}
    >
      <Text
        style = {{
          color: '#393939',
          fontSize: h(30),
          fontFamily: FONTS.MEDIUM,
          marginRight: h(15)
        }}

      >To: </Text>
      <TextInput
        style = {{
          fontSize: h(30),
          fontFamily: FONTS.MEDIUM
        }}
        text={store.inputText}
        onChangeText={
          text => {
            store.inputText = text;
            if(text.length <=0){
              this.setState({
                next_page: null,
                nextPage: 1,
                isLoadingNextPage: false,                
              });
              this.props.fetchNextData();
            }else{
              this.props.searchListView();
            }

          }}
        placeholder='Search'
        style={{
          flex: 1
        }}
      />
    </View>
    
    )
  }

}
