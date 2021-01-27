import React, { Component } from 'react'
import  { Text, RefreshControl,TouchableOpacity,FlatList , View, ScrollView,StyleSheet,Image,TextInput, ImageBackground, ActivityIndicator, Platform, Dimensions} from 'react-native'
import Button from '../../reuseableComponents/button'
import { colors, api } from '../../constants'
// import MapView from 'react-native-maps'
import {axios} from '../../reuseableComponents/externalFunctions'
import DatepickerRange,{SingleDatepicker} from '../../reuseableComponents/react-native-range-datepicker';
import moment from 'moment'
import { color } from 'react-native-reanimated'
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-easy-toast'
import Rating from 'react-native-star-rating'
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default class SportsMenu extends Component {
    state={
       isLoading:false,
       arena:{

       }
    }

    componentDidMount = ()=> {
        this.setState({isLoading:true})
        axios('get',api.arena_booking_requests,null,true)
        .then(({data})=>{
            this.setState({isLoading:false})
            if(data.error){
                this.refs.toast.show(data.msg)
                return
            }
            this.props.dispatch({type:"MY_ARENA_BOOKING_REQUESTS",data:data.requests??[]})
            if(data.active_request){
                this.props.dispatch({type:"SET_ACTIVE_REQUEST",data:data.active_request})
            }
        })  
        .catch(e=>{
            console.log(e)
            this.setState({isLoading:false})
        })
    }
   
    
    submit=()=>{
        const {booking} = this.props
        this.setState({isSubmitting:true})
        const params={
            arena_booking_request:{
                from_time: moment(booking.date).format("YYYY-MM-DD ")+moment(booking.from_time).format("HH:mm"),
                to_time: moment(booking.date).format("YYYY-MM-DD ")+moment(booking.to_time).format("HH:mm")
            }
        }
        axios('post',api.book_arena(this.props.booking.arena_id),params,true)
        .then(({data})=>{
            this.setState({isSubmitting:false})
            if(data.error){
                alert(data.msg)
                this.setState({showModal:true})
                return
            }
            this.props.navigation.navigate("booking_request_recieved")
        })
        .catch(e=>{
            this.setState({isSubmitting:false})
            console.log(e)
        })
    }
    render() {
        return (
            <>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
                <ScrollView contentContainerStyle={styles.root} refreshControl={<RefreshControl refreshing={this.state.isLoading}/>}>
                    <Text style={styles.title}>My Bookings</Text>
                    <View style={styles.header}>
                        <Text style={{fontSize:12}}>Active Booking</Text>
                    </View>
                    {this.props.activeBooking ? 
                        <Item showButton={false} showPrice={false} style={{borderBottomWidth:0}} data={this.props.activeBooking} /> 
                        :
                        <Text style={{color:colors.grey,textAlign:"center"}}>No Active Request</Text>
                    }
                    <View style={styles.header}>
                        <Text style={{fontSize:12}}>Past Booking</Text>
                    </View>
                    {(this.props.user.arena_booking_requests??[]).map(x=>
                        <Item data={x} /> 
                    )}
                    </ScrollView>
            </>
        )
    }
}

export class Item extends Component {
    render() {
        const {data} = this.props
        return (
            <View style={[styles.arena_container,this.props.style]}>
                <View>
                    <Text style={{fontWeight:"bold"}}>{data.arena.name}</Text>
                    <Text style={styles.arena_detail}>{data.arena.name}</Text>
                    <Text style={styles.arena_detail}>Time Slot {moment(data.from_time).format("hh:mm a")} to {moment(data.to_time).format("hh:mm a")}</Text>
                </View>
                <View>
                    {(this.props.showPrice??true)&&<Text style={{color:colors.grey,textAlign:"right"}}>Rs {data.price}</Text>}
                    {(this.props.showButton??true)&&<Button placeholder={"REBOOK"} onPress={this.searchByAvailability} style={styles.arenaButton} placeholderStyle={{fontSize:10}} />}

                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    title:{
        color:colors.grey,
        fontSize:16
    },
    arena_container:{
        marginVertical:0,
        paddingVertical:10,
        borderBottomWidth:0.5,
        borderColor:colors.grey,
        flexDirection:"row",
        justifyContent:"space-between",paddingHorizontal:5
    },
    arena_detail:{
        fontSize:12,
        color:colors.grey
    },
    header:{
        backgroundColor:colors.light_grey3,
        paddingHorizontal:10,
        paddingVertical:5,
        marginVertical:10
    },
    root:{
        flexGrow:1,
        padding:20,
        paddingTop:40,
        // paddingHorizontal:30,
        alignItems:"stretch",
    },   
    
    arenaButton:{borderRadius:4,height:25,marginTop:5,width:70,backgroundColor:colors.blue,alignSelf:"center"}
})