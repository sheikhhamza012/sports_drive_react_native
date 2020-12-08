import React, { Component } from 'react'
import  { Text , View, ScrollView,StyleSheet,Image, ImageBackground, ActivityIndicator} from 'react-native'
import Button from '../../reuseableComponents/button'
import { colors,api } from '../../constants'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Rating from 'react-native-star-rating'
import {Arena} from '../player/booking_search'
import moment from 'moment'
import {axios} from '../../reuseableComponents/externalFunctions'
export default class Profile extends Component {
    state={}
    componentDidMount = async()=> {
        this.setState({isLoading:true})
        const res = await axios('get',api.arena_booking_requests,null,true)
        this.setState({isLoading:false})
        this.props.dispatch({type:"MY_ARENA_BOOKING_REQUESTS",data:res.data.requests??[]})
    }

    render() {
        console.log(this.props.user)

        return (
            <ImageBackground style={styles.background} source={require('../../images/app_background.png')}>
                <ScrollView style={{marginTop:130}} contentContainerStyle={styles.root}>
                    <View style={styles.heading}>
                        <View style={[{width:25},styles.line]}/>
                        <Image source={{uri:this.props.user.image}} style={styles.profilePics}/>
                        <View style={[{flex:1},styles.line]}/>
                    </View>
                    <View  style={styles.body}>
                        
                        <View style={styles.row}>
                            <View>
                                <Text style={styles.nameText}>{this.props.user.first_name} {this.props.user.last_name}</Text>
                                {this.props.user.player_of&&<Text style={styles.nameText}>{this.props.user.player_of}er</Text>}
                                {!this.props.user.player_of&&<Text style={[styles.nameText,{fontWeight:"normal",color:colors.grey}]}>Edit the sports you play</Text>}
                                
                                <Text style={[styles.nameText,{fontWeight:"normal"}]}>{this.props.user.city}</Text>
                            </View>
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate("update_profile")}>
                                <Icon name="circle-edit-outline" color={colors.white} size={22}/> 
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.row}>
                            <View>
                                <Text style={styles.nameText}>About</Text>
                                {this.props.user.about&&<Text style={[styles.nameText,{fontWeight:"normal"}]}>{this.props.user.about}</Text>}
                                {!this.props.user.about&&<Text style={[styles.nameText,{fontWeight:"normal",color:colors.grey}]}>Your about tab is empty</Text>}
                            </View>
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate("update_about")}>
                                <Icon name="circle-edit-outline" color={colors.white} size={22}/> 
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <View>
                                <Text style={styles.nameText}>Featured</Text>
                                {this.props.user.featured&&<Text style={[styles.nameText,{fontWeight:"normal"}]}>{this.props.user.featured}</Text>}
                                {!this.props.user.featured&&<Text style={[styles.nameText,{fontWeight:"normal",color:colors.grey}]}>Your featured tab is empty</Text>}
                            </View>
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate("update_featured")}>
                                <Icon name="circle-edit-outline" color={colors.white} size={22}/> 
                            </TouchableOpacity>
                        </View>

                        <View style={styles.score_container}>
                            <Text >
                                Your Dashboard
                            </Text>
                            <View style={styles.row}>
                                <View style={styles.card}> 
                                    <Text style={styles.score}>14</Text>
                                    <Text style={styles.score_type}>Total Games</Text>
                                </View>
                                <View style={styles.card}> 
                                    <Text style={styles.score}>14</Text>
                                    <Text style={styles.score_type}>Winner</Text>
                                </View>
                                <View style={styles.card}> 
                                    <Text style={styles.score}>14</Text>
                                    <Text style={styles.score_type}>Invitations</Text>
                                </View>
                            </View>
                        </View>

                        <Rating
                            disabled={true}
                            emptyStar={'star-o'}
                            fullStar={'star'}
                            halfStar={'star-half'}
                            iconSet={'FontAwesome'}
                            maxStars={5}
                            rating={this.props.user.rating}
                            // selectedStar={(rating) => this.onStarRatingPress(rating)}
                            starSize={22}
                            fullStarColor={colors.white}
                            emptyStarColor={colors.yellow}
                            containerStyle={{paddingVertical:20,paddingHorizontal:100}}
                        />

                    </View>
                    {/* <View style={[styles.body,styles.requestContainer]}>
                        <Text style={styles.arenaTitle}>Arena Requests</Text>
                        {this.state.isLoading&&<ActivityIndicator />}
                        {!this.state.isLoading && !this.props.user.arena_booking_requests?.length&&<Text >No requests found</Text>}
                        
                        {(this.props.user.arena_booking_requests??[]).map((row,i)=>
                            <Arena id={row.arena.id} key={row.arena.id} onPress={()=>{}} name={row.arena.name} location={row.arena.location} image = {row.arena.image}>
                                <View style={{flexDirection:"row"}}>
                                    <Icon name="clock-outline" size={16} style={{marginRight:2}}/>
                                    <Text>{moment(row.from_time).format('DD MMM')} - {moment(row.to_time).format('DD MMM')} . <Text style={styles[row.status]}>{row.status}</Text></Text>
                                </View>
                            </Arena>
                        )}
                    </View> */}
                        
                </ScrollView>
            </ImageBackground>
        )
    }
}


const styles=StyleSheet.create({
    requestContainer:{
        backgroundColor:colors.white,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        paddingTop:20,
        paddingBottom:10
    },
    Accepted:{color:colors.light_green},
    Declined:{color:colors.red},
    body:{
        paddingHorizontal:25,
        width:"100%",
        marginTop:10
    },
    score:{fontSize:26,color:colors.blue_2},
    score_type:{fontSize:11},
    card:{
        flex:1,
        borderRadius:5,
        padding:10,
        backgroundColor:colors.white,
        margin:5,
        marginTop:10,
        borderColor:colors.grey,
        borderBottomWidth:2,
        borderRightWidth:2,
    },
    score_container:{
        backgroundColor:colors.light_grey,
        borderRadius:4,
        padding:10,
        paddingBottom:0
    },
    row:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:20
    },
    nameText:{
        color:colors.white,
        fontSize:18,
        fontWeight:"bold",
        marginVertical:2
    },
    arenaTitle:{
        fontSize:18,
        marginBottom:10,
        // fontWeight:"bold",
        marginVertical:2
    },
    profilePics:{
        backgroundColor:colors.light_green,
        width:80,
        height:80,
        borderRadius:100,
        borderWidth:5,
        borderColor:colors.white
    },
    heading:{
        flexDirection:"row",
    },
    line:{
        marginTop:40,
        height:2,
        backgroundColor:colors.grey
    },
    root:{
        flexGrow:1,
        paddingVertical:5,
        alignItems:"center"
    },
   
    background:{
        resizeMode:"cover",
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"stretch",
    }
})