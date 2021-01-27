import React, { Component } from 'react'
import  { Text, RefreshControl,TouchableOpacity,FlatList , View, ScrollView,StyleSheet,Image,TextInput, ImageBackground, ActivityIndicator, Platform, Dimensions} from 'react-native'
import Button from '../../reuseableComponents/button'
import { colors, api, global_styles } from '../../constants'
// import MapView from 'react-native-maps'
import Icon from 'react-native-vector-icons/AntDesign'
import {axios} from '../../reuseableComponents/externalFunctions'
import DatepickerRange,{SingleDatepicker} from '../../reuseableComponents/react-native-range-datepicker';
import Moment from 'moment'
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import { color } from 'react-native-reanimated'
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-easy-toast'
import Rating from 'react-native-star-rating'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Info,Carousel} from '../player/booking_details'
import {Field} from '../signup'
import Modal from 'react-native-modal';

export default class SportsMenu extends Component {
    state={
       isLoading:false,
       showForm:{
           type:"",
           id:undefined,
           show:"",
           from_time:false,
           to_time:false,
           price:0
       },
       group:{

       }
    }

    componentDidMount = ()=> {
        this.setState({isLoading:true})
        axios('get',api.get_group(this.props.route.params.id),null,true)
        .then(({data})=>{
            this.setState({isLoading:false})
            if(data.error){
                this.refs.toast.show(data.msg)
                return
            }
            this.setState({group:data.group})
        })  
        .catch(e=>{
            console.log(e)
            this.setState({isLoading:false})
        })
    }
   
    update=(id,type)=>{
        if(this.validate(type)){
            return alert("Peak and Off peak time should not be overlapping")
        }
        this.setState({isSubmitting:type})
        const params={
            "price":{
                "from_time":moment(this.state.showForm.from_time),
                "to_time":moment(this.state.showForm.to_time),
                "price":this.state.showForm.price,
            }
        }
        axios('put',api.update_price(this.props.route.params.id,id),params,true)
        .then(({data})=>{
            this.setState({isSubmitting:undefined})
            if(data.error){
                alert(data.msg)
                return
            }
            let group = (data.arena.groups??[]).find(x=>x.id==this.props.route.params.id)
            this.props.dispatch({type:"SET_SCREEN",key:"my_arena",data:data.arena??{}})
            this.setState({group:{...this.state.group,...group}})
        })
        .catch(e=>{
            this.setState({isSubmitting:false})
            console.log(e)
        })
    }
    validate=(type)=>{
        let overlapping=false
        const overlap_check_with = type=="Peak"?"Off Peak":"Peak"
        let overlapping_prices = (this.state.group.prices??[]).filter(x=>x.price_type==overlap_check_with)
        for(let x of overlapping_prices){
            let x_from_time = moment(x.from_time).utc().format("HH:mm"), x_to_time = moment(x.to_time).utc().format("HH:mm")
            let range_opposite_time = moment.range(moment(x_from_time,"HH:mm"), moment(x_to_time,"HH:mm"));
            let range_of_new_time = moment.range(moment(this.state.showForm.from_time,"HH:mm"), moment(this.state.showForm.to_time,"HH:mm"));
            if(range_of_new_time.overlaps(range_opposite_time)){
                overlapping=true
                break
            }
            // console.log(range_of_new_time,"-----------")
        }
        return overlapping
    }
    create=(type)=>{
        if(this.validate(type)){
            return alert("Peak and Off peak time should not be overlapping")
        }
        this.setState({isSubmitting:type})
        const params={
            "price":{
                "from_time":moment(this.state.showForm.from_time),
                "to_time":moment(this.state.showForm.to_time),
                "name":type,
                "price":this.state.showForm.price,
                "price_type":type
            }
        }
        axios('post',api.create_price(this.props.route.params.id),params,true)
        .then(({data})=>{
            this.setState({isSubmitting:undefined})
            if(data.error){
                alert(data.msg)
                return
            }
            let group = (data.arena.groups??[]).find(x=>x.id==this.props.route.params.id)
            this.props.dispatch({type:"SET_SCREEN",key:"my_arena",data:data.arena??{}})
            this.setState({group:{...this.state.group,...group}})
        })
        .catch(e=>{
            this.setState({isSubmitting:false})
            console.log(e)
        })
    }
    form = (id,type)=>{
        const submit = ()=>{
            
            this.setState({showForm:{...this.state.showForm,show:""}})
            if(id){
                this.update(id,type)
            }else{
                this.create(type)
            }
        }
        return(
            <View>
                <DateTimePickerModal
                    isVisible={this.state.showForm.show=="from" && this.state.showForm.type==type}
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
                    isVisible={this.state.showForm.show=="to"&& this.state.showForm.type==type}
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
                        setTimeout(()=>{
                            this.setState({showForm:{...this.state.showForm,show:"price"}})
                        },500)
                    }}
                    onCancel={()=>this.setState({showForm:{...this.state.showForm,show:""}})}
                />
                <Modal
                  onBackdropPress={()=>this.setState({showForm:{...this.state.showForm,show:""}})}
                  hasBackdrop={true}
                  backdropColor={"black"}
                  avoidKeyboard={true}
                  backdropOpacity={0.3}
                  isVisible={this.state.showForm.show=="price"&& this.state.showForm.type==type}
                  animationType="slide"
                >

