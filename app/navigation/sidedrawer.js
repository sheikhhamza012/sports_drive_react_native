import React, { Component } from 'react'
import { Text,TouchableOpacity, View ,SafeAreaView,ScrollView,StyleSheet,AsyncStorage} from 'react-native'
import { colors } from '../constants'
import {CommonActions} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

export default class sidedrawer extends Component {
    routes=[]
    
    
    constructor(props){
        super(props)
        this.routes.push({route:"home",title:"Home"})
        if(this.props.current_view=="vendor"){
            this.routes.push({route:"profile",title:"My Profile"})
            this.routes.push({route:"my_arenas",title:"My Arena"})
            // this.routes.push({route:"profile",title:"My Earnings"})
            // this.routes.push({route:"profile",title:"My Orders"})
            this.routes.push({route:"my_earnings",title:"My Earnings"})
            this.routes.push({route:"my_orders",title:"My Orders"})
            if(this.props.user.vendor_detail?.request_status == "approved" ){
                this.routes.push({route:()=>this.switch("player"),title:"Switch to Playing"})
            }
            this.routes.push({route:"profile",title:"Contact Us"})
        }

        if(this.props.current_view=="player"){
            this.routes.push({route:"debug",title:"About Us"})
            this.routes.push({route:"profile",title:"My Profile"})
            this.routes.push({route:"booking_history",title:"My Bookings"})
            if(!this.props.user.vendor_detail || this.props.user.vendor_detail.request_status == "pending"){
                this.routes.push({route:"become_a_vendor",title:"Become a Vendor"})
            }
            if(this.props.user.vendor_detail?.request_status == "approved" ){
                this.routes.push({route:()=>this.switch("vendor"),title:"Switch to Hosting"})
            }
            this.routes.push({route:"home",title:"Add a Payment Method"})
        }
        
        this.routes.push({route: ()=>this.logout() ,title:"Log Out"})
        this.routes.push({route:"home",title:"Help"})
       
        
    }
    logout=async(props)=>{
        await AsyncStorage.clear();
        this.props.dispatch({type:"LOGOUT",data:this.props.user.id})
    }
    switch=(str)=>{
        this.props.dispatch({type:"SET_SCREEN",key:"isLoggingIn",data:true})
        this.props.dispatch({type:"SET_SCREEN",key:"current_view",data:str})
    }
    
    render() {
        return (
            <SafeAreaView style={{flex:1,marginHorizontal:35}}>
                <ScrollView style={{flex:1}} contentContainerStyle={styles.container}>
                    {
                        this.routes.map((x,i)=>                            
                            <TouchableOpacity key={i} style={styles.item} onPress={()=>{
                                    if (typeof x.route=="string"){
                                        this.props.navigation.navigate(x.route)
                                    }else{
                                        x.route()
                                    }
                                    this.props.navigation.closeDrawer()
                                }} >
                                <Text style={styles.item_text}>{x.title}</Text>
                            </TouchableOpacity>
                        )
                    }

                </ScrollView>
                <View style={styles.footer}>
                    <Text style={styles.terms}>Terms & Conditions</Text>
                    <Text style={styles.terms}>FAQs</Text>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    terms:{fontSize:11,color:colors.dark_grey},
    item_text:{color:colors.dark_grey,fontSize:12},
    footer:{paddingVertical:30,flexDirection:"row",justifyContent:"space-between"},
    container:{
        flexGrow:1,
        paddingTop:40,
    },
    item:{
        paddingVertical:10,
        borderBottomWidth:0.5,
        borderColor:colors.light_grey2,
        marginBottom:10
    }
})