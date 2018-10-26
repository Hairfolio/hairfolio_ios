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
import {ListView} from 'react-native';
import BlackBookStore from '../../mobx/stores/BlackBookStore';
import ContactDetailsStore from '../../mobx/stores/ContactDetailsStore';
import AlphabetListView from 'react-native-alphabetlistview';
import NavigatorStyles from '../../common/NavigatorStyles';
import InfiniteScroll from 'react-native-infinite-scroll';
import ServiceBackend from '../../backend/ServiceBackend';
import Picture from '../../mobx/stores/Picture';

const Header = observer(({title}) => {
  let textStyle = {
    color: '#404040',
    fontFamily: FONTS.HEAVY,
    fontSize: h(34),
  };

  let viewStyle = {
    backgroundColor: '#F2F2F2',
    paddingLeft: h(32),
    alignItems: 'center',
    flexDirection: 'row',
    height: h(56)
  };

  return (
    <View style={viewStyle}>
      <Text style={textStyle}>{title}</Text>
    </View>
  );
});

const Cell = observer(({item, showBorder, navigator}) => {

  let borderStyle = {};

  if (!item.isLast || showBorder) {
    borderStyle = {
      borderBottomWidth: h(1),
      borderBottomColor: '#AAAAAA',
      borderStyle: 'solid'
    };
  }

  return (
    <TouchableHighlight
      underlayColor='#ccc'
      onPress={
        () => {
          ContactDetailsStore.init(item.data.id);
          navigator.push({
            screen: 'hairfolio.ContactDetails',
            navigatorStyle: NavigatorStyles.tab,
          })
        }
      }
      style={{
        paddingLeft: h(31),
      }}
    >
      <View
        style = {{
          flexDirection: 'row',
          alignItems: 'center',
          height: h(132),
          width: windowWidth - h(130),
          ...borderStyle
        }}
      >
        <Image
          style={{height: h(84), width: h(84), borderRadius: h(42)}}
          source={item.picture ? item.picture.getSource(84, 84) : require('../../../resources/img/stylist.png')}
        />
        <Text
          style = {{
            // backgroundColor:'pink',
            marginLeft: h(25),
            fontSize: h(34),
            fontFamily: FONTS.BOOK,
            color: '#404040',
          }}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </View>
    </TouchableHighlight>
  );
});

var arr_data = [];
var rows =[];
var sorted_arr = [];

class Contact {
  @observable name;
  @observable picture;

  @computed get startLetter() {
    return this.name.toUpperCase()[0];
  }

  constructor(obj) {
    this.data = obj;
    this.name = obj.first_name + ' ' + obj.last_name;
    this.key = v4();

    if (obj.asset_url) {
      let picObj = {uri: obj.asset_url, isStatic: true};
      this.picture = new Picture(
        picObj,
        picObj,
        null
      );
    }
  }
}

