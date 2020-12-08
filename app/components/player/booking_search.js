import React, { Component } from 'react'
import  { Text, RefreshControl , View, ScrollView,StyleSheet,Image,TextInput, ImageBackground, ActivityIndicator, KeyboardAvoidingView} from 'react-native'
import Button from '../../reuseableComponents/button'
import { colors, api } from '../../constants'
import { TouchableOpacity } from 'react-native-gesture-handler'
// import MapView from 'react-native-maps'
import Icon from 'react-native-vector-icons/AntDesign'
import LineIcon from 'react-native-vector-icons/SimpleLineIcons'
import {axios,trim} from '../../reuseableComponents/externalFunctions'
import Rating from 'react-native-star-rating'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import Toast from 'react-native-easy-toast'
export default class SportsMenu extends Component {
    state={
        keyword:'',
        arenas:[],
        show_date:false,
        show_from_time:false,
        show_to_time:false,
        search:{}
    }

    componentDidMount = async()=> {
        this.setState({isLoading:true})
        const params = {
                keyword: this.state.keyword
        }
        const res = await axios('post',api.search,params,true)
        this.setState({arenas:res.data.arenas??[], isLoading:false})
    }
    getTimePlaceHolder=()=>{
        const {search } = this.state
        if(search.from_time){
            if(search.to_time){
                return moment(this.state.search.from_time).format("hh:mm a")+" - "+moment(this.state.search.to_time).format("hh:mm a")
            }
            return moment(this.state.search.from_time).format("hh:mm a")+" - End Time Missing"
        }
        return "Time"
        
    }
    search=x=>{
        this.setState({keyword:x.val,search:{}})
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
         }
        this.typingTimeout=setTimeout(() =>{
            this.componentDidMount()
        }, 1000)
    }
    selectArena=id=>{
        const {location,from_time,to_time, date} = this.state.search
        this.props.dispatch({type:"SET_BOOKING_PARAMS", data:id,key:"arena_id"})
        if (from_time&&to_time){

            this.props.dispatch({
                type:"SET_BOOKING_PARAMS",
                key:"date",
                data:date
            })
            this.props.dispatch({
                type:"SET_BOOKING_PARAMS",
                key:"from_time",
                data:from_time
            })
            this.props.dispatch({
                type:"SET_BOOKING_PARAMS",
                key:"to_time",
                data:to_time
            })
        }
        this.props.navigation.navigate("booking_details")
    }
    validateSearchForm=()=>{
        const {location,from_time,to_time, date} = this.state.search
        return (
            (location?.length??0) == 0 ||
            (date?.toISOString()?.length??0) == 0 ||
            (to_time?.toISOString()?.length??0) == 0 ||
            (from_time?.toISOString()?.length??0) == 0
        )
    }
    searchByAvailability = ()=>{

        const {location,from_time,to_time, date} = this.state.search
        if(this.validateSearchForm()){
            this.refs.toast.show("Please fill in all the fields to continue")
            return
        }
        this.setState({isLoading:true})
        const params ={
            location:location,
            from_time:moment(date).format("YYYY-MM-DD")+" "+moment(from_time).format("HH:mm"),
            to_time:moment(date).format("YYYY-MM-DD")+" "+moment(to_time).format("HH:mm"),
        }
        axios('post',api.search_by_availability,params,true)
        .then(({data})=>{
            this.setState({isLoading:false})
            if(data.error){
                this.refs.toast.show(data.msg)
            }
            this.setState({arenas:data.arenas??[], isLoading:false})
            
        })
        .catch(e=>{
            console.log(e)
            this.setState({isLoading:false})
        })
    }
    renderSearchForm=()=>{
        return(
            <>
                
                <TouchableOpacity style={styles.dateField} onPress={()=>this.setState({show_date:true})}>
                    <Icon style={{width:30}} name="calendar" size={26}/>
                    <Text style={{fontSize:16,marginLeft:10,fontWeight:"bold"}}>{this.state.search.date? moment(this.state.search.date).format("DD MMM, YYYY") : "Date"}</Text>
                    <DateTimePickerModal
                        isVisible={this.state.show_date}
                        mode="date"
                        minimumDate={moment().toDate()}
                        headerTextIOS="Select a Date"
                        onConfirm={(d)=>this.setState({show_date:false,search:{...this.state.search,date:d}})}
                        onCancel={()=>this.setState({show_date:false})}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateField} onPress={()=>this.location.focus()}>
                    <LineIcon style={{width:30}} name="location-pin" size={26}/>
                    <TextInput ref={r=>this.location=r} onChangeText={t=>this.setState({search:{...this.state.search,location: t}})} placeholderTextColor={colors.black} style={{fontSize:16,marginLeft:10,fontWeight:"bold"}} placeholder="Location"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateField}  onPress={()=>this.setState({show_from_time:true})}>
                    <Icon style={{width:30}} name="clockcircleo" size={22}/>
                    <Text style={{fontSize:16,marginLeft:10,fontWeight:"bold"}}>{this.getTimePlaceHolder() }</Text>
                    <DateTimePickerModal
                        isVisible={this.state.show_from_time}
                        mode="time"
                        headerTextIOS="Select start time"
                        date={moment().minute(0).toDate()}
                        onConfirm={(d)=>{
                                console.log(moment(d).utc())
                                this.setState({
                                    show_from_time:false,
                                    search:{
                                        ...this.state.search,
                                        from_time:d
                                    }
                                })
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
                        date={moment(this.state.search.from_time).add(1,'hour').toDate()}
                        minimumDate={moment(this.state.search.from_time).add(1,'hour').toDate()}
                        minuteInterval={30}
                        onConfirm={(d)=>{
                            if(d <= this.state.search.from_time || d < moment(this.props.booking.from_time).add(1,'hour').toDate()){
                                this.setState({show_to_time:false})
                                alert("End time should at least be 1 hour after start time")
                                return
                            }
                            this.setState({
                                show_to_time:false,
                                search:{
                                    ...this.state.search,
                                    to_time:d
                                }
                            })
                        }}
                        onCancel={()=>this.setState({show_to_time:false})}
                    />
                </TouchableOpacity>
                
                <Button placeholder={"Search"} onPress={this.searchByAvailability} style={{borderRadius:4,height:30,marginTop:10,width:100,backgroundColor:colors.blue,alignSelf:"center"}} placeholderStyle={{fontSize:12}} />
            </>
        )
    }
    render() {
        this.props.booking.from_time
        return (
            <ImageBackground style={styles.background} source={require('../../images/app_background.png')}>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
                <ScrollView style={{marginTop:130}} contentContainerStyle={styles.root}>
                   
                    {/* <Text style={styles.title_text}>Book Now</Text> */}
                    <View style={{paddingHorizontal:50,backgroundColor:colors.black,paddingVertical:20}}>
                        <SearchField name="search" handleInput={this.search} onSubmitEditing={this.componentDidMount} placeholder="Search For More Arenas" />
                    </View>
                    <Text style={{paddingHorizontal:20,paddingVertical:5,fontSize:10, color:colors.white, backgroundColor:colors.blue}}>Total Results: {this.state.arenas.length}</Text>
                    <View style={styles.body_container}>
                        <View style={styles.form}>
                            {this.renderSearchForm()}
                        </View>
                        <ScrollView refreshControl={<RefreshControl refreshing={this.state.isLoading}/>}>
                            {this.state.isLoading&&<ActivityIndicator style={{marginVertical:10}} />}
                            {this.state.arenas.length==0&&<Text style={{margin:10,textAlign:"center"}} >No records found</Text>}
                            {this.state.arenas.map(x=>
                                <Arena 
                                    id={x.id}
                                    key={x.id}
                                    onPress={this.selectArena}
                                    // onPress={()=>{}}
                                    name={x.name} 
                                    location={x.location} 
                                    image = {x.image}
                                />
                            )}
                        </ScrollView>
                    </View>
                </ScrollView>
            </ImageBackground>
        )
    }
}

