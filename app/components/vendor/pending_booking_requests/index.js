import React, { Component } from 'react'
import { Text, View, ScrollView, StyleSheet, RefreshControl } from 'react-native'
import {global_styles,colors,api} from '../../../constants'
import Button from '../../../reuseableComponents/button'
import {axios} from '../../../reuseableComponents/externalFunctions'
import Toast from 'react-native-easy-toast'
import moment from 'moment'
import messaging from '@react-native-firebase/messaging';
import { ActivityIndicator } from 'react-native-paper'

export default class index extends Component {
    state={
        requests:[]
    }
    componentDidMount=()=>{

       
        // messaging().onMessage(this.componentDidMount);

        this.setState({isLoading:true})
        axios('get',api.pending_requests,null,true)
            .then(async({data})=>{
                this.setState({isLoading:false})
                if(data.error){
                    this.refs.toast.show(data.msg)
                    return
                }
                this.props.dispatch({type:"SET_SCREEN", key:'pending_booking_requests' , data:data.requests??[]})
                
            })
            .catch(x=>{
                this.setState({isLoading:false})
                console.log(x)
            })
    }
    renderList = ()=>{
        return(
           this.props.pending_booking_requests.map((x,id)=> <Item reload={this.componentDidMount} key={id} data={{username:`${x.user.first_name} ${x.user.last_name}`, from_time: x.request.from_time,to_time: x.request.to_time, field: x.field.field_type,id: x.request.id}}/>)
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
class Item extends Component {
    state={}
    accept=(id)=>{
        this.setState({isLoading:true})
        axios('patch',api.update_booking_requests(id),{status:"Accepted"},true)
            .then(async({data})=>{
                this.setState({isLoading:false})
                if(data.error){
                    alert(data.msg)
                    return
                }
                this.props.reload()
                
            })
            .catch(x=>{
                this.setState({isLoading:false})
                console.log(x)
            })
    }
    render() {
        const {data} = this.props
        return (
            <View style={styles.itemContainer}>
                <View style={{flex:1}}>

                    <Text style={styles.title}> {data.username}  {data.id}</Text>
                    <Text style={styles.subtitle}> Date: {moment(data.from_time).format("DD-MM-YYYY")} </Text>
                    <Text style={styles.subtitle}> Time: {moment(data.from_time).format("hh:mm a")} to {moment(data.to_time).format("hh:mm a")}</Text>
                    <Text style={styles.subtitle}> {data.field} </Text>
                </View>
                {this.state.isLoading?
                    <ActivityIndicator />
                :

                    <Button  placeholder={"ACCEPT"} onPress={()=>this.accept(data.id)} style={styles.arenaButton} placeholderStyle={{fontSize:10,color:colors.blue}} />
                }
            </View>
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