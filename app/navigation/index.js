import React, { Component } from 'react';
import { View,ImageBackground,TouchableOpacity,StatusBar,Platform,Image, ActivityIndicator,Text ,AsyncStorage,StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import imports from '../imports'
import {colors,api} from '../constants'
import { connect } from 'react-redux';
import {axios} from '../reuseableComponents/externalFunctions'
import { createDrawerNavigator } from '@react-navigation/drawer';
import SideDrawer from './sidedrawer'
import  Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import { color } from 'react-native-reanimated';
import moment from 'moment'
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


class App extends Component {
  state = { isLoggingIn:true, isLoggedIn:false }
  componentDidMount=async()=>{

    const token = await AsyncStorage.getItem("token")
    if(token){
      axios('get',api.get_user,null,true)
      .then(async({data})=>{
        if(data.error){
            this.setState({isLoggingIn:false})
            return
        }
        this.props.dispatch({type:"SET_USER",data:data.user})
        this.setState({isLoggingIn:false})

      })
      .catch(x=>{
          this.setState({isLoggingIn:false})
          console.log(x)
      })
    }else{
      setTimeout(async()=>{
        this.setState({isLoggingIn:false})
      },3000 )
    }
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
blue_header=(props)=>{
  const parent_props=this.props
  const {navigation} = props
  const {params} = props.route
  return({
    headerTransparent:false,   
    header:props=>
    <ImageBackground resizeMode="cover" source={require('../images/header_gradient.png')} style={{width:"100%",height:150}} imageStyle={{borderBottomEndRadius:30,borderBottomLeftRadius:30,}}>  
        <StatusBar barStyle="light-content"/> 
        <View style={{paddingHorizontal:30,paddingTop:50}}>
          {parent_props.isLoggedIn&&
              <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
                <Text style={[styles.headerTitle,{marginHorizontal:-10,marginBottom:5}]}>
                  <Icon name="dots-vertical" size={24} color={colors.white}/>
                </Text>
              </TouchableOpacity>
            }
            <Text style={{fontSize:20 ,color:colors.white}}>{params.title}</Text>
            <Text style={{color:colors.white,fontSize:14}}>{params.subtitle}</Text>
          </View>
        </ImageBackground>,
    })
}
  auth_routes = ()=>{
    return(
      <>
        <Stack.Screen name="authentication" component={imports.Authentication} options={{
          headerShown:false
          }} />
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
        <Stack.Screen name="booking_details" component={imports.player.booking_details} options={this.header}/>
        <Stack.Screen name="booking_history" component={imports.player.booking_history} options={{headerShown:false}}/>
        <Stack.Screen name="become_a_vendor" component={imports.player.become_a_vendor} initialParams={{title:"Become A Vendor", subtitle: "Vendor Registeration Form"}} options={this.blue_header}/>
        <Stack.Screen name="arena_info" component={imports.player.arena_info} initialParams={{title:"Arena ", subtitle: ""}} options={this.blue_header}/>
        <Stack.Screen name="booking_request_recieved" component={imports.player.booking_request_recieved} options={{headerShown:false}} />
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
        <Stack.Screen name="booking_details" component={imports.vendor.booking_details} options={this.header}/>
        <Stack.Screen name="profile" component={imports.vendor.profile} options={this.header}/>
      </>
    )
  }
 
  routes=()=>{
    if(!this.props.isLoggedIn){
      return this.auth_routes()
    }else {
      return (
        <Stack.Screen name="drawer"  options={{headerShown:false}}  >
          {this.drawer}
        </Stack.Screen>
      )
    }
    
  }
  container_for_all_routes=(props)=>(
    <Stack.Navigator  screenOptions={{headerTransparent:true}}>
      {this.props.user.isVendor ? 
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
      <Stack.Navigator initialRouteName="home" screenOptions={{headerTransparent:true}}>
          {this.state.isLoggingIn?
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
      axios('get',api.get_active_request,null,true)
      .then(async({data})=>{
        if(data.error){
            return
        }
        this.props.dispatch({type:"SET_ACTIVE_REQUEST",data:data.request})
      })
      .catch(x=>{
          console.log(x)
      })
    }
  }
  render() {
    return (
      this.props.activeBooking?
      <TouchableOpacity style={styles.activeRequest}>
        <View style={styles.row}>
          <Text style={{fontWeight:"bold"}}> {this.props.activeBooking.arena.name} </Text>
          <MIcon name="keyboard-arrow-up" color={colors.black} size={18}/>
        </View>
        <View style={styles.row}>
          <Text style={{color:colors.grey}}> {this.props.activeBooking.arena.location} </Text>
          <Text style={{color:colors.grey}}> {moment(this.props.activeBooking.from_time).format("hh:mm a")} - {moment(this.props.activeBooking.to_time).format("hh:mm a")} </Text>
        </View>
      </TouchableOpacity>
      :null
    )
  }
}

