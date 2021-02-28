import React, { Component } from 'react'
import  { Text,Linking, RefreshControl,TouchableOpacity,FlatList , View, ScrollView,StyleSheet,Image,TextInput, ImageBackground, ActivityIndicator, Platform, Dimensions} from 'react-native'
import Button from '../../reuseableComponents/button'
import Icon from 'react-native-vector-icons/AntDesign'
import { colors, api } from '../../constants'
// import MapView from 'react-native-maps'
import {axios,getPrice} from '../../reuseableComponents/externalFunctions'
import DatepickerRange,{SingleDatepicker} from 'react-native-range-datepicker';
import moment from 'moment'
import { color } from 'react-native-reanimated'
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-easy-toast'
import Rating from 'react-native-star-rating'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Switch } from 'react-native-paper';
import {Card} from './my_arena'
export default class SportsMenu extends Component {
    state={
       isLoading:false,
       isSubmitting:false,
       arena:this.props.my_arena
    }

    componentDidMount = ()=> {
        // const {my_arena} = this.props
        // this.setState({isLoading:true,isSubmitting:true})
        
        // axios('get',api.get_arena(my_arena.id),null,true)
        // .then(({data})=>{
        //     this.setState({isLoading:false,isSubmitting:false})
        //     if(data.error){
        //         this.refs.toast.show(data.msg)
        //         return
        //     }

        //     this.setState({arena:data.arena})
        // })  
        // .catch(e=>{
        //     console.log(e)
        //     this.setState({isLoading:false,isSubmitting:false})
        // })
    }
    
   

    open_google_maps = (lat,lng, name)=>{
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = name;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });


        Linking.openURL(url); 
    }
  
   
    render() {
        console.log(this.state.arena)
        // console.log(moment.range(moment("2000-01-01 "+moment(this.props.booking.from_time).format("HH:mm")),moment("2000-01-01 "+moment(this.props.booking.to_time).format("HH:mm"))).duration()/1000/60/60)
        return (
            <ImageBackground style={styles.background} source={require('../../images/app_background.png')}>
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={200}
                />
               <ScrollView style={{marginTop:130}} contentContainerStyle={styles.root}>
                   
                    <View style={styles.body}>
                        <Info open_maps={()=>this.open_google_maps(this.state.arena.location?.coordinates?.lat,this.state.arena.location?.coordinates?.lng , this.state.arena.name)} data={{name:this.state.arena.name,rating:this.state.arena.rating,location:this.state.arena.location?.address}}/>
                    </View>     
                    <Carousel style={{width:Dimensions.get("screen").width,height:200,resizeMode:"cover",backgroundColor:"#333"}} images={[this.state.arena.image??'']}/>
                    <View style={styles.body}>
                        
                        <View>
                            <Text style={{fontSize:16,marginVertical:10}}>Description</Text>
                            <Text style={{marginBottom:20}}>Description</Text>
                        </View>
                        
                        <View>
                            <Text style={{fontSize:16,marginVertical:10}}>Sports </Text>
                            {this.state?.arena?.groups?.map(x=>
                                <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
                                    <Icon name="checksquare" />
                                    <Text style={{marginLeft:10}}>{x.name}</Text>
                                </View>
                            )}
                        </View>

                      
                    </View>  
   
                </ScrollView>
                
            </ImageBackground>
        )
    }
}

export class Info extends Component {
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
                        placeholderStyle={{fontSize:11}} 
                        onPress={this.props.open_maps}
                        />

                    <TouchableOpacity style={{marginLeft:10}}>
                        <Icon name="heart" color={colors.grey} size={20}/>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
}
export class Carousel extends Component {
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
        paddingVertical:15,
        backgroundColor:colors.white,
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
    arenaButton_submit:{
        borderRadius:10,
        // height:30,
        // width:150,
        backgroundColor:colors.blue,
    },
})