export class Arena extends Component {
    state={}
    componentDidMount=async()=> {
        
    }

    render() {
        
        return (
            <View 
            // <TouchableOpacity 
             // onPress={()=>this.props.onPress(this.props.id)}
                style={styles.arenaContainer}>
                
                <View style={{flexDirection:"row"}}>
                    <Image source={{uri:this.props.image}} style={styles.arenaPic}/>
                    <View style={styles.arenaRightHalf}>
                        <View style={styles.arenaDetailContainer}>
                            <View style={styles.arenaDetail}>
                                <Text style={{fontWeight:"bold"}}>{this.props.name}</Text>
                                <Text style={{color:colors.grey}} >{trim(this.props.location,28)}</Text>
                                <Text style={styles.price}>Price: {"2000/- to 3000/-"} </Text>
                            </View>
                            <TouchableOpacity style={styles.heart}>
                                <Icon name="heart" color={colors.blue} size={20}/>
                            </TouchableOpacity>
                        </View>
                    
                        <View style={{flexDirection:"row",paddingTop:10,justifyContent:"space-between"}}>
                            <Rating
                                disabled={true}
                                emptyStar={'star-o'}
                                fullStar={'star'}
                                halfStar={'star-half'}
                                iconSet={'FontAwesome'}
                                maxStars={5}
                                rating={this.props.rating??5}
                                // selectedStar={(rating) => this.onStarRatingPress(rating)}
                                starSize={15}
                                fullStarColor={colors.grey}
                                emptyStarColor={colors.white}
                                containerStyle={{width:75,marginTop:5}}
                            />
                            <View style={{flexDirection:"row"}}>
                                <Button
                                    placeholder={"Availablity"} 
                                    style={styles.arenaButton} 
                                    placeholderStyle={{fontSize:8}} />
                                <Button 
                                    onPress={()=>this.props.onPress(this.props.id)}
                                    placeholder={"Book Now"}
                                    style={styles.arenaButton} 
                                    placeholderStyle={{fontSize:8}} 
                                />
                            </View>

                        </View>

                    </View>
                </View>
            </View>
        )
    }
}


