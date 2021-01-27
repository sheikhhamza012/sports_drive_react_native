import React, { Component } from 'react'
import  { Text, RefreshControl,TouchableOpacity,FlatList , View, ScrollView,StyleSheet,Image,TextInput, ImageBackground, ActivityIndicator, Platform, Dimensions} from 'react-native'
import Button from '../../../reuseableComponents/button'
import { colors, api, global_styles } from '../../../constants'
// import MapView from 'react-native-maps'
import Icon from 'react-native-vector-icons/AntDesign'
import {axios} from '../../../reuseableComponents/externalFunctions'
import Moment from 'moment'
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import Toast from 'react-native-easy-toast'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from 'react-native-modal';

export default class price_slots extends Component {
    state={
        form:{

        }
    }
    componentDidMount = ()=> {
        this.setState({isLoading:true})
        axios('get',api.get_price_slots_of_field(this.props.booking_calendar.field_id,this.props.booking_calendar.selectedDate),null,true)
        .then(({data})=>{
            this.setState({isLoading:false})
            if(data.error){
                this.refs.toast.show(data.msg)
                return
            }
            this.setState({prices:data.prices})
        })  
        .catch(e=>{
            console.log(e)
            this.setState({isLoading:false})
        })
    }
    validate=()=>{
        var valid = true
        const {form,prices} = this.state
        if(!form.from_time){
            valid=false
        }
        if(!form.to_time){
            valid=false
        }
        if(!form.price){
            valid=false
        }
        
        return valid
    }
    submit=(id)=>{
        const {form,prices} = this.state
        if(!this.validate()){
            return this.refs.toast.show("Please fill the form continue")
        }
        if(prices?.length){
            var range = moment.range(moment(this.props.booking_calendar.selectedDate+' '+moment(form.from_time).format("HH:mm")),moment(this.props.booking_calendar.selectedDate+moment(form.to_time).format(" HH:mm")))
            for(var i = 0; i<prices?.length;i++){
                var current_range = moment.range(moment(moment(prices[i].date).format("YYYY-MM-DD ")+moment(prices[i].from_time).format("HH:mm")),moment(moment(prices[i].date).format("YYYY-MM-DD ")+moment(prices[i].to_time).format("HH:mm")))
                if(current_range.overlaps(range)){
                    this.refs.toast.show("Price range already exists")
                    return false
                }
            }
        }
        this.setState({isSubmitting:true,form:{...form,show:""}})
        const params={
            "price":{
                "date":this.props.booking_calendar.selectedDate,
                "from_time":moment(form.from_time),
                "to_time":moment(form.to_time),
                "name":"Individual Field",
                "price":form.price,
                "price_type":"Individual Field"
            }
        }
        axios('post',api.create_price_for_field(this.props.booking_calendar.field_id),params,true)
        .then(({data})=>{
            this.setState({isSubmitting:undefined,form:{}})
            if(data.error){
                alert(data.msg)
                return
            }
            this.state.prices.unshift(data.price)
            this.forceUpdate()
        })
        .catch(e=>{
            this.setState({isSubmitting:false})
            console.log(e)
        })
        console.log(id)
    }
    form = (id)=>{
        return(
            <View>
                <DateTimePickerModal
                    isVisible={this.state.form.show=="from"}
                    mode="time"
                    {...moment().isSame(moment(this.props.booking_calendar.selectedDate),'days')&&{minimumDate:moment().minute(0).toDate()}}
                    minuteInterval={30}
                    date={moment().minute(0).toDate()}
                    headerTextIOS={"Select start time "}
                    onConfirm={(d)=>{
                            this.setState({form:{...this.state.form,show:"",from_time:d}})
                            
                            setTimeout(()=>{
                                this.setState({form:{...this.state.form,show:"to"}})
                            },500)
                        }
                    }xs
                    onCancel={()=>this.setState({form:{...this.state.form,show:"",}})}
                />
                <DateTimePickerModal
                    isVisible={this.state.form.show=="to"}
                    mode="time"
                    minimumDate={moment(this.state.form.from_time).add(1,'hour').minute(0).toDate()}
                    minuteInterval={30}
                    date={moment(this.state.form.from_time).add(1,'hour').minute(0).toDate()}
                    headerTextIOS="Select End time"
                    onConfirm={(d)=>{
                        // if(d <= this.state.showForm.from_time){
                        //     alert("End time should be after start time")
                        //     this.setState({showForm:{...this.state.showForm,show:""}})
                        //     return
                        // }
                        this.setState({form:{...this.state.form,show:"",to_time:d}})
                        setTimeout(()=>{
                            this.setState({form:{...this.state.form,show:"price"}})
                        },500)
                    }}
                    onCancel={()=>this.setState({form:{...this.state.form,show:""}})}
                />
                <Modal
                  onBackdropPress={()=>this.setState({form:{...this.state.form,show:""}})}
                  hasBackdrop={true}
                  backdropColor={"black"}
                  avoidKeyboard={true}
                  backdropOpacity={0.3}
                  isVisible={this.state.form.show=="price"}
                  animationType="slide"
                >

                    <View style={{backgroundColor:colors.white,padding:30,borderRadius:5}}>
                        <TextInput 
                            placeholder="Please enter the price" 
                            style={{padding:10,borderColor:colors.grey,borderWidth:1}}
                            keyboardType="numeric"
                            onChangeText={t=>this.setState({form:{...this.state.form,price:t}})}
                            onSubmitEditing={()=>this.submit(id)}   
                        />
                        
                        <Button
                            placeholder={"Update"} 
                            style={styles.arenaButton} 
                            placeholderStyle={{fontSize:11}} 
                            onPress={()=>this.submit(id)}    
                        />
                            
                    </View>
              </Modal>
              
            </View>
        )
    }

