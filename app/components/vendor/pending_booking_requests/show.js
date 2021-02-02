import React, { Component } from 'react'
import { Text, View, ScrollView, StyleSheet, RefreshControl } from 'react-native'
import {global_styles,colors,api} from '../../../constants'
import Button from '../../../reuseableComponents/button'
import {axios} from '../../../reuseableComponents/externalFunctions'
import Toast from 'react-native-easy-toast'
import moment from 'moment'
import messaging from '@react-native-firebase/messaging';
import { ActivityIndicator } from 'react-native-paper'
import { color } from 'react-native-reanimated'
import {accept} from './index'
export default class index extends Component {
    state={
        request:{}
    }
    componentDidMount=()=>{

       this.setState({request:this.props.pending_booking_requests.find(x=>x.request.id==this.props.route.params.id)})

        
    }
    renderList = ()=>{
        return(
           this.props.pending_booking_requests.map((x,id)=> <Item reload={this.componentDidMount} key={id} data={{username:`${x.user.first_name} ${x.user.last_name}`, from_time: x.request.from_time,to_time: x.request.to_time, field: x.field.field_type,id: x.request.id}}/>)
        )
    }
    render() {
        console.log(this.state.request)
        return (
            <>
                <Toast 
                        ref="toast"
                        position='bottom'
                        positionValue={200}
                    />
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.isLoading} onRefresh={this.componentDidMount}/>} style={{}} contentContainerStyle={styles.root}>
                    <View style={{justifyContent:"center",alignItems:"center",flex:1}}>
                        <Text style={{fontSize:20,fontWeight:"700", color:colors.white}}>{this.state.request.user?.first_name} {this.state.request.user?.last_name}</Text>
                        <Text style={{fontSize:18,color:colors.white}}>Wants to book your {this.state.request?.field?.field_type}</Text>
                        <Button  placeholder={"ACCEPT"} onPress={()=>accept(this.props.route.params.id)} style={styles.arenaButton} placeholderStyle={{fontSize:18,color:colors.blue}} />
                        <Button  placeholder={"DECLINE"} onPress={()=>accept(this.props.route.params.id,this,"Declined")} style={styles.declineArenaButton} placeholderStyle={{fontSize:11,color:colors.white}} />

                    </View>
                    <View style={{height:200,backgroundColor:colors.white, borderTopEndRadius:50,borderTopLeftRadius:50,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{fontSize:20,fontWeight:"700", color:colors.blue}}>{this.state.request.user?.first_name} {this.state.request.user?.last_name}</Text>
                        <Text style={{fontSize:18,color:colors.blue}}>Date: {moment(this.state.request?.from_time).format("DD-MM-YYYY")}</Text>
                        <Text style={{fontSize:18,color:colors.blue}}>Time: {moment(this.state.request?.from_time).format("hh:mm a")} to {moment(this.state.request?.to_time).format("hh:mm a")}</Text>
                        <Text style={{fontSize:18,color:colors.blue}}>{this.state.request.field?.name}</Text>
                 
                    </View>
                </ScrollView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    root:{
        backgroundColor:colors.blue,
        flexGrow:1,
    },
    itemContainer:{
        backgroundColor:colors.white,
        padding:10,
        borderRadius:10,
        flexDirection:"row",
        paddingRight:20,
        marginVertical:10
    },
    title:{
        color:colors.blue,
        fontWeight:"bold"
    },
    subtitle:{
        color:colors.dark_grey,
        fontSize:11
    },
    arenaButton:{
        borderRadius:4,
        height:45,
        marginTop:20,
        width:200,
        backgroundColor:colors.white,
        alignSelf:"center"
    },
    declineArenaButton:{
        borderRadius:4,
        height:25,
        marginTop:25,
        width:70,
        backgroundColor:colors.red,
    }

})