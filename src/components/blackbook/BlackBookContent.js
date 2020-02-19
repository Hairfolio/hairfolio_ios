import { ActivityIndicator, Component, computed, FONTS, h, Image, observable, observer, React, Text, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, v4, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';
import { ListView } from 'react-native';
import InfiniteScroll from 'react-native-infinite-scroll';
import ServiceBackend from '../../backend/ServiceBackend';
import NavigatorStyles from '../../common/NavigatorStyles';
import BlackBookStore from '../../mobx/stores/BlackBookStore';
import ContactDetailsStore from '../../mobx/stores/ContactDetailsStore';
import CreateLogStore from '../../mobx/stores/CreateLogStore';
import Picture from '../../mobx/stores/Picture';
import { showLog } from '../../helpers';
import { COLORS } from '../../style';

const Header = observer(({title}) => {
  let textStyle = {
    color: COLORS.SEARCH_LIST_ITEM_COLOR,
    fontFamily: FONTS.HEAVY,
    fontSize: h(34),
  };

  let viewStyle = {
    backgroundColor: COLORS.LIGHT5,
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
      borderBottomColor: COLORS.GRAY,
      borderStyle: 'solid'
    };
  }

  return (
    <TouchableHighlight
      underlayColor={COLORS.ABOUT_SEPARATOR}
      onPress={
        () => {
          ContactDetailsStore.isScreenPop = false;
          ContactDetailsStore.init(item.data.id);
          CreateLogStore.isNoteCreated = false;
          navigator.push({
            // screen: 'hairfolio.ContactDetails',
            screen: 'hairfolio.ClientDetails',//'hairfolio.ContactDetails',
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
          defaultSource={require('img/stylist.png')}
          source={(item.picture) ? item.picture.getSource(84, 84) : require('../../../resources/img/stylist.png')}
        />
        <Text
          style = {{
            marginLeft: h(25),
            fontSize: h(34),
            fontFamily: FONTS.BOOK,
            color: COLORS.SEARCH_LIST_ITEM_COLOR,
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
    

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    showLog("EVENT ID Blackbook content ==> " + event.id )
    if (event.id == 'willAppear') {
      CreateLogStore.isNoteCreated = false;
    } else if(event.id == 'didAppear') {
      this.setState({
        nextPage: 1
      }, () => {
        this.fetchNextData()
      })
    } else if(event.id == 'didDisappear') {
      if(this.state.nextPage == 1) {
        this.setState({
          dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        })
        arr_data = [];
        rows = [];
      }
    }
  }

  componentWillMount() {
    // alert('componentWillMount')
    arr_data = [];
    rows = [];
    // setTimeout(() => {      
      // this.fetchNextData()
    // },1000)
  } 

  // shouldComponentUpdate(nextProps, nextState) {
  //   alert('shouldComponentUpdate' + JSON.stringify(nextProps) + "   " + JSON.stringify(nextState))
  //   return true;
  // }

  async fetchNextData() {
    showLog("!this.state.isLoadingNextPage ==> " + !this.state.isLoadingNextPage + " this.state.nextPage" + this.state.nextPage)
    if (!this.state.isLoadingNextPage && this.state.nextPage != null) {

      this.setState({
        isLoadingNextPage: true
      });
      if(this.state.nextPage == 1) {
        showLog("INSIDE REMOVING ALL");
        this.setState({
          dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        })
        arr_data = [];
        rows = [];
      }

      var meta_obj = {};
      var new_arr = [];

      showLog(`api call ==> contacts?page=${this.state.nextPage}`)

      ServiceBackend.get(`contacts?page=${this.state.nextPage}`).then(
        (res) => {  
          // rows = [];
          res.contacts.map(e => rows.push(e));

          
          var arr = rows.map(e => new Contact(e));
          
          meta_obj = res.meta;

          showLog("arr ==>" + JSON.stringify(arr))

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

            showLog("arr_data ==>" + JSON.stringify(arr_data))
            showLog("arr_data length==>" + this.state.arr_contacts.length)
            // this.setState({ arr_contacts: [] }, () => {   
              // alert('hi')
              this.setState({              
                modified_contacts: arr,
                pure_contacts: res.contacts,
                dataSource: this.state.dataSource.cloneWithRows(arr_data),
                nextPage: meta_obj.next_page,
                isLoadingNextPage: false,
                arr_contacts: arr_data
              });
            // })

            showLog("arr_data length==>1 " + this.state.arr_contacts.length)
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
              backgroundColor: COLORS.LIGHT6,
              padding: h(15),
              flexDirection: 'row',
            }}
          >
            <View
              style = {{
                backgroundColor: COLORS.WHITE,
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
                    color: COLORS.BLACK1
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
                backgroundColor: COLORS.DARK3,
                borderRadius: h(10),
                marginLeft: h(15),
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: h(10)
              }}
            >
              <Text
                style = {{
                  color: COLORS.WHITE,
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
              backgroundColor: COLORS.LIGHT6,
              padding: h(15)
            }}
          >
            <View
              style = {{
                backgroundColor: COLORS.WHITE,
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
                    color: COLORS.PLACEHOLDER_SEARCH_FIELD,
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
    setTimeout(() => {
      // alert('loadMoreData')
      this.fetchNextData();
    }, 1500);
  }

  componentWillUnmount() {
    // alert('componentWillUnmount')
    // arr_data = [];
    // rows = [];
    // this.setState({arr_contacts:[]})
  }

  renderContactList(inputText){

    showLog("Before filter ==>"+JSON.stringify(this.state.modified_contacts))
    
    let arr = this.state.modified_contacts.filter(e => e.name.indexOf(inputText) > -1).map(e => e);
    
    showLog("After filter ==>"+JSON.stringify(arr));

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

                {/* {(!this.state.isLoadingNextPage) 
                  ?
                <View style= {{marginHorizontal: windowWidth/2.5,
                  paddingTop: h(38),
                  }}>
                <TouchableOpacity
                  
                  onPress={() => {this.setState({
                    nextPage: 1
                  }, () => {
                    this.fetchNextData()
                  })}}
                >
                  <Text style={{ fontSize: h(34),
                    textAlign: 'center',
                    fontFamily: FONTS.BOOK,
                    backgroundColor: COLORS.DARK,
                    color: COLORS.WHITE
                  }}>
                    {'retry'}
                  </Text>
                </TouchableOpacity>
                  </View>
                :
                  null
                } */}

                {(this.state.isLoadingNextPage) 
                  ?
                    (<View style={{ flex: 1, paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}>
                      <ActivityIndicator size='large' />
                    </View>)
                  :
                    null
                }
              
              </View>
          }
        </View>
      </View>
    );
  }
}