class SearchField extends Component {
    render() {
        return (
            <View style={styles.search_field_containter}>
                <Icon name="search1" size={20} />
                <TextInput 
                    style={styles.search_field}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={colors.grey}
                    onSubmitEditing={this.props.onSubmitEditing}
                    onChangeText={t=>this.props.handleInput({name:this.props.name,val:t})}
                /> 

               
            </View>
        )
    }
}

const styles=StyleSheet.create({
    form:{
        padding:20,
        paddingHorizontal:30,
    },
    arenaButton:{
        borderRadius:4,
        height:25,
        width:60,
        backgroundColor:colors.blue,
        marginLeft:10
    },
    dateField:{
        flexDirection:"row",
        height:50,
        borderBottomColor:colors.grey,
        borderBottomWidth:1,
        alignItems:"center"
    },
    price:{
        fontSize:13,
        fontWeight:"bold",
        marginTop:2
    },
    arenaDetailContainer:{
        flexDirection:"row", 
    },
    arenaRightHalf:{
        flex:1,
        paddingLeft:15,
    },
    heart:{
        paddingTop:20,
    },
    arenaDetail:{
        borderBottomColor:colors.grey,
        borderBottomWidth:1,
        paddingBottom:5,
        paddingTop:5,
        flex:1
    },
    arenaPic:{
        width:120,
        height:120,
        resizeMode:"cover",
        borderRadius:5,
    },
    arenaContainer:{
        elevation:4,
        shadowColor: colors.grey,
        shadowOpacity: 0.8,
        shadowRadius: 4,
        shadowOffset: {
            height: 1,
            width: 1
        },
        flex:1,
        backgroundColor:colors.white,
        paddingHorizontal:15,
        paddingTop:20,
        paddingBottom:10
    },
    search_field_containter:{
        width:"100%",
        backgroundColor:colors.white,
        borderRadius:4,
        flexDirection:"row",
        padding:2,
        paddingHorizontal:20,
        alignItems:"center"
    },
    search_field:{
        padding:5,
        color:colors.black,
        
    },

    title_text:{
        fontSize:14,
        fontWeight:"bold",
        color:colors.white,
        marginBottom:30,
        fontSize:16
    },
    body_container:{
        backgroundColor:colors.white,
        // padding:20,
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
    }
})