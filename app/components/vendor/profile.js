import React, { Component } from 'react'
import  { Text , View, ScrollView,StyleSheet,Image, ImageBackground, ActivityIndicator} from 'react-native'
import Button from '../../reuseableComponents/button'
import { colors,api } from '../../constants'
import {axios} from '../../reuseableComponents/externalFunctions'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Rating from 'react-native-star-rating'
import {Arena} from '../player/booking_search'
import moment from 'moment'
import {Card} from './my_arena'
export default class Profile extends Component {

    state={isLoading:true}
    componentDidMount = async()=> {
        this.setState({isLoading:true})
        const res = await axios('get',api.my_arenas,null,true)
        console.log(res.data)
        this.setState({isLoading:false})
        this.props.dispatch({type:"SET_SCREEN",key:"my_arena",data:res.data.arena??[]})
    }
    render() {
        console.log(this.props.my_arena)

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
                                <Text style={styles.nameText}>{this.props.user.email} | {this.props.user.phone}</Text>
                                
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
                        

                        <View style={styles.score_container}>
                            <View style={styles.row}>
                                <View>
                                    <Text >Arena</Text>
                                </View>
                                <TouchableOpacity onPress={()=>this.props.navigation.navigate("update_about")}>
                                    <Icon name="circle-edit-outline" color={colors.blue} size={22}/> 
                                </TouchableOpacity>
                            </View>
                            <Card data = {{image:this.props.my_arena.image,location:(this.props.my_arena.location??{}),name:this.props.my_arena.name,rating:this.props.my_arena.rating}}/>   

                        </View>


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
        padding:20,
        paddingBottom:10
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