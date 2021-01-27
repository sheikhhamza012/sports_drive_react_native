import React, { Component } from 'react'
import { Text, View, StyleSheet,TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {global_styles,colors,api} from '../../../constants'
import Icon from 'react-native-vector-icons/AntDesign'
import Moment, { utc } from 'moment'
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);import Button from '../../../reuseableComponents/button'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-easy-toast';
import {axios,trim} from '../../../reuseableComponents/externalFunctions'

export default class time_slots extends Component {
    
    state={
        showForm:{
            show:"",
            from_time:undefined,
            to_time:undefined,
        },
        requests:[]
    }
    componentDidMount = ()=> {
        this.setState({isLoading:true})
        axios('get',api.field_arena_booking_requests(this.props.booking_calendar.field_id,this.props.booking_calendar.selectedDate),null,true)
        .then(({data})=>{
            this.setState({isLoading:false})
            if(data.error){
                this.refs.toast.show(data.msg)
                return
            }
            this.setState({requests:(data.requests??[])})
        })  
        .catch(e=>{
            console.log(e)
            this.setState({isLoading:false})
        })
    }
    timeLeft = ()=>{
        var hours = 0
        for(var i in this.state.requests ){
            var current = moment.range(moment(this.state.requests[i].from_time),moment(this.state.requests[i].to_time))
            hours+=current.duration()/1000/60/60
        }

        return 24 - hours
    }
    submit=()=>{
        const {showForm} = this.state
        const {booking_calendar} = this.props
        if(!showForm.from_time||!showForm.to_time){
            this.refs.toast.show("Please fill in the form to continue")
            return
        }
        if(!booking_calendar.field_id){
            this.refs.toast.show("Please select the place to block")
            return
        }
        this.setState({isSubmitting:true})
        const params={
            arena_booking_request:{
                from_time: moment(booking_calendar.selectedDate+' '+moment(showForm.from_time).format("HH:mm")).toDate(),
                to_time: moment(booking_calendar.selectedDate+' '+moment(showForm.to_time).format("HH:mm")).toDate(),
            },
            status:"Blocked"
        }
        axios('post',api.book_arena(booking_calendar.field_id),params,true)
        .then(({data})=>{
            this.setState({isSubmitting:false})
            if(data.error){
                alert(data.msg)
                this.setState({showModal:true})
                return
            }
            this.state.requests.push(data.request)
            this.forceUpdate()
            this.refs.toast.show(`Request id processed`)
        })
        .catch(e=>{
            this.setState({isSubmitting:false})
            console.log(e)
        })
    }
    form = ()=>{
        return(
            <View>
                <DateTimePickerModal
                    isVisible={this.state.showForm.show=="from"}
                    mode="time"
                    minuteInterval={30}
                    date={moment().minute(0).toDate()}
                    headerTextIOS={"Select start time "}
                    onConfirm={(d)=>{
                            this.setState({showForm:{...this.state.showForm,show:"",from_time:d,}})
                            
                            setTimeout(()=>{
                                this.setState({showForm:{...this.state.showForm,show:"to"}})
                            },500)
                        }
                    }
                    onCancel={()=>this.setState({showForm:{...this.state.showForm,show:"",}})}
                />
                <DateTimePickerModal
                    isVisible={this.state.showForm.show=="to"}
                    mode="time"
                    minuteInterval={30}
                    date={moment(this.state.showForm.from_time).add(1,'hour').minute(0).toDate()}
                    headerTextIOS="Select End time"
                    onConfirm={(d)=>{
                        // if(d <= this.state.showForm.from_time){
                        //     alert("End time should be after start time")
                        //     this.setState({showForm:{...this.state.showForm,show:""}})
                        //     return
                        // }
                        this.setState({showForm:{...this.state.showForm,show:"",to_time:d}})
                        
                    }}
                    onCancel={()=>this.setState({showForm:{...this.state.showForm,show:""}})}
                />
            </View>
        )
    }
    renderBlockForm = ()=>{
        return(
            <View style={{borderBottomColor:colors.black,borderBottomWidth:1,paddingBottom:10}}>
                    {this.form()}
                    <TouchableOpacity onPress={()=>this.setState({showForm:{...this.state.showForm,show:"from"}})} style={{flexDirection:"row" , alignItems:"center"}}>
                        {this.state.isSubmitting=="type"?
                            <ActivityIndicator style={{width:30}} />
                        :
                            <Icon style={{width:30}} size={20} color={colors.black} name="clockcircleo"/>
                        }
                            <Text style={{color:colors.black,flex:1}}>{(this.state.showForm.from_time? moment(this.state.showForm.from_time).format("hh:mm a"): "From Time")} - {(this.state.showForm.to_time? moment(this.state.showForm.to_time).format("hh:mm a"): "To Time")} </Text>
                            <Button 
                                isLoading={this.state.isSubmitting}
                                onPress={this.submit}
                                placeholder={"Block"}
                                style={styles.arenaButton} 
                                placeholderStyle={{fontSize:8}} 
                            />
                    </TouchableOpacity>
            </View>
        )
    }
    render() {
        console.log(this.props.booking_calendar.field_id)
        return (
            <>
              <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
            <ScrollView refreshControl={<RefreshControl refreshing={this.state.isLoading} onRefresh={this.componentDidMount}/>} contentContainerStyle={styles.root}>
                <Text style={{fontSize:16,marginBottom:20,textAlign:"center"}}>{this.timeLeft()} Hours Available</Text>
                {this.props.route.name.includes("Blocked")&&moment(this.props.booking_calendar.selectedDate).isSameOrAfter(moment(),'day')&&this.renderBlockForm()}
                {this.props.route.name.includes("Blocked") ? 
                    <Text style={{textAlign:"center",marginVertical:15,color:colors.red}}>Blocked</Text>
                    :
                    <Text style={{textAlign:"center",marginVertical:15,color:colors.light_green}}>Booked</Text>
                }
                {this.state.requests.filter(x=>x.status==(this.props.route.name.includes("Blocked")?"Blocked":"Booked")).map(x=>
                    <Slot data={x} showClose={this.props.route.name.includes("Blocked")&&moment(x.from_time).isSameOrAfter(moment())}/>
                )}
            </ScrollView>
            </>
        )
    }
}
class Slot extends Component {
    state={}
    delete=()=>{
        axios('delete',api.delete_booking_request(this.props.data.id),null,true)
        .then(({data})=>{
            this.setState({isSubmitting:false})
            if(data.error){
                alert(data.msg)
                return
            }
            
            this.setState({isSubmitting:false,hide:true})
        })
        .catch(e=>{
            this.setState({isSubmitting:false})
            console.log(e)
        })
    }
    render() {
        return (
            <>
            {!this.state.hide&&
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <View style={styles.slot_time}>
                        <Text>{moment(this.props.data.from_time).format("hh:mm a")}</Text>
                    </View>
                    <Text>to</Text>
                    <View style={styles.slot_time}>
                        <Text>{moment(this.props.data.to_time).format("hh:mm a")}</Text>
                    </View>
                    {this.state.isSubmitting?
                        <ActivityIndicator />
                    :
                        <TouchableOpacity onPress={this.delete}>
                            {this.props.showClose&&<Icon name="close" size={22}/>}
                        </TouchableOpacity>
                    }
                </View>
            }
            </>
        )
    }
}

const styles = StyleSheet.create({
    root:{
        padding:20,
        
    },
    arenaButton:{
        borderRadius:4,
        height:25,
        width:60,
        backgroundColor:colors.red,
        marginLeft:10
    },
    slot_time:{
        flex:1,
        padding:10,
        elevation:4,
        backgroundColor:colors.white,
        borderRadius:10,
        alignItems:"center",

        shadowColor: colors.black,
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowOffset: {
            height: 1,
            width: 1
        },
        margin:10
    }
})