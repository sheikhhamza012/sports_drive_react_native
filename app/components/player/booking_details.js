import React, { Component } from 'react'
import  { Text, RefreshControl,TouchableOpacity,FlatList , View, ScrollView,StyleSheet,Image,TextInput, ImageBackground, ActivityIndicator, Platform, Dimensions} from 'react-native'
import Button from '../../reuseableComponents/button'
import { colors, api } from '../../constants'
// import MapView from 'react-native-maps'
import Icon from 'react-native-vector-icons/AntDesign'
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
        axios('get',api.get_arena(this.props.booking.arena_id),null,true)
        .then(({data})=>{
            this.setState({isLoading:false})
            if(data.error){
                this.refs.toast.show(data.msg)
                return
            }
            this.setState({arena:data.arena})
        })  
        .catch(e=>{
            console.log(e)
            this.setState({isLoading:false})
        })
    }
   
    getTimePlaceHolder=()=>{
        const {booking } = this.props
        if(booking.from_time){
            if(booking.to_time){
                return moment(booking.from_time).format("hh:mm a")+" - "+moment(booking.to_time).format("hh:mm a")
            }
            return moment(booking.from_time).format("hh:mm a")+" - End Time Missing"
        }
        return "Pick Time"
        
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
            this.props.dispatch({type:"SET_ACTIVE_REQUEST",data:data.request})
            this.props.navigation.navigate("booking_request_recieved")
        })
        .catch(e=>{
            this.setState({isSubmitting:false})
            console.log(e)
        })
    }
    render() {
        return (
            <ImageBackground style={styles.background} source={require('../../images/app_background.png')}>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
               <ScrollView style={{marginTop:130}} contentContainerStyle={styles.root}>
                    {/* <View style={{paddingHorizontal:50,backgroundColor:colors.black,paddingVertical:30}}>
                    </View> */}
                    <View style={[styles.body,{paddingVertical:10}]}>
                        {this.state.isLoading&&<ActivityIndicator />}
                    </View>     
                    {!this.state.isLoading&&
                        <>
                            <View style={styles.body}>
                                <Info data={this.state.arena}/>
                            </View>     
                            <Carousel style={{width:Dimensions.get("screen").width,height:200,resizeMode:"cover",backgroundColor:"#333"}} images={[this.state.arena.image??'']}/>
                        </>
                    }
                    <View style={styles.body}>
                        <View style={styles.bookingForm}>
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
                        </View>
                        <Button
                            isLoading={this.state.isSubmitting}
                            onPress={this.submit}
                            placeholder={"Reserve"} 
                            style={[styles.arenaButton,{alignSelf:"center",marginVertical:20}]} 
                            placeholderStyle={{fontSize:11}} />
                    </View>  
   
                </ScrollView>
            </ImageBackground>
        )
    }
}

class Info extends Component {
    render() {
        const {data} = this.props
        return (
            <View style={{marginVertical:15}}>
                <Text style={styles.info_name}>{data.name}</Text>
                <Rating
                    disabled={true}
                    emptyStar={'star-o'}
                    fullStar={'star'}
                    halfStar={'star-half'}
                    iconSet={'FontAwesome'}
                    maxStars={5}
                    rating={data.rating??5}
                    // selectedStar={(rating) => this.onStarRatingPress(rating)}
                    starSize={15}
                    fullStarColor={colors.blue}
                    emptyStarColor={colors.white}
                    containerStyle={{width:75,marginTop:5}}
                />
                <Text style={styles.info_location}>{data.location}</Text>
                <View style={{flexDirection:"row",alignItems:"center"}}>

                    <Button
                        placeholder={"Show on Google Maps"} 
                        style={styles.arenaButton} 
                        placeholderStyle={{fontSize:11}} />

                    <TouchableOpacity style={{marginLeft:10}}>
                        <Icon name="heart" color={colors.grey} size={20}/>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
}
class Carousel extends Component {
    currentIndex=0
    next=()=>{
        let i = (this.props.images.length-1==this.currentIndex) ? (this.currentIndex=0) : (++this.currentIndex)
        this.carousel.scrollToIndex({
            index: i,
            animated: true,
        });
    }
    previous=()=>{
        let i = (0==this.currentIndex) ? (this.currentIndex=this.props.images.length-1) : (--this.currentIndex)
        this.carousel.scrollToIndex({
            index: i,
            animated: true,
        });
    }
    render() {
        const {data} = this.props
        return (
            <View>
                <FlatList
                    data={this.props.images}
                    style={{backgroundColor:"#ccc"}}
                    pagingEnabled
                    horizontal
                    ref={r=>this.carousel=r}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <Image source={{ uri: item }} style={ this.props.style}/> }
                />
                <View style={styles.carousel_nav}>
                    <TouchableOpacity onPress={this.previous}>
                        <Icon name="leftcircle" color={colors.white} size={22}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.next}>
                        <Icon name="rightcircle" color={colors.white} size={22}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


const styles=StyleSheet.create({
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
        paddingHorizontal:20
    },
    root:{
        flexGrow:1,
        paddingTop:5,
        // paddingHorizontal:30,
        alignItems:"stretch",
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
        width:150,
        backgroundColor:colors.blue,
    },
})