    hour_prices=(type)=>{
        
        return(
            <>
                <View style={{borderBottomColor:colors.grey,borderBottomWidth:1,paddingBottom:10}}>
                    <Text style={{fontSize:14,fontWeight:"bold",marginVertical:10}}>{`Set Hours Price`}</Text>
                        <TouchableOpacity onPress={()=>this.setState({form:{...this.state.form,show:"from"}})} style={{flexDirection:"row" , alignItems:"center"}}>
                            {this.form(this.props.booking_calendar.field_id)}
                            {this.state.isSubmitting?
                                <ActivityIndicator style={{width:30}} />
                            :
                                <Icon style={{width:30}} size={20} color={colors.grey} name="clockcircleo"/>
                            }
                            <Text style={{color:colors.grey,flex:1}}>{(this.state.form.from_time? moment(this.state.form.from_time).format("hh:mm a"): "From Time")} - {(this.state.form.to_time? moment(this.state.form.to_time).format("hh:mm a"): "To Time")} </Text>
                            <View style={{backgroundColor:colors.blue,padding:15,borderRadius:10,paddingVertical:5}}>
                                <Text style={{color:colors.white,fontSize:10}}>{this.state.form.price??0}/-</Text>
                            </View>
                        </TouchableOpacity>
                </View>
            </>
        )
    }

    render() {
        console.log(this.props.booking_calendar,'<<<<<<<<<<<')
        return (
            <>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.isLoading} onRefresh={this.componentDidMount}/>} contentContainerStyle={styles.root}>
                    {/* <Text> textInComponent </Text> */}
                    {this.hour_prices()}
                    <Text style={{textAlign:"center",marginVertical:15,fontWeight:"bold"}}>Hourly Prices</Text>
                    {(this.state.prices??[]).map(x=>
                        <Slot data={x} showClose={moment(moment(x.date).format("YYYY-MM-DD ")+moment(x.from_time).format("HH:mm")).isSameOrAfter(moment())}/>
                    )}
                </ScrollView>
            </>
        )
    }
}
class Slot extends Component {
    state={}
    delete=()=>{
        this.setState({isSubmitting:true})
        axios('delete',api.delete_price_slot(this.props.data.id),null,true)
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
        console.log(this.props.data.from_time,moment(moment(this.props.data.from_time.date).format("YYYY-MM-DD ")+moment(this.props.data.from_time).format("HH:mm")).isSameOrAfter(moment()))
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
                    <View style={styles.slot_time}>
                        <Text>{(this.props.data.price??0)}/-</Text>
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
const styles=StyleSheet.create({
    root:{
        paddingHorizontal:25
    },
    arenaButton:{
        borderRadius:4,
        height:30,
        // width:150,
        backgroundColor:colors.blue,
        marginVertical:10
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
        margin:10,
        marginHorizontal:5
    }
})