@observer
export default class BlackBookContent extends Component {  
  
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      next_page:null,
      nextPage:1,
      isLoadingNextPage:false,
      dataSource: ds,
      arr_contacts:[],
      pure_contacts :[],
      modified_contacts :[],
    };
    
    this.fetchNextData = this.fetchNextData.bind(this,this.state.isLoadingNextPage);
    
  }

  componentWillMount(){
    arr_data = [];
    rows =[];
    sorted_arr = [];
    console.log("componentWillMount ==>");
    this.fetchNextData()
  } 

  async fetchNextData() {

    if (!this.state.isLoadingNextPage && this.state.nextPage != null) {

      this.setState({
        isLoadingNextPage: true
      });

      var meta_obj = {};
      var new_arr = [];

      console.log(`api call ==> contacts?page=${this.state.nextPage}`)

      ServiceBackend.get(`contacts?page=${this.state.nextPage}`).then(
        (res) => {  
          
          res.contacts.map(e => rows.push(e));

          
          var arr = rows.map(e => new Contact(e));
          
          meta_obj = res.meta;

          console.log("arr ==>" + JSON.stringify(arr))

          if (arr.length > 0) {           
            let dict = {};
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(c => {
              let list = arr.map(e => e).filter(e => e.startLetter == c);
      
              if (list.length > 0) {
                list[list.length - 1].isLast = true;
                dict[c] = list;
              }
              // console.log("arr ==>" + JSON.stringify(dict))
              new_arr = dict;
            });
          }  

          if (arr) {

            arr_data = [];

            let data = new_arr;
            for (key in data) {
              var temp_obj = {
                [key]: data[key]
              };
              arr_data.push(temp_obj)
            }

            console.log("arr_data ==>" + JSON.stringify(arr_data))

            this.setState({
              modified_contacts: arr,
              pure_contacts: res.contacts,
              dataSource: this.state.dataSource.cloneWithRows(arr_data),
              nextPage: meta_obj.next_page,
              isLoadingNextPage: false,
              arr_contacts: arr_data
            });
          }

        },
        (err) => { 
          this.setState({
            isLoadingNextPage: false
          });
         }
      );

    }
  }

  renderSearchRow(store){    
      if (store.mode == 'search') {
        return (
          <View
            style = {{
              height: h(86),
              backgroundColor: '#C9C9CE',
              padding: h(15),
              flexDirection: 'row',
            }}
          >
            <View
              style = {{
                backgroundColor: 'white',
                flex: 1,
                justifyContent: 'center',
                borderRadius: h(14),
              }}
            >
              <View
                style = {{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: h(15)
                }}
              >
                <Image
                  style={{height: h(26), width: h(26)}}
                  source={require('img/search_icon.png')}
                />
                <TextInput
                  ref={input => store.input = input}
                  value={store.inputText}
                  onChangeText={
                    (t) => {
                      store.inputText = t;
                      if (t == '') {
                        this.setState({
                          dataSource: this.state.dataSource.cloneWithRows(this.state.arr_contacts)
                        });                        
                      }else{
                        this.renderContactList(t);
                      }          
                      }
                    }
                  style = {{
                    fontSize: h(30),
                    fontFamily: FONTS.BOOK,
                    marginLeft: h(16),
                    flex: 1,
                    paddingRight: h(15),
                    color: '#040404'
                  }}
                  placeholder='Search'
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={
                () => {
                  store.cancelSearchMode();
                  this.setState({
                          dataSource: this.state.dataSource.cloneWithRows(this.state.arr_contacts)
                  });  
                }
              }
              style = {{
                backgroundColor: '#3E3E3E',
                borderRadius: h(10),
                marginLeft: h(15),
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: h(10)
              }}
            >
              <Text
                style = {{
                  color: 'white',
                  fontSize: h(30),
                  fontFamily: FONTS.ROMAN,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    
      return (
        <TouchableWithoutFeedback
          onPress={
            () => store.startSearchMode()
          }
        >
          <View
            style = {{
              height: h(86),
              backgroundColor: '#C9C9CE',
              padding: h(15)
            }}
          >
            <View
              style = {{
                backgroundColor: 'white',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: h(14)
              }}
            >
              <View
                style = {{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Image
                  style={{height: h(26), width: h(26)}}
                  source={require('img/search_icon.png')}
                />
                <Text
                  style = {{
                    fontSize: h(30),
                    fontFamily: FONTS.BOOK,
                    color: '#8E8E93',
                    marginLeft: h(16)
                  }}
                >
                  Search
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
  }

  renderCell(data){

    let children = [];
  
    for (let key in data) {
      let child  = <Header key={'header-' + key} title={key} />;
      children.push(child);
  
      for (let item of data[key]) {

        children.push(
          <Cell
            item={item}
            key={item.key}
            navigator={this.props.navigator}
          />
        );
      }
      
      return ( <View>{children}</View>); 
    }    

  }

  loadMoreData(){
    setTimeout( ()=>{
      this.fetchNextData();
    }, 1500);
  }

  renderContactList(inputText){

    console.log("Before filter ==>"+JSON.stringify(this.state.modified_contacts))
    
    let arr = this.state.modified_contacts.filter(e => e.name.indexOf(inputText) > -1).map(e => e);
    
    console.log("After filter ==>"+JSON.stringify(arr));

    var new_arr =[];
    var filtered_arr =[];

    if (arr.length > 0) {           
      let dict = {};
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(c => {
        let list = arr.map(e => e).filter(e => e.startLetter == c);

        if (list.length > 0) {
          list[list.length - 1].isLast = true;
          dict[c] = list;
        }
        new_arr = dict;
      });

        let data = new_arr;              
        for (key in data) {
        var temp_obj = {
        [key]: data[key]
        };
        filtered_arr.push(temp_obj)
        } 

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(filtered_arr)
        });
    } 

    /* if (this.inputText == '') {
      return this.contacts;
    } else {
      let list = this.state.modified_contacts.filter(e => e.name.indexOf(inputText) > -1).map(e => e);

      return list;
    } */


     /* if (BlackBookStore.mode == 'search') {

      if (BlackBookStore.filteredContacts.length == 0) {
        return (
          <View style={{flex: 1}}>
            <Text
              style= {{
                paddingTop: h(38),
                fontSize: h(34),
                textAlign: 'center',
                fontFamily: FONTS.BOOK_OBLIQUE
              }}
            >
              No Results
            </Text>
          </View>
        );
      }
      return (
        <View style={{flex: 1}}>
          <ScrollView>
            {
              BlackBookStore.filteredContacts.map(e=>
                <Cell
                  showBorder={true}
                  key={e.key}
                  item={e}
                  navigator={this.props.navigator}
                />
              )
            }
          </ScrollView>
        </View>
      );
    } */

  }
  
  render() {
    let store = BlackBookStore;
    return (
      <View style={{ flex: 1 }}>
        
        {this.renderSearchRow(store)}

        <View>
          {
            (this.state.arr_contacts.length > 0) ?

              <InfiniteScroll
                horizontal={false}  //true - if you want in horizontal              
                distanceFromEnd={20} // distance in density-independent pixels from the right end
              >
                <ListView
                style={{ flex: 1,height:windowHeight - 140 }}
                  onEndReached={() => { this.loadMoreData() }}
                  onEndReachedThreshold={20}
                  enableEmptySections={true}
                  dataSource={this.state.dataSource}
                  renderRow={(p) => this.renderCell(p)}
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
              :
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    paddingTop: h(38),
                    fontSize: h(34),
                    textAlign: 'center',
                    fontFamily: FONTS.BOOK_OBLIQUE
                  }}
                >
                  No Results
            </Text>
              </View>
          }
        </View>
      </View>
    );
  }
}
