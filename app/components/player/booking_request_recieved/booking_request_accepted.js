import React, { Component } from 'react'
import { Text, View,ScrollView,StyleSheet,Dimensions ,TouchableOpacity} from 'react-native'
import { colors} from '../../../constants'
import Rating from 'react-native-star-rating'
import {Carousel} from '../booking_details'
import {trim} from '../../../reuseableComponents/externalFunctions'
import moment from 'moment'
import Button from '../../../reuseableComponents/button'
import Icon from 'react-native-vector-icons/AntDesign'
import { accept} from '../../vendor/pending_booking_requests'
import {get_active_request} from '../../../navigation'
export default class booking_request_accepted extends Component {
    state={}
    render() {
        const{activeBooking} = this.props
        return (
            <ScrollView style={styles.root} contentContainerStyle={{flexGrow:1,paddingBottom:100}} >
                <View style={{borderBottomWidth:1,borderBottomColor:colors.light_grey3,paddingBottom:10,marginBottom:10,width:300,alignSelf:"center"}}>
                    <Text style={{fontSize:32,color:colors.blue,marginLeft:-10}}> {activeBooking?.arena?.name} </Text>
                    <Rating
                        disabled={true}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        halfStar={'star-half'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        rating={(activeBooking?.arena?.rating)??5}
                        // selectedStar={(rating) => this.onStarRatingPress(rating)}
                        starSize={15}
                        fullStarColor={colors.blue}
                        emptyStarColor={colors.white}
                        containerStyle={{width:75,marginTop:5}}
                    />
                    <Text style={{fontSize:18,color:colors.grey,marginLeft:-5}}> {trim(activeBooking?.arena?.location?.address, 30)} </Text>

                    <View style={{flexDirection:"row",alignItems:"center", marginVertical:10}}>
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
                <Carousel style={{width:Dimensions.get("screen").width,height:200,resizeMode:"cover",backgroundColor:"#333"}} images={[activeBooking?.arena?.image??'']}/>
                <View style={{marginTop:10,width:300,alignSelf:"center"}}>
                    <Text style={{fontSize:32,color:colors.blue,marginLeft:-10,paddingBottom:10}}> Booking Details </Text>
                    
                    <View style={{flex:1 ,paddingBottom:10,borderBottomWidth:1,borderBottomColor:colors.light_grey3, flexDirection:"row",justifyContent:"space-between"}}>
                        <Text style={{fontSize:18,color:colors.grey,marginLeft:-5}}>Tracking ID </Text>
                        <Text style={{fontSize:18,marginLeft:-5}}>{activeBooking?.id}</Text>
                    </View>

                    <View style={{flex:1 , flexDirection:"row",marginTop:10,justifyContent:"space-between"}}>
                        <Text style={{fontSize:18,color:colors.grey,marginLeft:-5}}>Arena </Text>
                        <Text style={{fontSize:18,marginLeft:-5}}>{activeBooking?.field?.name}</Text>
                    </View>
                    
                    <View style={{flex:1 , flexDirection:"row",marginTop:10,justifyContent:"space-between"}}>
                        <Text style={{fontSize:18,color:colors.grey,marginLeft:-5}}>Time Slot </Text>
                        <Text style={{fontSize:18,marginLeft:-5}}>{moment(activeBooking?.from_time).format("h:mm a")} - {moment(activeBooking.to_time).format("h:mm a")}</Text>
                    </View>
                    

                </View>
                <View style={{marginTop:10,alignItems:"center",backgroundColor:colors.light_grey3, marginVertical:10}}>
                    <View style={{paddingVertical:10,width:300,alignSelf:"center", flexDirection:"row", justifyContent:"space-between"}}>
                        <Text style={{fontSize:18,color:colors.grey,marginLeft:-5}}>Total </Text>
                        <Text style={{fontSize:18,marginLeft:-5}}>Rs. {activeBooking?.price}</Text>
                    </View>
                </View>
                <Button
                    isLoading={this.state.isLoading}
                    placeholder={"Cancel Booking"} 
                    style={[styles.arenaButton,{backgroundColor:colors.red,alignSelf:"center"}]} 
                    placeholderStyle={{fontSize:11}} 
                    onPress={()=>accept(activeBooking.id,this,"Canceled", ()=>{
                        get_active_request(this.props)
                        this.props.navigation.navigate('home')
                    })}
                />
            </ScrollView> 
        )
    }
}
const styles = StyleSheet.create({
    root:{
        paddingVertical:50,
    },
    arenaButton:{
        borderRadius:4,
        height:30,
        width:150,
        backgroundColor:colors.blue,
    },
})