import React, { Component } from 'react';
import { View,Linking,ImageBackground,TouchableOpacity,StatusBar,Platform,Image, ActivityIndicator,Text ,AsyncStorage,StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import imports from '../imports'
import {colors,api,notification_types} from '../constants'
import { connect } from 'react-redux';
import {axios,trim} from '../reuseableComponents/externalFunctions'
import { createDrawerNavigator } from '@react-navigation/drawer';
import SideDrawer from './sidedrawer'
import  Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { color } from 'react-native-reanimated';
import moment from 'moment'
import messaging from '@react-native-firebase/messaging';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Toast from 'react-native-easy-toast'
import {URLSearchParams} from '@visto9259/urlsearchparams-react-native';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const fetch_request_list = (props)=>axios('get',api.pending_requests,null,true)
  .then(async({data})=>{
      if(!data.error){
        props.dispatch({type:"SET_SCREEN", key:'pending_booking_requests' , data:data.requests??[]})
      }
  }).catch(x=>console.log(x,"error in notification recieved"))

export const get_active_request = (props)=>axios('get',api.get_active_request,null,true)
  .then(async({data})=>{
    if(data.error){
        return
    }
    props.dispatch({type:"SET_ACTIVE_REQUEST",data:data.request})
  })
.catch(x=>console.log(x))

export const join_team = ({props,token})=>{
  console.log(props)
  axios('get',api.join_team(token),null,true)
  .then(async({data})=>{
    if(data.error){
        alert(data.msg)
        return
    }
    props.navigationRef().navigate('done',{text:"Team joined"})
  })
  .catch(x=>console.log(x))
}


class App extends Component {
  state = { isLoggingIn:true, isLoggedIn:false }
  handleOpenURL=event=>{
    var params =  event.url.split('?')[1]
    if(params){
      var query = new URLSearchParams(params)
      var token = query.get('token')
      if (token){
        join_team({token,props:this.props})
      }
    }
  }
  componentDidMount=()=>{

    // this.handleOpenURL({url:"sportsdrive:team/?token=eyJhbGciOiJIUzI1NiJ9.eyJ0ZWFtX2lkIjoyM30.CdoRV-Y2Ab53RbuMB-0_AmtTJ5mV3buekHt21ZgjMBE"})
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.navigate(url);
      });
    } else {
        Linking.addEventListener('url', this.handleOpenURL);
    }
    
    let callback = (message) => {
      if(message.data.type == notification_types.BOOKING_REQUEST_RECIEVED){
        fetch_request_list(this.props)
      }
      if(message.data.type == notification_types.BOOKING_REQUEST_ACCEPTED){
        get_active_request(this.props)
      }

    }
    this.unsub_on_message = messaging().onMessage(callback);
    this.unsub_on_notif_opened = messaging().onNotificationOpenedApp(callback)
    messaging().getInitialNotification().then(callback)
    // messaging().setBackgroundMessageHandler(callback)
  }
  componentWillUnmount=()=>{
    console.log("unsub")
    this.unsub_on_message()
    this.unsub_on_notif_opened()
    Linking.removeEventListener('url', this.handleOpenURL);

  }
 header=({navigation})=>{
  const parent_props=this.props
  return({
    headerTitle:props=><Image source={require('../images/authentication_logo.png')} style={{width:120,height:undefined, aspectRatio:1753/1224,marginTop:50,alignSelf:"center"}}/>,
    headerStyle:{elevation: 0,shadowOpacity: 0,borderBottomWidth: 0},    
    headerRight:props=>{
      return(
        <>
         {parent_props.isLoggedIn&&
            <TouchableOpacity onPress={()=>navigation.navigate("profile")}>
              <StatusBar translucent={true} barStyle="light-content" /> 

              <Text style={styles.headerTitle}>
                Hi, {parent_props.user.first_name}
              </Text>
            </TouchableOpacity>
          }
        </>
        )},
    headerLeft:props=>{
      return(
        <>
          {parent_props.isLoggedIn&&
                // <TouchableOpacity onPress={()=>this.logout(parent_props)}>
              <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
                <Text style={styles.headerTitle}>
                  <Icon name="dots-vertical" size={24} color={colors.white}/>
                </Text>
              </TouchableOpacity>
            }
        </>
        )}
  })
}
 blue_header=({navigation,route})=>{
  const parent_props=this.props
  const {params} = route
  return({
    // headerTransparent:!true,
    headerStyle:{height:80},
    headerBackground:props=><View style={{elevation: 0,shadowOpacity: 0,borderBottomWidth: 0,paddingHorizontal:20,backgroundColor:colors.blue,flex:1,borderBottomLeftRadius:20, borderBottomRightRadius:20}}></View>,
    headerTitle:props=><View style={{alignItems:"center"}}>
            <Text style={{fontSize:16 ,color:colors.white}}>{params.title}</Text>
            {params.subtitle?.length>0&&<Text style={{color:colors.white,fontSize:12,textAlign:"center"}}>{params.subtitle}</Text>}
      </View>,
    headerRight:props=>{
      return(
        <>
         {parent_props.isLoggedIn&&
            <TouchableOpacity onPress={()=>navigation.navigate("profile")}>
              <StatusBar translucent={true} barStyle="light-content" /> 

              <Text style={styles.headerTitle}>
                Hi, {parent_props.user.first_name}
              </Text>
            </TouchableOpacity>
          }
        </>
        )},
    headerLeft:props=>{
      return(
        <>
          {parent_props.isLoggedIn&&
                // <TouchableOpacity onPress={()=>this.logout(parent_props)}>
              <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
                <Text style={styles.headerTitle}>
                  <FontAwesome name="bars" size={18} color={colors.white}/>
                </Text>
              </TouchableOpacity>
            }
        </>
        )}
  })
}
// blue_header=(props)=>{
//   const parent_props=this.props
//   const {navigation} = props
//   return({
//     headerTransparent:false,  
//     headerStyle:{height:150,backgroundColor:colors.blue,padding:0},
//     headerTitleContainerStyle:{height:"100%",width:"100%"},
//     headerLeft:null,
//     headerTitle:props=>
//     <ImageBackground resizeMode="cover" source={require('../images/header_gradient.png')} style={{width:"100%",marginLeft:Platform.OS=='ios'? 0 : -15,height:150}} imageStyle={{borderBottomRightRadius:30,borderBottomLeftRadius:30,}}>  
//         <StatusBar translucent={true} barStyle="light-content" /> 
//         <View style={{paddingHorizontal:30,paddingTop:50}}>
//           {parent_props.isLoggedIn&&
//               <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
//                 <Text style={[styles.headerTitle,{marginHorizontal:-10,marginBottom:5}]}>
//                   <Icon name="dots-vertical" size={24} color={colors.white}/>
//                 </Text>
//               </TouchableOpacity>
//             }
//             <Text style={{fontSize:20 ,color:colors.white}}>{params.title}</Text>
//             <Text style={{color:colors.white,fontSize:14}}>{params.subtitle}</Text>
//           </View>
//         </ImageBackground>,
//     })
// }
  auth_routes = ()=>{
    return(
      <>
        <Stack.Screen name="authentication" component={imports.Authentication} options={{headerShown:false}} />
        <Stack.Screen name="sign_up" component={imports.signup} options={this.header}/>
        <Stack.Screen name="sign_in" component={imports.signin} options={this.header}/>
    </>
    )
  }
  common_screens=()=>{
    return(
      <>

        <Stack.Screen name="home" component={imports.home} options={this.header} />
        <Stack.Screen name="update_profile" component={imports.update_profile} options={this.header}/>
        <Stack.Screen name="update_about" component={imports.update_about} options={this.header}/>
        <Stack.Screen name="update_featured" component={imports.update_featured} options={this.header}/>
        <Stack.Screen name="done" component={imports.done} options={this.header}/>
      </>
    )
  }
  player_logged_in_routes = ()=>{
    return(
      <>
        {this.common_screens()}
        <Stack.Screen name="sports_menu" component={imports.player.sports_menu} options={this.header}/>
        <Stack.Screen name="booking_search" component={imports.player.booking_search} options={this.header}/>
        <Stack.Screen name="debug" component={imports.player.debug} options={{headerTransparent:false}}/>
        <Stack.Screen name="booking_details" component={imports.player.booking_details} options={this.header}/>
        <Stack.Screen name="booking_history" component={imports.player.booking_history} options={{headerShown:false}}/>
        <Stack.Screen name="join_friends_team" component={imports.player.join_friends_team.index} initialParams={{title:"Join a friends team"}} options={this.header}/>
        <>
        {this.props.teams.length>0?
          <Stack.Screen name="create_team" initialParams={{title:"Make Your Own Team"}} component={imports.player.create_team.invite_to_team} options={this.blue_header}/>
          :
          <Stack.Screen name="create_team" initialParams={{title:"Make Your Own Team"}} component={imports.player.create_team.index} options={this.blue_header}/>
        }
        </>
          {this.props.user.vendor_detail?
            <Stack.Screen name="become_a_vendor" component={imports.player.vendor_request_recieved}  options={{headerShown:false}}/>
            :
            <>
              <Stack.Screen name="become_a_vendor" component={imports.player.become_a_vendor} initialParams={{title:"Become A Vendor", subtitle: "Vendor Registeration Form"}} options={this.blue_header}/>
              <Stack.Screen name="arena_info" component={imports.player.arena_info} initialParams={{title:"Arena ", subtitle: ""}} options={this.blue_header}/>
              <Stack.Screen name="select_sports" component={imports.player.select_sports} initialParams={{title:"Become A Vendor", subtitle: "Select Sports"}} options={this.blue_header}/>
            </> 
          }
        <>
          {
            this.props.activeBooking && this.props.activeBooking.status == "Accepted"?
              <Stack.Screen name="booking_request_recieved" component={imports.player.booking_request_accepted} options={{headerShown:false}} />
            :
              <Stack.Screen name="booking_request_recieved" component={imports.player.booking_request_recieved} options={{headerShown:false}} />
          }
        </>
        <Stack.Screen name="profile" component={imports.player.profile} options={this.header}/>
      </>
    )
  }
  
  vendor_logged_in_routes = ()=>{
    return(
      <>
        {this.common_screens()}
        <Stack.Screen name="sports_menu" component={imports.vendor.sports_menu} options={this.header} />
        <Stack.Screen name="register_arena" component={imports.vendor.register_arena} options={this.header}/>
        <Stack.Screen name="arena_details" component={imports.vendor.arena_details} options={this.header}/>
        <Stack.Screen name="profile" component={imports.vendor.profile} options={this.header}/>
        <Stack.Screen name="my_arenas" component={imports.vendor.my_arenas} initialParams={{title:"My Arenas"}} options={this.blue_header}/>
        <Stack.Screen name="group_pricing" component={imports.vendor.group_pricing} options={this.blue_header}/>
        <Stack.Screen name="booking_calendar" options={this.blue_header} initialParams={{title:"Select Date"}} component={imports.vendor.booking_calendar.calendar} />
        <Stack.Screen name="view_order" options={this.blue_header} initialParams={{title:"Invoice Details"}} component={imports.vendor.my_orders.view_order} />
        <Stack.Screen name="my_earnings" options={this.blue_header} initialParams={{title:"My Earnings"}} component={imports.vendor.my_earnings.index} />
        <Stack.Screen name="booking_slots" options={props=>({...this.blue_header(props),headerTransparent:false})} initialParams={{title:"Ground"}}>
              {()=><Tab.Navigator tabBarOptions={{tabStyle:{fontSize:11}}}>
                    <Tab.Screen name="Time Slots (Booked)" component={imports.vendor.booking_calendar.time_slots} />
                    <Tab.Screen name="Time Slots (Blocked)" component={imports.vendor.booking_calendar.time_slots} />
                    <Tab.Screen name="Price Per Hour" component={imports.vendor.booking_calendar.price_slots} />
                  </Tab.Navigator>
              }
        </Stack.Screen>
        <Stack.Screen name="my_orders" options={props=>({...this.blue_header(props),headerTransparent:false})} initialParams={{title:"My Orders"}}>
              {()=><Tab.Navigator tabBarOptions={{tabStyle:{fontSize:11}}}>
                    <Tab.Screen name="Upcoming" component={imports.vendor.my_orders.index} />
                    <Tab.Screen name="Past" component={imports.vendor.my_orders.index} />
                  </Tab.Navigator>
              }
        </Stack.Screen>
      </>
    )
  }
 
  routes=()=>{
    if(!this.props.isLoggedIn){
      return this.auth_routes()
    }else {
      return (
        this.props.pending_booking_requests.length>0 ?
        <>
          <Stack.Screen name="pending_booking_requests" component={imports.vendor.pending_booking_requests.index} options={{headerShown:false}}/>
          <Stack.Screen name="show_pending_booking_requests" component={imports.vendor.pending_booking_requests.show} options={{headerShown:false}}/>
        </>
        :
        // <>
          // {this.props.pending_booking_requests.length==0&&
          <Stack.Screen name="drawer"  options={{headerShown:false}}  >
            {this.drawer}
          </Stack.Screen>
          // }
        // </>
      )
    }
    
  }
  container_for_all_routes=(props)=>(
    <Stack.Navigator  screenOptions={{headerTransparent:true}}>
      {this.props.current_view=="vendor" ? 
          this.vendor_logged_in_routes()
        :
          this.player_logged_in_routes()
      }
    </Stack.Navigator>
  )
  drawer = ()=>(
    <Drawer.Navigator drawerContent={(props) => <SideDrawer {...props} {...this.props}/>} >
        <Drawer.Screen name="app" >
            {
              this.container_for_all_routes
            }
        </Drawer.Screen>
    </Drawer.Navigator>
  )
  render() {
    return ( 
      <>
                <Toast 
                        ref="toast"
                        position='bottom'
                        positionValue={300}
                    />
      <Stack.Navigator initialRouteName="home" screenOptions={{headerTransparent:true}}>
          {this.props.isLoggingIn?
            <Stack.Screen name="splash" component={imports.splash} options={{headerShown:false}} />
          :
           this.routes()
            
          }
      </Stack.Navigator> 
      <ActiveBooking {...this.props}  navigation={this.props.navigationRef()} />
      </>
    );
  }
}
export default connect(state=>state)(App)
const styles=StyleSheet.create({
  headerTitle:{
    fontSize:10,
    color:colors.white,
    marginHorizontal:15
  },
  activeRequest:{
    // position:"absolute",
    // zIndex:10,
    // bottom:0,
    backgroundColor:colors.white,
    // borderTopEndRadius:10,
    // borderTopLeftRadius:10,
    width:"100%",
    padding:10
  },
  row:{
    justifyContent:"space-between",flexDirection:"row",alignItems:"center"
  }
})

class ActiveBooking extends Component {
  componentDidMount=async()=>{
    const token = await AsyncStorage.getItem("token")
    if(token){
      get_active_request(this.props)
    }
  }
  render() {
    return (
      this.props.activeBooking&&["Accepted","Pending"].includes(this.props.activeBooking.status)&&this.props.current_view=="player"&&this.props.pending_booking_requests.length==0?
      <TouchableOpacity style={styles.activeRequest} onPress={()=>this.props.navigation.navigate('booking_request_recieved')}>
        <View style={styles.row}>
          <Text style={{fontWeight:"bold"}}> {this.props.activeBooking.arena.name} </Text>
          <MIcon name="keyboard-arrow-up" color={colors.black} size={18}/>
        </View>
        <View style={styles.row}>
          <Text style={{color:colors.grey}}> {trim(this.props.activeBooking.arena.location?.address,20)} </Text>
          <Text style={{color:colors.grey}}> {moment(this.props.activeBooking.from_time).format("hh:mm a")} - {moment(this.props.activeBooking.to_time).format("hh:mm a")} </Text>
        </View>
      </TouchableOpacity>
      :null
    )
  }
}