                    <View style={{backgroundColor:colors.white,padding:30,borderRadius:5}}>
                        <TextInput 
                            placeholder="Please enter the price" 
                            style={{padding:10,borderColor:colors.grey,borderWidth:1}}
                            keyboardType="numeric"
                            onChangeText={t=>this.setState({showForm:{...this.state.showForm,price:t}})}
                            onSubmitEditing={()=>submit(id,type)}   
                        />
                        
                        <Button
                            placeholder={"Update"} 
                            style={styles.arenaButton} 
                            placeholderStyle={{fontSize:11}} 
                            onPress={()=>submit(id,type)}    
                        />
                            
                    </View>
              </Modal>
            </View>
        )
    }
    hour_prices=(type)=>{
        const {prices} = this.state.group
       
        var prices_for_type = (prices??[]).filter(x=>x.price_type==type)
        // if(type=="Off Peak"&&prices_for_type.length==0){
        //     prices_for_type
        // }
        return(
            <View style={{borderBottomColor:colors.grey,borderBottomWidth:1,paddingBottom:10}}>
                <Text style={{fontSize:14,fontWeight:"bold",marginVertical:10}}>{`Set ${type} Hours Price`}</Text>
                {(prices_for_type.length==0? [{}] : prices_for_type).map(x=>
                    <TouchableOpacity onPress={()=>this.setState({showForm:{...this.state.showForm,show:"from",type:type}})} style={{flexDirection:"row" , alignItems:"center"}}>
                        {this.form(x.id,type)}
                        {this.state.isSubmitting==type?
                            <ActivityIndicator style={{width:30}} />
                        :
                            <Icon style={{width:30}} size={20} color={colors.grey} name="clockcircleo"/>
                        }
                            <Text style={{color:colors.grey,flex:1}}>{(x.from_time? moment(x.from_time).format("hh:mm a"): "From Time")} - {(x.to_time? moment(x.to_time).format("hh:mm a"): "To Time")} </Text>
                        <View style={{backgroundColor:colors.blue,padding:15,borderRadius:10,paddingVertical:5}}>
                            <Text style={{color:colors.white,fontSize:10}}>{x.price??0}/-</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        )
    }
    render() {

        return (
            <>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
               <ScrollView style={[global_styles.headerPadding]} contentContainerStyle={styles.root}>
                    {/* <View style={{paddingHorizontal:50,backgroundColor:colors.black,paddingVertical:30}}>
                    </View> */}
                    <View style={[styles.body,{paddingVertical:10}]}>
                        {this.state.isLoading&&<ActivityIndicator />}
                    </View>     
                    {!this.state.isLoading&&
                        <>
                            <View style={styles.body}>
                                <Info data={{name:this.state.group.arena_name,rating:this.state.group.rating,location:this.state.group.location?.address}}/>
                            </View>     
                            <Carousel style={{width:Dimensions.get("screen").width,height:200,resizeMode:"cover",backgroundColor:"#333"}} images={[this.state.group.image??'']}/>
                        </>
                    }
                    <View style={styles.body}>
                        {/* <View style={styles.bookingForm}>
                            <TouchableOpacity style={{flexDirection:"row",alignItems:"center",marginTop:10,alignSelf:"flex-end"}}>
                                <Text style={{color:colors.blue}}>Edit </Text>
                                <Icon name="menuunfold" color={colors.blue} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.setState({show_date:true})} style={{flexDirection:"row",marginVertical:10}}>
                                <Text style={{color:colors.grey,fontWeight:"bold"}}>Date: </Text>
                                <View style={styles.field}>
                                    <Text style={{color:colors.grey}}>{this.props.booking.date ? moment(this.props.booking.date).format("DD MMM, YYYY") : "Pick Date"}</Text>
                                </View>
                                <DateTimePickerModal
                                    isVisible={this.state.show_date}
                                    mode="date"
                                    minimumDate={moment().toDate()}
                                    headerTextIOS="Select a Date"
                                    onConfirm={(d)=>{
                                        this.setState({show_date:false})
                                        this.props.dispatch({type:"SET_BOOKING_PARAMS",key:"date",data:d})
                                    }}
                                    onCancel={()=>this.setState({show_date:false})}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.setState({show_from_time:true})} style={{flexDirection:"row",marginVertical:10}}>
                                <Text style={{color:colors.grey,fontWeight:"bold"}}>Time: </Text>
                                <View style={styles.field}>
                                    <Text style={{color:colors.grey}}>{this.getTimePlaceHolder()}</Text>
                                </View>
                                <DateTimePickerModal
                                    isVisible={this.state.show_from_time}
                                    mode="time"
                                    minuteInterval={30}
                                    date={moment().minute(0).toDate()}
                                    headerTextIOS="Select start time"
                                    onConfirm={(d)=>{
                                            this.setState({show_from_time:false,})
                                            this.props.dispatch({type:"SET_BOOKING_PARAMS",key:"from_time",data:d})

                                            setTimeout(()=>{
                                                this.setState({show_to_time:true})
                                            },500)
                                        }
                                    }
                                    onCancel={()=>this.setState({show_from_time:false})}
                                />
                                <DateTimePickerModal
                                    isVisible={this.state.show_to_time}
                                    mode="time"
                                    headerTextIOS="Select end time"
                                    date={moment(this.props.booking.from_time).add(1,'hour').toDate()}
                                    minimumDate={moment(this.props.booking.from_time).add(1,'hour').toDate()}
                                    minuteInterval={30}
                                    onConfirm={(d)=>{
                                        if(d <= this.props.booking.from_time || d < moment(this.props.booking.from_time).add(1,'hour').toDate()){
                                            alert("End time should at least be 1 hour after start time")
                                            this.setState({show_to_time:false})
                                            return
                                        }
                                        this.props.dispatch({type:"SET_BOOKING_PARAMS",key:"to_time",data:d})

                                        this.setState({show_to_time:false,})
                                    }}
                                    onCancel={()=>this.setState({show_to_time:false})}
                                />  
                            </TouchableOpacity>
                            <Text style={{alignSelf:"flex-end",marginTop:10,fontWeight:"bold"}}>Total Amount: {this.state.arena.price??0}/-</Text>
                        </View> */}
                        <Text style={{fontSize:16,fontWeight:"bold",marginVertical:10}}>Description</Text>
                        <Text>{"loremasdasdadasdasd"}</Text>
                        <Icon style={{width:30,alignSelf:"flex-end"}} size={20} color={colors.black} name="edit"/>

                        {this.hour_prices("Peak")}
                        {this.hour_prices("Off Peak")}
                        {this.hour_prices("Weekend")}
                        
                    </View>  
   
                </ScrollView>
            </>
        )
    }
}


const styles=StyleSheet.create({
    fieldStyle:{color:colors.black,fontSize:14},

    field:{
        width:150,
        alignItems:"center",
        borderBottomColor:colors.grey,
        borderBottomWidth:1
    },
    bookingForm:{
        backgroundColor:colors.white,
        paddingHorizontal:20,
        paddingVertical:10,
        borderRadius:10,
        elevation:4,
        shadowColor: colors.black,
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowOffset: {
            height: 1,
            width: 1
        },
        marginTop:20
    },
    carousel_nav:{
        position:"absolute",
        marginTop:75,
        paddingHorizontal:10,
        flexDirection:"row",
        justifyContent:"space-between",
        width:"100%"
    },
    fieldStyle:{color:colors.black,fontSize:14},

    info_name:{
        fontSize:16,
        fontWeight:"bold",
        
    },  
    info_location:{
        color:colors.grey,
        marginVertical:5
    },  
    body:{
        backgroundColor:colors.white,
        paddingHorizontal:20,
        paddingBottom:20
    },
    root:{
        paddingBottom:100,flexGrow:1,alignItems:"stretch"
    },   
    background:{
        resizeMode:"cover",
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"stretch",
    },
    arenaButton:{
        borderRadius:4,
        height:30,
        // width:150,
        backgroundColor:colors.blue,
        marginVertical:10
    },
})