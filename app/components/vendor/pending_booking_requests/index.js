import React, { Component } from 'react'
import { Text, View, ScrollView, StyleSheet, RefreshControl } from 'react-native'
import {global_styles,colors,api} from '../../../constants'
import Button from '../../../reuseableComponents/button'
import {axios} from '../../../reuseableComponents/externalFunctions'
import Toast from 'react-native-easy-toast'
import moment from 'moment'
import messaging from '@react-native-firebase/messaging';
import { ActivityIndicator } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler'

export const fetchList=(ref)=>{
    ref.setState({isLoading:true})
    axios('get',api.pending_requests,null,true)
        .then(async({data})=>{
            ref.setState({isLoading:false})
            if(data.error){
                ref.refs.toast.show(data.msg)
                return
            }
            ref.props.dispatch({type:"SET_SCREEN", key:'pending_booking_requests' , data:data.requests??[]})
            
        })
        .catch(x=>{
            ref.setState({isLoading:false})
            console.log(x)
        })
}

export default class index extends Component {
    state={
        requests:[]
    }
    
    componentDidMount=()=>{

       
        // messaging().onMessage(this.componentDidMount);

        
    }
    renderList = ()=>{
        return(
           this.props.pending_booking_requests.map((x,id)=> <Item onPress={()=>this.props.navigation.navigate("show_pending_booking_requests",{id:x.request.id})} reload={this.componentDidMount} key={id} data={{username:`${x.user.first_name} ${x.user.last_name}`, from_time: x.request.from_time,to_time: x.request.to_time, field_name: x.field.name,id: x.request.id}}/>)
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
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.isLoading} onRefresh={this.componentDidMount}/>} style={{}} contentContainerStyle={styles.root}>
                    {this.renderList()}
                </ScrollView>
            </>
        )
    }
}
export const accept=(id,ref,status="Accepted",callback)=>{
    ref.setState({isLoading:true})
    axios('patch',api.update_booking_requests(id),{status:status},true)
        .then(async({data})=>{
            ref.setState({isLoading:false})
            if(data.error){
                alert(data.msg)
                return
            }
            fetchList(ref)
            callback()
            
        })
        .catch(x=>{
            ref.setState({isLoading:false})
            console.log(x)
        })
}
class Item extends Component {
    state={}
    
    render() {
        const {data} = this.props
        return (
            <TouchableOpacity onPress={this.props.onPress} style={styles.itemContainer}>
                <View style={{flex:1}}>

                    <Text style={styles.title}> {data.username}  {data.id}</Text>
                    <Text style={styles.subtitle}> Date: {moment(data.from_time).format("DD-MM-YYYY")} </Text>
                    <Text style={styles.subtitle}> Time: {moment(data.from_time).format("hh:mm a")} to {moment(data.to_time).format("hh:mm a")}</Text>
                    <Text style={styles.subtitle}> {data.field_name} </Text>
                </View>
                {this.state.isLoading?
                    <ActivityIndicator />
                :

                    <Button  placeholder={"ACCEPT"} onPress={()=>accept(data.id,this,"Accepted", ()=>{
                        this.props.reload()
                    })} style={styles.arenaButton} placeholderStyle={{fontSize:10,color:colors.blue}} />
                }
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    root:{
        backgroundColor:colors.blue,
        flexGrow:1,
        padding:20
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
        height:25,
        marginTop:5,
        width:70,
        backgroundColor:colors.white,
        alignSelf:"center"
    }

})