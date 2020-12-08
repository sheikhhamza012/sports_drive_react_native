import React, { Component } from 'react'
import  { Text, RefreshControl , View, ScrollView,StyleSheet,Image,TextInput, ImageBackground, ActivityIndicator, Platform} from 'react-native'
import Button from '../../reuseableComponents/button'
import { colors, api } from '../../constants'
import { TouchableOpacity } from 'react-native-gesture-handler'
// import MapView from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {axios} from '../../reuseableComponents/externalFunctions'
import DatepickerRange,{SingleDatepicker} from '../../reuseableComponents/react-native-range-datepicker';
import moment from 'moment'
import { color } from 'react-native-reanimated'
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-easy-toast'

export default class SportsMenu extends Component {
    state={
        params:this.props.route.params??{calender:true},
        showModal:true
    }

    componentDidMount = ()=> {
        const unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({showModal:true})

        });

    }
   
    next=(params=undefined)=>{
            this.props.navigation.push('booking_details',params)
    }

    renderCalender = ()=>{
        const next = (min,max)=>{
            if(!min) return
            this.props.dispatch({type: "SET_BOOKING_PARAMS_DATE",data:{from:moment(min).format('YYYY-MM-DD HH:mm:ss'),to:max ? moment(max).format('YYYY-MM-DD HH:mm:ss'): null}})
            this.next({from_time:true})
        }
        return(
            <DatepickerRange
                showReset={ false}
                showClose= {false}
                showSelectionInfo={false}
                showClose={false}
                // showButton={false}
                minDate={moment()}
                maxDate={moment(`Dec 31 ${moment().format('YYYY')}`)}
                // onSelect={date=>console.log(date)}
                selectedBackgroundColor={color.light_green}
                buttonColor={colors.white}
                buttonContainerStyle={{backgroundColor:colors.light_green,borderRadius:100}}
                onConfirm={next}
            />
               
        )
    }
    submit=()=>{
        this.setState({isLoading:true})
        axios('post',api.book_arena(this.props.booking.arena_id),{arena_booking_request:this.props.booking},true)
        .then(({data})=>{
            this.setState({isLoading:false})
            if(data.error){
                alert(data.msg)
                this.setState({showModal:true})
                return
            }
            this.props.navigation.navigate("done")
        })
        .catch(e=>{
            this.setState({isLoading:false})
            console.log(e)
        })
    }
    renderDatepicker = (param)=>{

        const next=()=>{
           
            if(param=="to_time"){
                this.submit()
                return
            }else
            this.next({to_time:true})
        }
        return(
            <View style={{flex:1,paddingTop:50,justifyContent:"space-between"}}>
                {this.state.showModal&&<DateTimePicker
                    value={moment(this.props.booking[param]).toDate()}
                    mode={"time"}
                    display="spinner"
                    onChange={(event,date)=>{
                        if(!date){
                            this.props.navigation.pop()
                            return
                        }
                        if(Platform.OS=="android"){
                            this.setState({showModal:false})
                        }
                        this.props.dispatch({type:"SET_BOOKING_TIME",key:param,data:moment(date).format("HH:mm:ss")})
                        if(Platform.OS=="android"){
                            next()
                        }
                    }}
                />}
                {Platform.OS=="ios"&&
                    <Button isLoading={this.state.isLoading} onPress={next} placeholder="Next" style={{backgroundColor:colors.light_green,marginTop:20,}}/>
                }
            </View>
        )
    }
    
    renderForm=()=>{
        const {params} = this.state
        if(params.from_time){
            return this.renderDatepicker("from_time")
        }else if(params.to_time){
            return this.renderDatepicker("to_time")
        }else{
            return this.renderCalender()
        }
    }
    render() {
        return (
            <ImageBackground style={styles.background} source={require('../../images/app_background.png')}>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
                <View style={styles.titleContainer}>
                    <Text style={[styles.title,this.state.params.calender&&{color:colors.white}]}>{this.props.booking.from_time? (moment(this.props.booking.from_time).format("DD MMM") +" - " + moment(this.props.booking.to_time).format("DD MMM")): "Booking For"}</Text>                    
                    <View style={{flexDirection:"row",marginTop:10}}>
                        <Icon name="access-time" color={colors.grey} size={18} style={{marginRight:2}} />
                        <Text style={[styles.subtitle,this.state.params.from_time && {color: colors.white, }]}>From Time <Text style={{color:colors.grey}}>-</Text> <Text style={[{color:colors.grey},this.state.params.to_time && {color: colors.white}]}>To Time</Text></Text>                    
                    </View>
                </View>
                <View style={styles.topRounded}>
                    {this.state.isLoading && Platform.OS=="android" && <ActivityIndicator size="large" color={colors.grey}/>}
                
                    {
                        this.renderForm()
                    }
                </ View>
            </ImageBackground>
        )
    }
}


const styles=StyleSheet.create({
    titleContainer:{
        marginTop:130,
        marginLeft:20
    },
    title:{
        color:colors.grey,
        fontSize:32,
    },
    subtitle:{
        marginTop:0,
        color: colors.grey,
        fontSize:16
    },
    
    
    root:{
        flexGrow:1,
        alignItems:"center",
        
    },
    topRounded:{
        backgroundColor:colors.white,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        flex:1,
        justifyContent:"center",
        marginTop:20,
        paddingVertical:5,
        paddingHorizontal:30,
        paddingVertical:20
    },
   
    background:{
        resizeMode:"cover",
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"stretch",
    }
})