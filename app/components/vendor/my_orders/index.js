import React, { Component } from 'react'
import { Text, View, RefreshControl,StyleSheet } from 'react-native'
import {api,colors} from '../../../constants'
import {axios} from '../../../reuseableComponents/externalFunctions'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import moment from 'moment'
export default class index extends Component {
    state={
        requests:[]
    }
    componentDidMount = ()=> {
        this.setState({isLoading:true})
        axios('get',api.all_orders,null,true)
        .then(({data})=>{
            this.setState({isLoading:false})
            if(data.error){
                this.refs.toast.show(data.msg)
                return
            }
            this.setState({requests:data.requests??[]})
            
        })  
        .catch(e=>{
            console.log(e)
            this.setState({isLoading:false})
        })
    }
    get_data = ()=>{
        if(this.props.route.name.includes("Upcoming")){
            return this.state.requests.filter(x=>moment(x.request.from_time).isSameOrAfter(moment()))
        }else{
            return this.state.requests.filter(x=>moment(x.request.from_time).isBefore(moment()))

        }
    }
    
    render() {
        // console.log(this.get_data().length)
        return (
            <ScrollView contentContainerStyle={styles.root} refreshControl={<RefreshControl refreshing={this.state.isLoading} onRefresh={this.componentDidMount}/>}>
                {this.get_data().map(x=>
                    <Item 
                    onPress={()=>this.props.navigation.navigate('view_order',{id:x.request.id})}
                    showButton={false}  data={x} />
                )}

            </ScrollView>
        )
    }
}
class Item extends Component {
    render() {
        const {data} = this.props
        console.log(data)
        return (
            <TouchableOpacity onPress={this.props.onPress} style={[styles.arena_container,this.props.style]}>
                <View>
                    <Text style={{fontWeight:"bold"}}>{data.user.first_name}</Text>
                    <Text style={styles.arena_detail}>{data.field.name}</Text>
                    <Text style={styles.arena_detail}>Time Slot {moment(data.request.from_time).format("hh:mm a")} to {moment(data.request.to_time).format("hh:mm a")}</Text>
                    {/* <Text style={styles.arena_detail}>{data.request.from_time}</Text> */}
                </View>
                <View>
                    {(this.props.showPrice??true)&&<Text style={{color:colors.grey,textAlign:"right"}}>Rs {data.request.price}</Text>}
                    {(this.props.showButton??true)&&<Button placeholder={"REBOOK"} onPress={this.searchByAvailability} style={styles.arenaButton} placeholderStyle={{fontSize:10}} />}

                </View>
            </TouchableOpacity>
        )
    }
}
const styles=StyleSheet.create({

    title:{
        color:colors.grey,
        fontSize:16
    },
    arena_container:{
        marginVertical:0,
        paddingVertical:10,
        borderBottomWidth:0.5,
        borderColor:colors.grey,
        flexDirection:"row",
        justifyContent:"space-between",paddingHorizontal:5
    },
    arena_detail:{
        fontSize:12,
        color:colors.grey
    },
    header:{
        backgroundColor:colors.light_grey3,
        paddingHorizontal:10,
        paddingVertical:5,
        marginVertical:10
    },
    root:{
        flexGrow:1,
        padding:20,
        // paddingHorizontal:30,
        alignItems:"stretch",
    },   
    
    arenaButton:{borderRadius:4,height:25,marginTop:5,width:70,backgroundColor:colors.blue,alignSelf:"center"}
})